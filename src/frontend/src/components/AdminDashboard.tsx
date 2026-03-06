import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";
import AdminAddSaree from "./admin/AdminAddSaree";
import AdminBookings from "./admin/AdminBookings";
import AdminSareeList from "./admin/AdminSareeList";
import AdminSettings from "./admin/AdminSettings";

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();
  const [activeTab, setActiveTab] = useState("sarees");
  const [editSareeId, setEditSareeId] = useState<string | null>(null);

  // Not authenticated
  if (!identity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-sm text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-secondary flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-maroon/40" />
          </div>
          <h2 className="font-display text-2xl font-bold text-maroon mb-2">
            Login Required
          </h2>
          <p className="font-body text-muted-foreground text-sm mb-5">
            Please use the Seller Login button in the header to authenticate.
          </p>
          <Button onClick={onBack} className="btn-primary">
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  // Checking admin status
  if (checkingAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-maroon" />
        <p className="font-body text-sm text-muted-foreground">
          Verifying access…
        </p>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-sm text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-bold text-maroon mb-2">
            Access Denied
          </h2>
          <p className="font-body text-muted-foreground text-sm mb-5">
            You do not have admin privileges to access this dashboard.
          </p>
          <Button onClick={onBack} className="btn-primary">
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  // Admin UI
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="ikat-divider w-16 mb-4" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-maroon mb-1">
          Seller Dashboard
        </h1>
        <p className="font-body text-muted-foreground text-sm">
          Manage your Sambalpuri saree listings, bookings, and settings.
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        value={editSareeId ? "edit" : activeTab}
        onValueChange={(v) => {
          setActiveTab(v);
          if (v !== "edit") setEditSareeId(null);
        }}
      >
        <TabsList className="mb-8 h-auto flex flex-wrap gap-1 bg-secondary border border-border p-1 rounded-lg">
          <TabsTrigger
            value="sarees"
            data-ocid="admin.tab"
            className="font-body text-sm data-[state=active]:bg-maroon data-[state=active]:text-cream"
            onClick={() => {
              setActiveTab("sarees");
              setEditSareeId(null);
            }}
          >
            My Sarees
          </TabsTrigger>
          <TabsTrigger
            value="add"
            data-ocid="admin.tab"
            className="font-body text-sm data-[state=active]:bg-maroon data-[state=active]:text-cream"
            onClick={() => {
              setActiveTab("add");
              setEditSareeId(null);
            }}
          >
            Add Saree
          </TabsTrigger>
          {editSareeId && (
            <TabsTrigger
              value="edit"
              data-ocid="admin.tab"
              className="font-body text-sm data-[state=active]:bg-maroon data-[state=active]:text-cream"
            >
              Edit Saree
            </TabsTrigger>
          )}
          <TabsTrigger
            value="bookings"
            data-ocid="admin.tab"
            className="font-body text-sm data-[state=active]:bg-maroon data-[state=active]:text-cream"
            onClick={() => {
              setActiveTab("bookings");
              setEditSareeId(null);
            }}
          >
            Bookings
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            data-ocid="admin.tab"
            className="font-body text-sm data-[state=active]:bg-maroon data-[state=active]:text-cream"
            onClick={() => {
              setActiveTab("settings");
              setEditSareeId(null);
            }}
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sarees">
          <AdminSareeList
            onEdit={(id) => {
              setEditSareeId(id);
              setActiveTab("edit");
            }}
          />
        </TabsContent>

        <TabsContent value="add">
          <AdminAddSaree onSuccess={() => setActiveTab("sarees")} />
        </TabsContent>

        {editSareeId && (
          <TabsContent value="edit">
            <AdminAddSaree
              editSareeId={editSareeId}
              onSuccess={() => {
                setEditSareeId(null);
                setActiveTab("sarees");
              }}
              onCancel={() => {
                setEditSareeId(null);
                setActiveTab("sarees");
              }}
            />
          </TabsContent>
        )}

        <TabsContent value="bookings">
          <AdminBookings />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
