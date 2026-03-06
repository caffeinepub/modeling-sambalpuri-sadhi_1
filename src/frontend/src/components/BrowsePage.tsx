import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Phone, ShoppingBag, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { SareeListing } from "../backend.d";
import {
  useGetAvailableSareeListings,
  useGetSellerPhone,
} from "../hooks/useQueries";
import BookingModal from "./BookingModal";

// Sample fallback content (shown when backend has no data yet)
const SAMPLE_SAREES = [
  {
    id: "sample-1",
    name: "Crimson Ikat Masterpiece",
    description:
      "Hand-woven crimson silk saree with traditional Sambalpuri ikat patterns in gold and cream. Features intricate diamond motifs and temple borders.",
    price: BigInt(8500),
    available: true,
    timestamp: BigInt(0),
    image: {
      getDirectURL: () =>
        "/assets/generated/saree-crimson-ikat.dim_600x700.jpg",
    },
  },
  {
    id: "sample-2",
    name: "Royal Blue Elephant Weave",
    description:
      "Vibrant royal blue silk saree with saffron yellow ikat patterns, traditional Odisha elephant and floral motifs woven throughout.",
    price: BigInt(12000),
    available: true,
    timestamp: BigInt(0),
    image: {
      getDirectURL: () => "/assets/generated/saree-royal-blue.dim_600x700.jpg",
    },
  },
  {
    id: "sample-3",
    name: "Forest Green Temple Border",
    description:
      "Rich forest green saree with intricate gold thread geometric ikat patterns and traditional temple border design. Premium quality handloom.",
    price: BigInt(9800),
    available: true,
    timestamp: BigInt(0),
    image: {
      getDirectURL: () =>
        "/assets/generated/saree-forest-green.dim_600x700.jpg",
    },
  },
  {
    id: "sample-4",
    name: "Mustard Floral Heritage",
    description:
      "Warm mustard yellow Sambalpuri saree with maroon ikat woven floral and geometric patterns. A timeless piece of Odisha weaving tradition.",
    price: BigInt(7500),
    available: false,
    timestamp: BigInt(0),
    image: {
      getDirectURL: () =>
        "/assets/generated/saree-mustard-gold.dim_600x700.jpg",
    },
  },
  {
    id: "sample-5",
    name: "Violet Silk Elegance",
    description:
      "Deep purple-violet Sambalpuri silk saree with traditional ikat patterns in gold and ivory thread. Exceptionally fine craftsmanship.",
    price: BigInt(14500),
    available: true,
    timestamp: BigInt(0),
    image: {
      getDirectURL: () => "/assets/generated/saree-violet-silk.dim_600x700.jpg",
    },
  },
  {
    id: "sample-6",
    name: "Terracotta Fish Motif",
    description:
      "Terracotta orange-red handloom saree with traditional Sambalpuri fish (Meen) and elephant motifs woven in cream ikat patterns.",
    price: BigInt(6800),
    available: true,
    timestamp: BigInt(0),
    image: {
      getDirectURL: () => "/assets/generated/saree-terracotta.dim_600x700.jpg",
    },
  },
];

