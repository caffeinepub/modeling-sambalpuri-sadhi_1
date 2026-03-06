import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  let sarees = Map.empty<Text, SareeListing>();
  let bookings = Map.empty<Nat, Booking>();
  var nextBookingId = 0;
  var sellerPhoneNumber : Text = "";

  // Prefab storage components from blob-storage
  include MixinStorage();

  // Prefab authorization components
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module SareeListing {
    public func compareById(s1 : SareeListing, s2 : SareeListing) : Order.Order {
      Text.compare(s1.id, s2.id);
    };
  };

  module Booking {
    public func compareByBookingId(b1 : Booking, b2 : Booking) : Order.Order {
      Nat.compare(b1.bookingId, b2.bookingId);
    };
  };

  type SareeListing = {
    id : Text;
    description : Text;
    price : Nat;
    available : Bool;
    image : Storage.ExternalBlob;
    timestamp : Int;
    name : Text;
  };

  type Booking = {
    bookingId : Nat;
    customerName : Text;
    customerPhone : Text;
    sareeId : Text;
    timestamp : Int;
  };

  type BookingRequest = {
    customerName : Text;
    customerPhone : Text;
    sareeId : Text;
  };

  public shared ({ caller }) func createSareeListing(
    id : Text,
    name : Text,
    description : Text,
    price : Nat,
    available : Bool,
    image : Storage.ExternalBlob,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create saree listings");
    };

    let saree : SareeListing = {
      id;
      description;
      price;
      available;
      image;
      timestamp = Time.now();
      name;
    };

    sarees.add(id, saree);
  };

  public shared ({ caller }) func updateSareeListing(
    id : Text,
    name : Text,
    description : Text,
    price : Nat,
    available : Bool,
    image : Storage.ExternalBlob,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update saree listings");
    };

    switch (sarees.get(id)) {
      case (null) { Runtime.trap("Saree not found") };
      case (_) {
        let updatedSaree : SareeListing = {
          id;
          description;
          price;
          available;
          image;
          timestamp = Time.now();
          name;
        };
        sarees.add(id, updatedSaree);
      };
    };
  };

  public shared ({ caller }) func deleteSareeListing(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete saree listings");
    };

    switch (sarees.get(id)) {
      case (null) { Runtime.trap("Saree not found") };
      case (_) { sarees.remove(id) };
    };
  };

  public shared ({ caller }) func submitBooking(request : BookingRequest) : async Nat {
    let bookingId = nextBookingId;
    nextBookingId += 1;

    let booking : Booking = {
      bookingId;
      customerName = request.customerName;
      customerPhone = request.customerPhone;
      sareeId = request.sareeId;
      timestamp = Time.now();
    };

    bookings.add(bookingId, booking);
    bookingId;
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view bookings");
    };
    bookings.values().toArray().sort(Booking.compareByBookingId);
  };

  public shared ({ caller }) func setSellerPhoneNumber(phoneNumber : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can set phone number");
    };
    sellerPhoneNumber := phoneNumber;
  };

  public query ({ caller }) func getSellerPhoneNumber() : async Text {
    sellerPhoneNumber;
  };

  public query ({ caller }) func getAvailableSareeListings() : async [SareeListing] {
    sarees.values().toArray().filter(func(s) { s.available }).sort(SareeListing.compareById);
  };

  public query ({ caller }) func getAllSareeListings() : async [SareeListing] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view all sarees");
    };
    sarees.values().toArray().sort(SareeListing.compareById);
  };

  public query ({ caller }) func getSareeById(id : Text) : async SareeListing {
    switch (sarees.get(id)) {
      case (null) { Runtime.trap("Saree not found") };
      case (?saree) { saree };
    };
  };

  public shared ({ caller }) func uploadFile(file : Storage.ExternalBlob) : async Storage.ExternalBlob {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can upload files");
    };
    file;
  };
};
