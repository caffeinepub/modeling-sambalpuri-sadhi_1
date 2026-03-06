import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Home, LogIn, LogOut, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  onAdminClick: () => void;
  onHomeClick: () => void;
  currentView: "browse" | "admin";
}

export default function Header({
  onAdminClick,
  onHomeClick,
  currentView,
}: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      onHomeClick();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.message === "User is already authenticated"
        ) {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Ikat decorative band */}
      <div className="ikat-divider w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo + Name */}
          <motion.button
            onClick={onHomeClick}
            className="flex items-center gap-3 text-left group"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-maroon flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-cream" />
            </div>
            <div>
              <div className="font-display text-base sm:text-lg font-bold text-maroon leading-tight">
                Modeling Sambalpuri
              </div>
              <div className="font-display text-xs sm:text-sm font-medium text-gold -mt-0.5 tracking-wide">
                Shadhi
              </div>
            </div>
          </motion.button>

          {/* Nav + Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentView === "admin" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onHomeClick}
                className="text-maroon hover:text-maroon hover:bg-secondary gap-1.5"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Browse</span>
              </Button>
            )}

            {isAuthenticated && currentView === "browse" && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAdminClick}
                className="border-maroon text-maroon hover:bg-maroon hover:text-cream transition-colors gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            )}

            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              data-ocid={
                isAuthenticated ? "nav.logout_button" : "nav.login_button"
              }
              className={
                isAuthenticated
                  ? "btn-primary gap-1.5 text-sm"
                  : "btn-gold gap-1.5 text-sm"
              }
              size="sm"
            >
              {isLoggingIn ? (
                <>
                  <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Logging in…</span>
                </>
              ) : isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Seller Login</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom ikat band */}
      <div className="ikat-divider w-full" />
    </header>
  );
}
