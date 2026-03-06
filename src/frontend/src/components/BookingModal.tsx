import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { SareeListing } from "../backend.d";
import { useSubmitBooking } from "../hooks/useQueries";

interface BookingModalProps {
  saree:
    | {
        id: string;
        name: string;
        price: bigint;
        image: { getDirectURL: () => string };
      }
    | SareeListing;
  onClose: () => void;
}

function formatPrice(price: bigint): string {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

export default function BookingModal({ saree, onClose }: BookingModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    mutate: submitBooking,
    isPending,
    isError,
    error,
  } = useSubmitBooking();

  const validate = () => {
    let valid = true;
    setNameError("");
    setPhoneError("");

    if (!customerName.trim()) {
      setNameError("Please enter your name");
      valid = false;
    }
    if (!customerPhone.trim()) {
      setPhoneError("Please enter your phone number");
      valid = false;
    } else if (!/^[+\d\s\-()]{7,15}$/.test(customerPhone.trim())) {
      setPhoneError("Please enter a valid phone number");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    submitBooking(
      {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        sareeId: saree.id,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
      },
    );
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-ocid="booking.dialog"
        className="max-w-md border-border shadow-saree"
      >
        {isSuccess ? (
          <motion.div
            data-ocid="booking.success_state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-6 gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-maroon mb-2">
                Booking Confirmed!
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Your booking for{" "}
                <span className="font-semibold text-foreground">
                  {saree.name}
                </span>{" "}
                has been submitted. The seller will contact you shortly.
              </p>
            </div>
            <Button
              onClick={onClose}
              data-ocid="booking.cancel_button"
              className="btn-primary mt-2"
            >
              Close
            </Button>
          </motion.div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-maroon">
                Book This Saree
              </DialogTitle>
              <DialogDescription className="font-body text-sm">
                Reserve{" "}
                <span className="font-semibold text-foreground">
                  {saree.name}
                </span>{" "}
                — {formatPrice(saree.price)}
              </DialogDescription>
            </DialogHeader>

            {/* Saree preview */}
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg border border-border">
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={saree.image.getDirectURL()}
                  alt={saree.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-body font-semibold text-sm text-foreground line-clamp-1">
                  {saree.name}
                </p>
                <p className="font-display text-maroon font-bold text-base">
                  {formatPrice(saree.price)}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="booking-name"
                  className="font-body font-medium text-sm"
                >
                  Your Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="booking-name"
                  data-ocid="booking.customer_name_input"
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  className="font-body"
                  autoComplete="name"
                />
                {nameError && (
                  <p className="text-destructive text-xs font-body flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {nameError}
                  </p>
                )}
              </div>

              {/* Customer Phone */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="booking-phone"
                  className="font-body font-medium text-sm"
                >
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="booking-phone"
                  data-ocid="booking.customer_phone_input"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (phoneError) setPhoneError("");
                  }}
                  className="font-body"
                  autoComplete="tel"
                />
                {phoneError && (
                  <p className="text-destructive text-xs font-body flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {phoneError}
                  </p>
                )}
              </div>

              {/* Error state */}
              {isError && (
                <div
                  data-ocid="booking.error_state"
                  className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-destructive text-sm font-body">
                    {error instanceof Error
                      ? error.message
                      : "Booking failed. Please try again."}
                  </p>
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="booking.cancel_button"
                  onClick={onClose}
                  className="font-body"
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="booking.submit_button"
                  disabled={isPending}
                  className="btn-primary flex-1 sm:flex-none"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