function formatPrice(price: bigint): string {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

function SareeSkeleton() {
  return (
    <div className="card-saree rounded-xl overflow-hidden">
      <Skeleton className="w-full h-72" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </div>
    </div>
  );
}

interface SareeCardProps {
  saree: (typeof SAMPLE_SAREES)[0] | SareeListing;
  index: number;
  sellerPhone: string;
  onBook: (saree: (typeof SAMPLE_SAREES)[0] | SareeListing) => void;
}

function SareeCard({ saree, index, sellerPhone, onBook }: SareeCardProps) {
  const imageUrl = saree.image.getDirectURL();

  return (
    <motion.article
      data-ocid={`saree.item.${index + 1}`}
      className="card-saree rounded-xl overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/5] bg-secondary">
        <img
          src={imageUrl}
          alt={saree.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {/* Availability badge */}
        <div className="absolute top-3 left-3">
          {saree.available ? (
            <Badge className="bg-emerald-700 text-white border-0 text-xs font-body font-medium shadow-sm">
              Available
            </Badge>
          ) : (
            <Badge
              variant="destructive"
              className="text-xs font-body font-medium shadow-sm"
            >
              Sold Out
            </Badge>
          )}
        </div>
        {/* Price tag */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-maroon text-cream px-3 py-1.5 rounded-full font-display text-sm font-bold shadow-md">
            {formatPrice(saree.price)}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-display text-lg font-semibold text-maroon leading-snug line-clamp-1">
          {saree.name}
        </h3>
        <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {saree.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <Button
            data-ocid={`saree.book_button.${index + 1}`}
            onClick={() => onBook(saree)}
            disabled={!saree.available}
            size="sm"
            className="flex-1 btn-primary gap-1.5 text-xs font-body font-medium"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Book Now
          </Button>
          <Button
            data-ocid={`saree.call_button.${index + 1}`}
            asChild
            variant="outline"
            size="sm"
            className="flex-1 border-gold text-maroon hover:bg-gold hover:text-maroon-deep gap-1.5 text-xs font-body font-medium"
          >
            <a href={`tel:${sellerPhone}`}>
              <Phone className="w-3.5 h-3.5" />
              Call Seller
            </a>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

export default function BrowsePage() {
  const { data: sarees, isLoading } = useGetAvailableSareeListings();
  const { data: sellerPhone = "" } = useGetSellerPhone();
  const [bookingSaree, setBookingSaree] = useState<
    ((typeof SAMPLE_SAREES)[0] | SareeListing) | null
  >(null);

  // Use backend data if available, otherwise show sample content
  const displaySarees: ((typeof SAMPLE_SAREES)[0] | SareeListing)[] =
    sarees && sarees.length > 0 ? sarees : SAMPLE_SAREES;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-maroon">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-saree-banner.dim_1200x600.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon/90 via-maroon/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-gold" />
              <span className="font-body text-gold text-sm font-medium tracking-widest uppercase">
                Handloom Heritage
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-cream leading-tight mb-4">
              Sambalpuri
              <br />
              <span className="text-gold italic">Saree Collection</span>
            </h1>
            <p className="font-body text-cream/80 text-base sm:text-lg leading-relaxed mb-8">
              Authentic handwoven Sambalpuri sarees, each a masterpiece of
              Odisha's textile heritage. Browse, book, and connect directly with
              the artisan.
            </p>
            <div className="flex flex-wrap gap-4 text-cream/70 text-sm font-body">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gold" />
                Pure Silk & Cotton
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gold" />
                Direct from Weaver
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gold" />
                Traditional Ikat Art
              </div>
            </div>
          </motion.div>
        </div>

        <div className="ikat-divider w-full" />
      </section>

      {/* Collection Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-maroon mb-3">
            Our Collection
          </h2>
          <div className="ikat-divider w-32 mx-auto mb-4" />
          <p className="font-body text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
            Each piece is individually crafted on traditional pit looms,
            preserving centuries of Odisha's weaving tradition.
          </p>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div
            data-ocid="saree.loading_state"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((k) => (
              <SareeSkeleton key={k} />
            ))}
          </div>
        ) : displaySarees.length === 0 ? (
          <motion.div
            data-ocid="saree.empty_state"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 px-4"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-maroon/40" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-maroon mb-3">
              No Sarees Listed Yet
            </h3>
            <p className="font-body text-muted-foreground max-w-sm mx-auto">
              The collection is being curated. Please check back soon for
              beautiful Sambalpuri sarees.
            </p>
          </motion.div>
        ) : (
          <div
            data-ocid="saree.list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {displaySarees.map((saree, index) => (
              <SareeCard
                key={saree.id}
                saree={saree}
                index={index}
                sellerPhone={sellerPhone}
                onBook={setBookingSaree}
              />
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingSaree && (
          <BookingModal
            saree={bookingSaree}
            onClose={() => setBookingSaree(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
