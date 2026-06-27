# RK Shinecraft — Website + Backend

A full website for **RK Shinecraft** (marble polishing & stone care, Kolkata),
built from the supplied "Aethel Marble" Stitch design and the real business
assets in the `RK Shinecraft` folder (logo, photos, brochure, visiting card).

The original design's **colors, fonts, spacing and component styles are
unchanged** — only the content, images, and data are now real and the forms
are wired to a working backend.

## What's inside

```
project/
├── public/                  # Frontend (static, served by Express)
│   ├── index.html           # Same Aethel Marble design tokens/colors/fonts
│   └── assets/
│       ├── images/          # Real photos cropped from the RK Shinecraft folder
│       └── js/main.js       # Fetches data from the API, wires up forms
└── server/
    ├── index.js             # Express app entry point
    ├── db.js                 # lowdb (JSON file) storage for leads
    ├── mailer.js             # nodemailer wrapper (logs if SMTP isn't set)
    ├── data/
    │   ├── company.json     # Real contact info / stats / "why choose us"
    │   ├── services.json    # Real services list (from the brochure)
    │   └── leads.json       # Generated at runtime — stores form submissions
    ├── middleware/validate.js
    └── routes/api.js        # /api/company, /api/services, /api/contact, /api/quote
```

## Real content used

Pulled directly from the uploaded brochure / visiting card / banner:

- **Phone:** +91 98315 85950
- **Email:** rkshinecraft@gmail.com
- **Website:** www.rkshinecraft.com
- **Address:** C1-34/g3, Shantiniketan Apartment, Block A, Sontoshpur Govt. Colony, Mollargate, Kolkata – 700142
- **Services:** Marble Floor Polishing & Crystallization, Deep Cleaning & Restoration, Granite/Mosaic/Kota Stone Polishing, AMC, custom solutions for homes/hotels/offices
- **Logo & photos:** taken from `RK Logo.png`, `1.png`, `2.png`, `Banner.png`

## Running it

```bash
cd project
npm install
cp .env.example .env     # optional — fill in SMTP creds to actually send emails
npm start
```

Then open **http://localhost:3000**.

If you don't configure SMTP in `.env`, form submissions are still saved to
`server/data/leads.json` and logged to the console — the site works fully
out of the box, emails just aren't sent until SMTP is configured (e.g. a
Gmail App Password, SendGrid, etc).

## API

| Method | Endpoint        | Purpose                                  |
|--------|-----------------|-------------------------------------------|
| GET    | `/api/company`  | Company info, stats, contact details      |
| GET    | `/api/services` | Services list                             |
| POST   | `/api/contact`  | Contact form submission (rate-limited)    |
| POST   | `/api/quote`    | Quote-request submission (rate-limited)   |

`POST /api/contact` body:
```json
{ "name": "...", "email": "...", "phone": "...", "serviceType": "...", "message": "..." }
```

`POST /api/quote` body:
```json
{ "name": "...", "email": "...", "phone": "...", "serviceType": "...", "propertyType": "...", "notes": "..." }
```

## Notes

- Leads are stored in `server/data/leads.json` (JSON file via `lowdb`) — swap
  for a real database later if needed; the route layer doesn't need to change.
- `helmet` + `express-rate-limit` are enabled for basic production hygiene.
- The Tailwind config and CSS in `index.html` are copied verbatim from the
  approved Stitch design (`code.html`) — same colors, type scale, spacing.
