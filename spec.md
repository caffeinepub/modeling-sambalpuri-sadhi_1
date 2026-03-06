# Modeling Sambalpuri Sadhi

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Owner/admin login to post, edit, and delete saree listings
- Each listing includes: photo, name, fabric/description, price, availability status
- Customer-facing browse page showing all available sarees
- Booking flow: customers enter their name, phone number, and select a saree to book
- Contact seller button/section with the seller's phone number visible on each listing
- Admin dashboard to view incoming bookings (customer name, phone, saree booked, timestamp)

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Select `authorization` and `blob-storage` components
2. Generate Motoko backend with:
   - Saree listing CRUD (create/read/update/delete) restricted to admin
   - Booking submission (open to all, stores name + phone + saree ID + timestamp)
   - Query to list all sarees and all bookings
   - Store owner phone number in a stable variable (admin-settable)
3. Frontend:
   - Public browse page: grid of saree cards with photo, name, price, availability, "Book Now" and "Call Seller" actions
   - Booking modal: form with customer name and phone number
   - Admin login gated dashboard:
     - Add/edit/delete saree listings (upload photo, set name, description, price, availability)
     - View all bookings in a table
     - Set/update seller phone number
