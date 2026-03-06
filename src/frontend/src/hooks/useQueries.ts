import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExternalBlob } from "../backend";
import type { Booking, BookingRequest, SareeListing } from "../backend.d";
import { useActor } from "./useActor";

// ── Saree Queries ──────────────────────────────────────────────
export function useGetAllSareeListings() {
  const { actor, isFetching } = useActor();
  return useQuery<SareeListing[]>({
    queryKey: ["sareeListings", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSareeListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAvailableSareeListings() {
  const { actor, isFetching } = useActor();
  return useQuery<SareeListing[]>({
    queryKey: ["sareeListings", "available"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableSareeListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSellerPhone() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["sellerPhone"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getSellerPhoneNumber();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Mutations ──────────────────────────────────────────────────
export function useSubmitBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: BookingRequest) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitBooking(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sareeListings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useCreateSareeListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      description: string;
      price: bigint;
      available: boolean;
      image: ExternalBlob;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createSareeListing(
        data.id,
        data.name,
        data.description,
        data.price,
        data.available,
        data.image,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sareeListings"] });
    },
  });
}

export function useUpdateSareeListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      description: string;
      price: bigint;
      available: boolean;
      image: ExternalBlob;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSareeListing(
        data.id,
        data.name,
        data.description,
        data.price,
        data.available,
        data.image,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sareeListings"] });
    },
  });
}

export function useDeleteSareeListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteSareeListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sareeListings"] });
    },
  });
}

export function useSetSellerPhone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (phoneNumber: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.setSellerPhoneNumber(phoneNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerPhone"] });
    },
  });
}

export function useUploadFile() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (file: ExternalBlob) => {
      if (!actor) throw new Error("Not connected");
      return actor.uploadFile(file);
    },
  });
}
