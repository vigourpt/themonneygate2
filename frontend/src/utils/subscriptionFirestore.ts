/**
 * Firebase Firestore Subscription Integration Guide
 *
 * This file provides documentation about the Firestore subscription data structure and integration
 * with the MoneyGate subscription system. It does not contain executable code.
 *
 * Collection: subscriptions
 * Document ID: userId (Firebase Auth UID)
 * 
 * Document structure:
 * {
 *   planId: string;           // 'premium' or 'premium_annual'
 *   planName: string;         // Human-readable plan name
 *   status: string;           // 'trialing', 'active', 'canceled', etc.
 *   startDate: string;        // ISO date when subscription started
 *   endDate: string;          // ISO date when current period ends
 *   trialEndDate?: string;    // ISO date when trial ends (if applicable)
 *   isTrial: boolean;         // Whether subscription is in trial period
 *   isActive: boolean;        // Whether subscription is active
 *   isAutoRenew: boolean;     // Whether subscription will auto-renew
 *   stripeCustomerId: string; // Stripe customer ID
 *   stripeSubscriptionId: string; // Stripe subscription ID
 *   updatedAt: string;        // ISO date of last update
 *   canceledAt?: string;      // ISO date when canceled (if applicable)
 * }
 *
 * Security Rules (to be added in Firebase Console):
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Lock down by default
 *     match /{document=**} {
 *       allow read, write: if false;
 *     }
 *     
 *     // Subscription rules
 *     match /subscriptions/{userId} {
 *       // Allow users to read their own subscription data
 *       allow read: if request.auth != null && request.auth.uid == userId;
 *       
 *       // Allow webhooks to write subscription data via the backend
 *       // Only admin functions in the backend can create/update subscription data
 *       allow write: if false; // This ensures only the backend can modify subscription data
 *     }
 *   }
 * }
 */

// This is a documentation-only file; no actual code is exported