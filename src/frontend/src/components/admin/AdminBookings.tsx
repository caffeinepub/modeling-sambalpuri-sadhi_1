import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, BookOpen, Calendar } from "lucide-react";
import { motion } from "motion/react";
import {
  useGetAllBookings,
  useGetAllSareeListings,
} from "../../hooks/useQueries";

function formatTimestamp(ts: bigint): string {
  // timestamp is in nanoseconds
  const ms = Number(ts / BigInt(1_000_000));
  if (ms === 0) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

export default function AdminBookings() {
  const {
    data: bookings,
    isLoading: loadingBookings,
    isError,
  } = useGetAllBookings();
  const { data: sarees } = useGetAllSareeListings();

  const getSareeName = (sareeId: string): string => {
    const saree = sarees?.find((s) => s.id === sareeId);
    return saree?.name ?? sareeId;
  };

  if (loadingBookings) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="border border-border rounded-xl overflow-hidden">
          {["sk1", "sk2", "sk3", "sk4", "sk5"].map((k) => (
            <div
              key={k}
              className="flex gap-4 p-4 border-b border-border last:border-0"
            >
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
        <p className="font-body text-sm text-destructive">
          Failed to load bookings. Please refresh.
        </p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 border-2 border-dashed border-border rounded-xl"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
          <BookOpen className="w-7 h-7 text-maroon/30" />
        </div>
        <h3 className="font-display text-xl font-semibold text-maroon mb-2">
          No bookings yet
        </h3>
        <p className="font-body text-muted-foreground text-sm">
          Customer bookings will appear here once they start booking sarees.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-5">
        <Calendar className="w-5 h-5 text-maroon" />
        <div>
          <h2 className="font-display text-xl font-bold text-maroon">
            Bookings
          </h2>
          <p className="font-body text-xs text-muted-foreground">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} received
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden shadow-xs">
        <Table data-ocid="admin.bookings.table">
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="font-body font-semibold text-foreground">
                Customer
              </TableHead>
              <TableHead className="font-body font-semibold text-foreground">
                Phone
              </TableHead>
              <TableHead className="font-body font-semibold text-foreground hidden md:table-cell">
                Saree
              </TableHead>
              <TableHead className="font-body font-semibold text-foreground hidden lg:table-cell">
                Date & Time
              </TableHead>
              <TableHead className="font-body font-semibold text-foreground text-right hidden sm:table-cell">
                Booking #
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking, index) => (
              <TableRow
                key={String(booking.bookingId)}
                data-ocid={`admin.bookings.row.${index + 1}`}
                className="hover:bg-secondary/50 transition-colors"
              >
                <TableCell className="font-body font-medium text-sm">
                  {booking.customerName}
                  <div className="md:hidden text-xs text-muted-foreground mt-0.5">
                    {getSareeName(booking.sareeId)}
                  </div>
                </TableCell>
                <TableCell>
                  <a
                    href={`tel:${booking.customerPhone}`}
                    className="font-body text-sm text-maroon hover:underline"
                  >
                    {booking.customerPhone}
                  </a>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant="outline"
                    className="font-body text-xs border-border"
                  >
                    {getSareeName(booking.sareeId)}
                  </Badge>
                </TableCell>
                <TableCell className="font-body text-xs text-muted-foreground hidden lg:table-cell">
                  {formatTimestamp(booking.timestamp)}
                </TableCell>
                <TableCell className="text-right font-body text-xs text-muted-foreground hidden sm:table-cell">
                  #{String(booking.bookingId)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
