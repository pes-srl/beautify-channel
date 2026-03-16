import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // @ts-ignore
  apiVersion: '2023-10-16', // Use the latest stable version or your preferred version
  appInfo: {
    name: 'Beautify Channel',
    version: '0.1.0'
  }
});
