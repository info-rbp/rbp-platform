# Step 13 Marketplace Flow Checklist

## Route Smoke List

- /marketplace
- /marketplace/product/market-001
- /marketplace/product/market-002
- /marketplace/enquiry/market-001
- /marketplace/listing/new
- /admin/marketplace

## Buyer Enquiry Checks

- User can view a listing.
- User can start an enquiry.
- User can enter buyer details.
- User can enter message.
- User can review enquiry.
- User can submit mock enquiry.
- Confirmation shows mock reference.

## Seller Listing Checks

- User can start listing flow.
- User can select listing type.
- User can enter seller/listing details.
- User sees mock upload placeholder.
- User sees mock fee/payment notice.
- User can review listing.
- User can submit mock listing.
- Confirmation shows mock admin review state.

## Safety Checks

- No real backend logic.
- No real auth logic.
- No real payment processing.
- No real uploads.
- No real marketplace checkout.
- No real seller messaging.
- No Frappe APIs.

## Responsive QA Placeholders

- Mobile layout reviewed.
- Tablet layout reviewed.
- Desktop layout reviewed.

## Build

Run:

    npm run build
    rm -rf dist
    git status
