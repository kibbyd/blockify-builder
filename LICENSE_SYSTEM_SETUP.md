# Blockify Builder License System Setup Guide

## Overview

Blockify Builder uses a simple license key system for $39/month subscriptions. Customers pay via Stripe → receive license key via email → enter key in app → validated against server → cached locally.

## System Components

### 1. Frontend (Client App)
- **PaymentWall.jsx** - License entry UI
- **licenseManager.js** - Validates keys, caches locally

### 2. Backend (License Server)
- **license-server.js** - Validates licenses, handles Stripe webhooks
- **generate-license.js** - CLI tool to generate keys manually

### 3. Storage
- **licenses.json** - Simple file-based storage (upgrade to database for scale)

## Initial Setup

### Step 1: Install Dependencies

```bash
npm install terser-webpack-plugin --save-dev
npm install stripe --save  # For Stripe integration
```

### Step 2: Add License Routes to Server

In your `server.js`, add:

```javascript
const { setupLicenseRoutes } = require('./license-server');

// Add before other routes
setupLicenseRoutes(app);
```

### Step 3: Update PaymentWall Stripe Link

In `src/components/PaymentWall.jsx` line 176, replace with your Stripe payment link:

```jsx
href="https://buy.stripe.com/YOUR_STRIPE_PAYMENT_LINK"
```

### Step 4: Configure License Server URL

In `src/utils/licenseManager.js` line 9:

**For Development:**
```javascript
const LICENSE_SERVER = 'http://localhost:3000/api';
const USE_MOCK_VALIDATION = true;
```

**For Production:**
```javascript
const LICENSE_SERVER = 'https://your-domain.com/api';
const USE_MOCK_VALIDATION = false;
```

### Step 5: Build for Production

```bash
npm run build
```

This creates uglified/minified bundle in `public/js/` - code is obfuscated and unreadable.

## Stripe Integration

### 1. Create Stripe Product

1. Go to https://dashboard.stripe.com/products
2. Create new product:
   - Name: "Blockify Builder Pro"
   - Description: "Revolutionary Shopify Page Builder"
   - Price: $39/month (recurring)
3. Copy the payment link

### 2. Set Up Stripe Webhooks

1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events to listen for:
   - `checkout.session.completed` - New subscription
   - `invoice.payment_succeeded` - Renewal payment
   - `customer.subscription.deleted` - Cancellation
4. Copy webhook signing secret

### 3. Add Webhook Secret to Environment

Create `.env` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
LICENSE_SERVER_URL=https://your-domain.com/api
```

### 4. Email Integration

When a customer completes checkout, Stripe webhook triggers and creates license. You need to **send the license key via email**.

**Option A: Use Stripe Email (Simple)**
Configure Stripe to send receipt emails, but you'll need to manually send license keys.

**Option B: Use SendGrid/Mailgun (Automated)**

Install email service:
```bash
npm install @sendgrid/mail
```

Add to `license-server.js` webhook handler:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// In checkout.session.completed handler:
const msg = {
  to: session.customer_email,
  from: 'support@blockifybuilder.com',
  subject: 'Welcome to Blockify Builder! Here\'s Your License Key',
  html: `
    <h1>Welcome to Blockify Builder! 🎉</h1>
    <p>Thank you for subscribing to Blockify Builder Pro.</p>
    <p>Your license key is:</p>
    <h2 style="background: #f5f5f5; padding: 20px; font-family: monospace;">${licenseKey}</h2>
    <p>To activate:</p>
    <ol>
      <li>Go to <a href="https://app.blockifybuilder.com">app.blockifybuilder.com</a></li>
      <li>Enter your license key when prompted</li>
      <li>Start building amazing Shopify pages!</li>
    </ol>
  `
};
await sgMail.send(msg);
```

## Manual License Generation

For testing or special cases, generate licenses manually:

```bash
# Generate single license for customer
node generate-license.js customer@example.com

# Generate batch of keys
node generate-license.js --batch 10

# Generate single key (no storage)
node generate-license.js --key
```

Output:
```
✅ License Created Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Email:       customer@example.com
  License Key: BLOCKIFY-A7F2-B8E3-C9D4
  Expires:     30 days from now
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Send this license key to the customer via email
```

## Testing the System

### Test with Mock Validation (Development)

