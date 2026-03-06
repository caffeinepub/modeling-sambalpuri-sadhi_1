import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border bg-background">
      <div className="ikat-divider w-full" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="font-display text-base font-bold text-maroon">
              Modeling Sambalpuri Shadhi
            </div>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              Authentic handwoven sarees from Odisha
            </p>
          </div>

          {/* Center: Decorative */}
          <div className="hidden sm:flex items-center gap-2 text-gold">
            <div className="w-8 h-px bg-gold/40" />
            <div className="w-2 h-2 rotate-45 bg-gold/60" />
            <div className="w-8 h-px bg-gold/40" />
          </div>

          {/* Attribution */}
          <div className="text-center sm:text-right">
            <p className="font-body text-xs text-muted-foreground">
              © {year}. Built with{" "}
              <Heart className="w-3 h-3 inline text-maroon fill-maroon" /> using{" "}
              <a
                href={caffeineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-maroon hover:text-gold transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="ikat-divider w-full" />
    </footer>
  );
}
