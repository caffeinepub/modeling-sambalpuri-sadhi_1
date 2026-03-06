import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, Loader2, Phone, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetSellerPhone, useSetSellerPhone } from "../../hooks/useQueries";

export default function AdminSettings() {
  const { data: currentPhone, isLoading } = useGetSellerPhone();
  const { mutate: setPhone, isPending: isSaving } = useSetSellerPhone();
  const [phone, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentPhone !== undefined) {
      setPhoneInput(currentPhone);
    }
  }, [currentPhone]);

  const validate = () => {
    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      return false;
    }
    if (!/^[+\d\s\-()]{7,20}$/.test(phone.trim())) {
      setPhoneError("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setPhone(phone.trim(), {
      onSuccess: () => {
        toast.success("Phone number updated successfully!");
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
      onError: () => {
        toast.error("Failed to update phone number.");
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md"
    >
      <div className="flex items-center gap-2 mb-6">
        <Phone className="w-5 h-5 text-maroon" />
        <div>
          <h2 className="font-display text-xl font-bold text-maroon">
            Settings
          </h2>
          <p className="font-body text-xs text-muted-foreground">
            Configure your seller contact information
          </p>
        </div>
      </div>

      <div className="p-5 bg-card border border-border rounded-xl shadow-xs">
        <h3 className="font-body font-semibold text-sm text-foreground mb-4">
          Contact Information
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-28" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="seller-phone"
                className="font-body font-medium text-sm"
              >
                Seller Phone Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="seller-phone"
                  data-ocid="admin.settings.phone_input"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => {
                    setPhoneInput(e.target.value);
                    if (phoneError) setPhoneError("");
                    if (saved) setSaved(false);
                  }}
                  className="font-body pl-9"
                  autoComplete="tel"
                />
              </div>
              {phoneError && (
                <p className="text-destructive text-xs font-body flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {phoneError}
                </p>
              )}
              <p className="font-body text-xs text-muted-foreground">
                This number will be shown to customers on the "Call Seller"
                button.
              </p>
            </div>

            <Button
              type="submit"
              data-ocid="admin.settings.save_button"
              disabled={isSaving || saved}
              className={
                saved
                  ? "bg-emerald-700 text-white hover:bg-emerald-700 font-body"
                  : "btn-primary"
              }
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Saving…
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" />
                  Save Phone Number
                </>
              )}
            </Button>
          </form>
        )}
      </div>

      {/* Info Card */}
      <div className="mt-4 p-4 bg-secondary border border-border rounded-xl">
        <p className="font-body text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">How it works:</span>{" "}
          When customers click "Call Seller" on any saree listing, they'll be
          connected to this phone number directly. Make sure it's always up to
          date.
        </p>
      </div>
    </motion.div>
  );
}