In `licenseManager.js`, use demo keys:
- `BLOCKIFY-DEMO-2024-TEST`
- `BLOCKIFY-ADMIN-FULL-ACCESS`

These work with mock validation enabled.

### Test with Real Server (Staging)

1. Set `USE_MOCK_VALIDATION = false` in licenseManager.js
2. Generate test license: `node generate-license.js test@example.com`
3. Enter key in PaymentWall
4. Should validate against license-server.js

### Test Stripe Integration (Production)

1. Create test subscription with Stripe test mode
2. Check webhook receives `checkout.session.completed`
3. Verify license key is created in licenses.json
4. Test license key in app

## Deployment Checklist

### Before Launch:

- [ ] Update Stripe payment link in PaymentWall.jsx
- [ ] Set LICENSE_SERVER_URL to production domain
- [ ] Set USE_MOCK_VALIDATION = false
- [ ] Run `npm run build` to create production bundle
- [ ] Add Stripe webhook endpoint with signing secret
- [ ] Set up email delivery for license keys
- [ ] Test full purchase → email → activation flow
- [ ] Secure `/api/admin/*` routes with authentication
- [ ] Move from licenses.json to database (optional but recommended)

### Security Notes:

1. **Code Obfuscation**: Production build uglifies all JS code
2. **No Source Maps**: Source maps disabled in webpack.prod.config.js
3. **License Caching**: Licenses cached locally for offline access (6 hour revalidation)
4. **Domain Tracking**: Server tracks which domains activate each license
5. **Admin Routes**: Protect manual license generation with admin key

## File Structure

```
blockify/
├── src/
│   ├── components/
│   │   └── PaymentWall.jsx          # License entry UI
│   └── utils/
│       └── licenseManager.js        # Client-side license logic
├── license-server.js                # Server-side validation
├── generate-license.js              # CLI license generator
├── licenses.json                    # License storage (auto-created)
├── webpack.prod.config.js           # Production build config
└── LICENSE_SYSTEM_SETUP.md          # This file
```

## License Key Format

**Format:** `BLOCKIFY-XXXX-XXXX-XXXX`

- Prefix: `BLOCKIFY-` (brand identifier)
- 3 segments of 4 hex characters
- Total: 17 characters
- Example: `BLOCKIFY-A7F2-B8E3-C9D4`

## Subscription Lifecycle

1. **New Subscription**
   - Customer pays $39 via Stripe
   - Webhook → `checkout.session.completed`
   - Server generates license key
   - Email sent with key
   - Expires in 30 days

2. **Monthly Renewal**
   - Stripe charges $39
   - Webhook → `invoice.payment_succeeded`
   - Server extends license by 30 days
   - Customer continues using (no interruption)

3. **Cancellation**
   - Customer cancels subscription
   - Webhook → `customer.subscription.deleted`
   - License marked as cancelled
   - App blocks access on next validation (within 6 hours)

## Upgrading from File Storage to Database

For scale, move from `licenses.json` to database:

```javascript
// Replace in license-server.js
class LicenseServer {
  async loadLicenses() {
    // const licenses = await db.query('SELECT * FROM licenses');
    return licenses;
  }

  async saveLicenses(license) {
    // await db.query('INSERT INTO licenses VALUES ...', license);
  }
}
```

## Support & Troubleshooting

**License won't validate:**
- Check LICENSE_SERVER_URL is correct
- Verify server is running
- Check Stripe webhook is configured
- Look at server logs for errors

**Email not sending:**
- Verify SendGrid/Mailgun API key
- Check spam folder
- Test email service separately

**Subscription not renewing:**
- Check Stripe webhook events
- Verify `invoice.payment_succeeded` handler
- Check licenses.json for updated expiry

## Revenue Tracking

Monitor your success:

```bash
# Count active licenses
cat licenses.json | grep '"status": "active"' | wc -l

# Calculate MRR (Monthly Recurring Revenue)
active_licenses * $39 = MRR

# Example: 100 licenses = $3,900/month
```

## Next Steps

After launch, consider:
- **Blockify Builder Agency** ($299 lifetime) - white-label, multi-client
- **Premium template packs** ($19-49 one-time)
- **Component marketplace** (revenue share with creators)
- **Priority support tier** (+$20/month)

---

**You're all set! Build the Blockify legacy. 🎨**
