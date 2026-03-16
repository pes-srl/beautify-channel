import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_vercel_build', 
  {
  // @ts-ignore
  apiVersion: '2023-10-16', // Use the latest stable version or your preferred version
  appInfo: {
    name: 'Beautify Channel',
    version: '0.1.0'
  }
});
