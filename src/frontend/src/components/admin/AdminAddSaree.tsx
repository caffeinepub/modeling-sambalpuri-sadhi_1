import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import {
  useCreateSareeListing,
  useUpdateSareeListing,
  useUploadFile,
} from "../../hooks/useQueries";
import { useGetAllSareeListings } from "../../hooks/useQueries";

interface AdminAddSareeProps {
  editSareeId?: string | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function AdminAddSaree({
  editSareeId,
  onSuccess,
  onCancel,
}: AdminAddSareeProps) {
  const isEditMode = !!editSareeId;

  const { data: allSarees } = useGetAllSareeListings();
  const editSaree = allSarees?.find((s) => s.id === editSareeId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [existingImageBlob, setExistingImageBlob] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createSaree, isPending: isCreating } =
    useCreateSareeListing();
  const { mutate: updateSaree, isPending: isUpdating } =
    useUpdateSareeListing();
  const { mutateAsync: uploadFile } = useUploadFile();

  const isSaving = isCreating || isUpdating || isUploading;

  // Populate form for edit mode
  useEffect(() => {
    if (isEditMode && editSaree) {
      setName(editSaree.name);
      setDescription(editSaree.description);
      setPrice(String(Number(editSaree.price)));
      setAvailable(editSaree.available);
      setImagePreview(editSaree.image.getDirectURL());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setExistingImageBlob(editSaree.image as any);
    }
  }, [isEditMode, editSaree]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormErrors((prev) => ({
        ...prev,
        image: "Please select an image file",
      }));
      return;
    }
    setImageFile(file);
    setFormErrors((prev) => ({ ...prev, image: "" }));
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setExistingImageBlob(null);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!description.trim()) errors.description = "Description is required";
    if (!price || Number.isNaN(Number(price)) || Number(price) <= 0) {
      errors.price = "Enter a valid price (greater than 0)";
    }
    if (!imageFile && !existingImageBlob) {
      errors.image = "Please upload a photo";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let finalBlob: ExternalBlob;

    try {
      if (imageFile) {
        setIsUploading(true);
        const bytes = new Uint8Array(await imageFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
          setUploadProgress(pct);
        });
        finalBlob = await uploadFile(blob);
        setIsUploading(false);
      } else if (existingImageBlob) {
        finalBlob = existingImageBlob;
      } else {
        setFormErrors((prev) => ({ ...prev, image: "Please upload a photo" }));
        return;
      }

      const priceVal = BigInt(Math.round(Number(price)));
      const sareeId =
        editSareeId ||
        `saree-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      if (isEditMode && editSareeId) {
        updateSaree(
          {
            id: editSareeId,
            name: name.trim(),
            description: description.trim(),
            price: priceVal,
            available,
            image: finalBlob,
          },
          {
            onSuccess: () => {
              toast.success(`"${name}" updated successfully!`);
              onSuccess();
            },
            onError: () => {
              toast.error("Failed to update saree. Please try again.");
            },
          },
        );
      } else {
        createSaree(
          {
            id: sareeId,
            name: name.trim(),
            description: description.trim(),
            price: priceVal,
            available,
            image: finalBlob,
          },
          {
            onSuccess: () => {
              toast.success(`"${name}" added to your collection!`);
              onSuccess();
            },
            onError: () => {
              toast.error("Failed to add saree. Please try again.");
            },
          },
        );
      }
    } catch {
      setIsUploading(false);
      toast.error("Upload failed. Please try again.");
    }
  };

  // Loading skeleton for edit mode while data is fetching
  if (isEditMode && !editSaree) {
    return (
      <div className="space-y-4 max-w-xl">
        {["sk1", "sk2", "sk3", "sk4", "sk5"].map((k) => (
          <Skeleton key={k} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div>
          <h2 className="font-display text-xl font-bold text-maroon">
            {isEditMode ? "Edit Saree" : "Add New Saree"}
          </h2>
          <p className="font-body text-xs text-muted-foreground">
            {isEditMode
              ? "Update the saree details below"
              : "Fill in the details to list a new saree"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label className="font-body font-medium text-sm">
            Saree Name <span className="text-destructive">*</span>
          </Label>
          <Input
            data-ocid="admin.add_saree.name_input"
            placeholder="e.g. Crimson Ikat Masterpiece"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (formErrors.name) setFormErrors((p) => ({ ...p, name: "" }));
            }}
            className="font-body"
          />
          {formErrors.name && (
            <p className="text-destructive text-xs font-body flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {formErrors.name}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label className="font-body font-medium text-sm">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            data-ocid="admin.add_saree.description_input"
            placeholder="Describe the saree's pattern, material, and special features…"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (formErrors.description)
                setFormErrors((p) => ({ ...p, description: "" }));
            }}
            className="font-body min-h-[100px] resize-y"
          />
          {formErrors.description && (
            <p className="text-destructive text-xs font-body flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {formErrors.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <Label className="font-body font-medium text-sm">
            Price (₹) <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-muted-foreground font-medium">
              ₹
            </span>
            <Input
              data-ocid="admin.add_saree.price_input"
              type="number"
              min="1"
              step="1"
              placeholder="8500"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (formErrors.price)
                  setFormErrors((p) => ({ ...p, price: "" }));
              }}
              className="font-body pl-7"
            />
          </div>
          {formErrors.price && (
            <p className="text-destructive text-xs font-body flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {formErrors.price}
            </p>
          )}
        </div>

        {/* Availability */}
        <div className="flex items-center justify-between p-3.5 bg-secondary rounded-lg border border-border">
          <div>
            <Label className="font-body font-medium text-sm cursor-pointer">
              Available for Purchase
            </Label>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              Customers can book this saree
            </p>
          </div>
          <Switch
            data-ocid="admin.add_saree.availability_toggle"
            checked={available}
            onCheckedChange={setAvailable}
          />
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <Label className="font-body font-medium text-sm">
            Photo <span className="text-destructive">*</span>
          </Label>

          {imagePreview ? (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-52 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  setExistingImageBlob(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                data-ocid="admin.add_saree.upload_button"
                className="absolute bottom-2 right-2 font-body text-xs bg-background/90"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-3.5 h-3.5 mr-1" />
                Change Photo
              </Button>
            </div>
          ) : (
            <button
              type="button"
              data-ocid="admin.add_saree.upload_button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-gold hover:bg-secondary/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-body text-sm font-medium text-foreground">
                  Click to upload photo
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  JPG, PNG, WebP accepted
                </p>
              </div>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {formErrors.image && (
            <p className="text-destructive text-xs font-body flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {formErrors.image}
            </p>
          )}

          {/* Upload progress */}
          {isUploading && (
            <div className="space-y-1.5">
              <Progress value={uploadProgress} className="h-2" />
              <p className="font-body text-xs text-muted-foreground text-right">
                Uploading… {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="font-body"
              disabled={isSaving}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            data-ocid="admin.add_saree.submit_button"
            disabled={isSaving}
            className="btn-primary flex-1 sm:flex-none"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                {isUploading
                  ? "Uploading…"
                  : isEditMode
                    ? "Updating…"
                    : "Adding…"}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {isEditMode ? "Save Changes" : "Add Saree"}
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
