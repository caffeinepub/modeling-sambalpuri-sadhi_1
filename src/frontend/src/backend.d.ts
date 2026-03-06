import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface BookingRequest {
    customerName: string;
    customerPhone: string;
    sareeId: string;
}
export interface Booking {
    customerName: string;
    bookingId: bigint;
    customerPhone: string;
    sareeId: string;
    timestamp: bigint;
}
export interface SareeListing {
    id: string;
    name: string;
    description: string;
    available: boolean;
    timestamp: bigint;
    image: ExternalBlob;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createSareeListing(id: string, name: string, description: string, price: bigint, available: boolean, image: ExternalBlob): Promise<void>;
    deleteSareeListing(id: string): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllSareeListings(): Promise<Array<SareeListing>>;
    getAvailableSareeListings(): Promise<Array<SareeListing>>;
    getCallerUserRole(): Promise<UserRole>;
    getSareeById(id: string): Promise<SareeListing>;
    getSellerPhoneNumber(): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    setSellerPhoneNumber(phoneNumber: string): Promise<void>;
    submitBooking(request: BookingRequest): Promise<bigint>;
    updateSareeListing(id: string, name: string, description: string, price: bigint, available: boolean, image: ExternalBlob): Promise<void>;
    uploadFile(file: ExternalBlob): Promise<ExternalBlob>;
}
