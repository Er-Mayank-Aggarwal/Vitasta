import { z } from "zod";

// --- Checkout / Bespoke Order / Address ---
export const placeOrderSchema = z.object({
  email: z.string().email("Invalid email"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  addressLine1: z.string().min(1, "Street address is required"),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(5, "PIN code must be at least 5 digits").max(10),
  notes: z.string().optional().nullable(),
  saveAddress: z.boolean().optional().default(false),
  addressId: z.string().optional().nullable(),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      category: z.string().optional(),
      fabric: z.string().optional(),
      color: z.string().optional(),
      price: z.number(),
      quantity: z.number().int().min(1),
      image: z.string(),
    })
  ).min(1, "Bag cannot be empty"),
});

export const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15),
  addressLine1: z.string().min(1, "Address is required").max(200),
  addressLine2: z.string().max(200).optional().nullable(),
  city: z.string().min(1, "City is required"),
  district: z.string().optional().nullable(),
  state: z.string().min(1, "State is required"),
  country: z.string().default("India"),
  pincode: z.string().min(5, "Pincode must be at least 5 characters").max(10),
  landmark: z.string().optional().nullable(),
  isDefault: z.boolean().optional().default(false),
});

// --- Profile ---
export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(15).optional().nullable(),
  gender: z.string().optional().nullable(),
});

// --- Admin: Product ---
export const productSchema = z.object({
  title: z.string().min(1, "Title is required").max(250),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  originalPrice: z.number().positive().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  fabric: z.string().min(1, "Fabric is required"),
  blouseFabric: z.string().optional().nullable(),
  work: z.string().min(1, "Work is required"),
  design: z.string().optional().nullable(),
  color: z.string().min(1, "Color is required"),
  blouseColor: z.string().optional().nullable(),
  sareeLength: z.string().default("5.5 Metres"),
  blouseLength: z.string().default("1 Metre"),
  materialCare: z.string().default("Dry Clean Only"),
  origin: z.string().default("Jodhpur, Rajasthan, India"),
  stockStatus: z.string().default("MADE_TO_ORDER"),
  primaryImage: z.string().min(1, "Primary image is required"),
  isFeatured: z.boolean().optional().default(true),
  isActive: z.boolean().optional().default(true),
  imageUrls: z.array(z.string()).optional(),
});

// --- Admin: Order Status & Loom Video ---
export const orderUpdateSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  orderStatus: z.enum([
    "PENDING",
    "CONFIRMED",
    "IN_PRODUCTION",
    "LOOM_WEAVING",
    "VIDEO_VERIFIED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
  ]),
  statusLabel: z.string().optional(),
  trackingNumber: z.string().optional().nullable(),
  courierName: z.string().optional().nullable(),
  preDispatchVideoUrl: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// --- Contact & Consultation Inquiries ---
export const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email is required").max(150),
  phone: z.string().optional().nullable(),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(3000),
});

export const newsletterSchema = z.object({
  email: z.string().email("Valid email address is required").max(150),
});
