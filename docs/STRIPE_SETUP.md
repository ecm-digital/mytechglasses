# Stripe Configuration Guide

## Overview

This guide explains how to set up Stripe integration for My Tech Glasses e-commerce platform.

## Prerequisites

1. Stripe account (create at [stripe.com](https://stripe.com))
2. Node.js 18+ installed
3. Access to Stripe Dashboard

## Step 1: Get Stripe Keys

### Development (Test) Keys

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle in top-left)
3. Go to **Developers** → **API keys**
4. Copy the following keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Production (Live) Keys

1. In Stripe Dashboard, switch to **Live mode**
2. Go to **Developers** → **API keys**
3. Copy the following keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

## Step 2: Configure Environment Variables

### Local Development

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your Stripe test keys:
   ```bash
   # Stripe Configuration (TEST KEYS)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here

   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   ```

3. Generate NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```

### Production Deployment

For production (Vercel, Netlify, etc.), set environment variables in your hosting platform:

```bash
# Production Stripe keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_actual_secret_key_here

# Production URLs
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_generated_secret_here
```

## Step 3: Verify Configuration

### Automatic Verification

The application automatically validates Stripe configuration on startup. Check the console for:

```
🔧 Environment Configuration:
   Node Environment: development
   Stripe Mode: TEST
   Stripe Publishable Key: pk_test_123...
   Stripe Secret Key: sk_test_...6789
🧪 Running in Stripe TEST mode
✅ Stripe connection successful
```

### Manual Verification

1. **Health Check Endpoint**:
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Expected Response**:
   ```json
   {
     "status": "healthy",
     "timestamp": "2024-01-01T12:00:00.000Z",
     "checks": {
       "environment": "ok",
       "stripe": "ok"
     }
   }
   ```

### Test Payment Flow

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the cart page and add items
3. Proceed to checkout
4. Use Stripe test card numbers:
   - **Success**: `4242424242424242`
   - **Declined**: `4000000000000002`
   - **Insufficient funds**: `4000000000009995`

## Step 4: Stripe Dashboard Configuration

### Webhook Endpoints (Future)

When implementing webhooks, configure these endpoints in Stripe Dashboard:

- **Development**: `http://localhost:3000/api/webhooks/stripe`
- **Production**: `https://yourdomain.com/api/webhooks/stripe`

### Payment Methods

Enable desired payment methods in Stripe Dashboard:
- **Cards**: Visa, Mastercard, American Express
- **Local methods**: BLIK (Poland), Przelewy24 (Poland)
- **Digital wallets**: Apple Pay, Google Pay

### Business Information

Complete your business profile in Stripe Dashboard:
1. **Business details**: Company name, address, tax ID
2. **Bank account**: For receiving payouts
3. **Identity verification**: Required for live payments

## Troubleshooting

### Common Issues

#### 1. "STRIPE_SECRET_KEY is not set"
- **Cause**: Missing or incorrect environment variable
- **Solution**: Check `.env.local` file and restart server

#### 2. "Stripe keys environment mismatch"
- **Cause**: Mixing test and live keys
- **Solution**: Ensure both keys are either test or live

#### 3. "Stripe connection test failed"
- **Cause**: Invalid keys or network issues
- **Solution**: Verify keys in Stripe Dashboard

#### 4. Payments not working in production
- **Cause**: Using test keys in production
- **Solution**: Switch to live keys and complete Stripe activation

### Debug Mode

Enable detailed logging:

```bash
# In .env.local
DEBUG=stripe:*
NODE_ENV=development
```

### Stripe CLI (Advanced)

Install Stripe CLI for webhook testing:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Security Best Practices

### Environment Variables

- ✅ **DO**: Store keys in environment variables
- ✅ **DO**: Use different keys for test/production
- ❌ **DON'T**: Commit keys to version control
- ❌ **DON'T**: Expose secret keys to client-side code

### Key Management

- 🔄 **Rotate keys** regularly (every 90 days)
- 🔒 **Restrict key permissions** in Stripe Dashboard
- 📊 **Monitor key usage** in Stripe logs
- 🚨 **Revoke compromised keys** immediately

### Production Checklist

- [ ] Live Stripe keys configured
- [ ] Business information completed
- [ ] Bank account connected
- [ ] Identity verification completed
- [ ] Webhook endpoints configured
- [ ] SSL certificate installed
- [ ] Error monitoring enabled
- [ ] Payment flow tested

## Support

### Documentation
- [Stripe Documentation](https://stripe.com/docs)
- [Next.js Stripe Integration](https://stripe.com/docs/payments/checkout/nextjs)

### Contact
- **Technical Issues**: Check application logs and health endpoint
- **Stripe Issues**: Contact Stripe Support
- **Business Issues**: Contact your account manager

## Test Cards Reference

### Successful Payments
- `4242424242424242` - Visa
- `4000056655665556` - Visa (debit)
- `5555555555554444` - Mastercard

### Failed Payments
- `4000000000000002` - Card declined
- `4000000000009995` - Insufficient funds
- `4000000000000069` - Expired card

### 3D Secure
- `4000002760003184` - 3D Secure authentication required
- `4000002500003155` - 3D Secure authentication fails

For complete list, see [Stripe Testing Documentation](https://stripe.com/docs/testing).