import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AdminDashboard from "./components/AdminDashboard";
import BrowsePage from "./components/BrowsePage";
import Footer from "./components/Footer";
import Header from "./components/Header";

type AppView = "browse" | "admin";

export default function App() {
  const [view, setView] = useState<AppView>("browse");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onAdminClick={() => setView("admin")}
        onHomeClick={() => setView("browse")}
        currentView={view}
      />
      <main className="flex-1">
        {view === "browse" ? (
          <BrowsePage />
        ) : (
          <AdminDashboard onBack={() => setView("browse")} />
        )}
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
}
