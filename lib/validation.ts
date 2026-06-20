import { z } from "zod";
import { projectRoles } from "@/lib/content";

/**
 * The single source of truth for the publishing inquiry form. Per the brief:
 * "zod schema shared client+server" — this same schema feeds the React Hook Form
 * client resolver AND the route handler. The client is never trusted; the server
 * re-validates with this exact schema.
 *
 * `honeypot` is a spam guard: a hidden field a human never fills. If it has any
 * value, the server silently drops the submission.
 */
export const publishingInquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tell us who you are.")
    .max(120, "That's a little long."),
  email: z
    .string()
    .trim()
    .min(1, "An email is required so Emmond can reply.")
    .email("That doesn't look like a valid email."),
  role: z.enum(projectRoles, {
    errorMap: () => ({ message: "Choose the kind of project." }),
  }),
  links: z
    .string()
    .trim()
    .max(500, "Keep links under 500 characters.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "A line or two of context goes a long way.")
    .max(2000, "Keep it under 2000 characters."),
  // Spam guard — must stay empty. Hidden from real users, off the tab order.
  honeypot: z.string().max(0).optional().or(z.literal("")),
});

export type PublishingInquiry = z.infer<typeof publishingInquirySchema>;

export const publishingInquiryDefaults: PublishingInquiry = {
  name: "",
  email: "",
  role: projectRoles[0],
  links: "",
  message: "",
  honeypot: "",
};
