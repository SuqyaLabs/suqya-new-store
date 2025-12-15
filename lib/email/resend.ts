import { Resend } from "resend";

// Initialize Resend with API key
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender address (use verified domain or onboarding@resend.dev for testing)
export const EMAIL_FROM = process.env.EMAIL_FROM || "Suqya <onboarding@resend.dev>";
