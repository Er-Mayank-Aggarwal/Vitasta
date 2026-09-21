import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { headers } from "next/headers";
import { prisma } from "./prisma";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "vitasta-s4r33-at3l13r-auth-s3cr3t-2026-k3y",
  baseURL: process.env.BETTER_AUTH_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  session: {
    cookieCache: {
      enabled: false,
    },
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip", "cf-connecting-ip"],
    },
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "CLIENT",
      },
      membershipTier: {
        type: "string",
        required: false,
        defaultValue: "Royal Patron",
      },
    },
  },
});

/**
 * Get the current session from Better Auth (server-side).
 * Returns { userId, role, user } for server actions and layouts.
 */
export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return null;

    return {
      userId: session.user.id,
      role: session.user.role || "CLIENT",
      user: session.user,
    };
  } catch {
    return null;
  }
}

/**
 * Destroy the session (server-side logout).
 */
export async function destroySession() {
  // Handled client-side via authClient.signOut()
}
