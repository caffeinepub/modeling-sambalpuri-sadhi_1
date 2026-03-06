import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Edit,
  Loader2,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { SareeListing } from "../../backend.d";
import {
  useDeleteSareeListing,
  useGetAllSareeListings,
} from "../../hooks/useQueries";

interface AdminSareeListProps {
  onEdit: (id: string) => void;
}

function formatPrice(price: bigint): string {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

export default function AdminSareeList({ onEdit }: AdminSareeListProps) {
  const { data: sarees, isLoading, isError } = useGetAllSareeListings();
  const { mutate: deleteSaree, isPending: isDeleting } =
    useDeleteSareeListing();
  const [deleteTarget, setDeleteTarget] = useState<SareeListing | null>(null);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteSaree(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`"${deleteTarget.name}" removed from your collection`);
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error("Failed to delete saree. Please try again.");
        setDeleteTarget(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {["sk1", "sk2", "sk3", "sk4"].map((k) => (
          <div
            key={k}
            className="flex items-center gap-4 p-4 border border-border rounded-xl"
          >
            <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
        <p className="font-body text-sm text-destructive">
          Failed to load sarees. Please refresh.
        </p>
      </div>
    );
  }

  if (!sarees || sarees.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 border-2 border-dashed border-border rounded-xl"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
          <ShoppingBag className="w-7 h-7 text-maroon/30" />
        </div>
        <h3 className="font-display text-xl font-semibold text-maroon mb-2">
          No sarees listed yet
        </h3>
        <p className="font-body text-muted-foreground text-sm mb-4">
          Start by adding your first saree listing.
        </p>
        <Button className="btn-primary gap-1.5">
          <Plus className="w-4 h-4" />
          Add First Saree
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-xl font-bold text-maroon">
            My Sarees
          </h2>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            {sarees.length} saree{sarees.length !== 1 ? "s" : ""} in your
            collection
          </p>
        </div>
      </div>

      <div data-ocid="admin.saree_list" className="space-y-3">
        {sarees.map((saree, index) => (
          <motion.div
            key={saree.id}
            data-ocid={`admin.saree.item.${index + 1}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl shadow-xs hover:shadow-saree transition-shadow"
          >
            {/* Image */}
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
              <img
                src={saree.image.getDirectURL()}
                alt={saree.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-body font-semibold text-sm text-foreground truncate">
                  {saree.name}
                </h3>
                {saree.available ? (
                  <Badge className="bg-emerald-700 text-white border-0 text-xs">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    Sold Out
                  </Badge>
                )}
              </div>
              <p className="font-body text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {saree.description}
              </p>
              <p className="font-display text-maroon font-bold text-sm mt-1">
                {formatPrice(saree.price)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                data-ocid={`admin.saree.edit_button.${index + 1}`}
                onClick={() => onEdit(saree.id)}
                className="border-border text-foreground hover:bg-secondary gap-1"
              >
                <Edit className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                data-ocid={`admin.saree.delete_button.${index + 1}`}
                onClick={() => setDeleteTarget(saree)}
                className="border-destructive/40 text-destructive hover:bg-destructive hover:text-white gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="booking.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-maroon">
              Delete Saree Listing?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-sm">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                "{deleteTarget?.name}"
              </span>{" "}
              from your collection? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="booking.cancel_button"
              className="font-body"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="booking.confirm_button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90 font-body"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-1.5" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
