import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Vitasta Saree Atelier API',
      version: '1.0.0',
      description:
        'Official REST API and Server Actions specifications for Vitasta Saree Atelier — Royal Handcrafted Sarees of Jodhpur, Rajasthan.',
      contact: {
        name: 'Vitasta Concierge',
        email: 'vitastabysmita@gmail.com',
        url: 'https://vitasta.luxury',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Development Server',
      },
      {
        url: 'https://vitasta.luxury',
        description: 'Production Atelier Server',
      },
    ],
    tags: [
      { name: 'Authentication', description: 'Better Auth endpoints and session management' },
      { name: 'Catalog', description: 'Royal saree collections, filters, and product details' },
      { name: 'Orders & Loom Video', description: 'Bespoke order placement, loom video tracking & invoices' },
      { name: 'Concierge & Inquiries', description: 'Bespoke consultation messages and newsletter' },
      { name: 'Admin Controls', description: 'Atelier management, product CRUD, and dispatch status' },
    ],
    paths: {
      '/api/auth/sign-in/email': {
        post: {
          tags: ['Authentication'],
          summary: 'Sign in with email and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'patron@vitasta.luxury' },
                    password: { type: 'string', example: 'Password123!' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Authenticated successfully' },
            '401': { description: 'Invalid credentials' },
          },
        },
      },
      '/api/auth/sign-up/email': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new Royal Patron account',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'name'],
                  properties: {
                    name: { type: 'string', example: 'Maharani Gayatri Devi' },
                    email: { type: 'string', format: 'email', example: 'patron@vitasta.luxury' },
                    password: { type: 'string', example: 'Password123!' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Patron registered successfully' },
          },
        },
      },
      '/api/auth/sign-in/social': {
        post: {
          tags: ['Authentication'],
          summary: 'Initiate Google OAuth Social Login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['provider'],
                  properties: {
                    provider: { type: 'string', example: 'google' },
                    callbackURL: { type: 'string', example: 'http://localhost:3000/account' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'OAuth redirect URL generated' },
          },
        },
      },
      '/api/auth/get-session': {
        get: {
          tags: ['Authentication'],
          summary: 'Get current user session',
          responses: {
            '200': {
              description: 'Active session object with user role and patron tier',
            },
          },
        },
      },
      '/api/catalog/products': {
        get: {
          tags: ['Catalog'],
          summary: 'List sarees with filters and pagination',
          parameters: [
            { name: 'category', in: 'query', schema: { type: 'string', example: 'riwaayat-e-chiffon' } },
            { name: 'fabric', in: 'query', schema: { type: 'string', example: 'Chiffon' } },
            { name: 'sort', in: 'query', schema: { type: 'string', enum: ['featured', 'price-low', 'price-high', 'newest'] } },
            { name: 'q', in: 'query', schema: { type: 'string', example: 'Ombré' } },
          ],
          responses: {
            '200': {
              description: 'List of 21 handcrafted sarees with Cloudinary image assets',
            },
          },
        },
      },
      '/api/orders/create': {
        post: {
          tags: ['Orders & Loom Video'],
          summary: 'Place a bespoke order and register atelier consultation',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['fullName', 'email', 'phone', 'addressLine1', 'city', 'state', 'pincode', 'items'],
                  properties: {
                    fullName: { type: 'string', example: 'Smt. Radhika Sharma' },
                    email: { type: 'string', example: 'patron@vitasta.luxury' },
                    phone: { type: 'string', example: '+91 98765 43210' },
                    addressLine1: { type: 'string', example: 'House No. 10A, Paota B Road' },
                    city: { type: 'string', example: 'Jodhpur' },
                    state: { type: 'string', example: 'Rajasthan' },
                    pincode: { type: 'string', example: '342001' },
                    notes: { type: 'string', example: 'Bespoke blouse unstitched piece required' },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          title: { type: 'string' },
                          price: { type: 'number' },
                          quantity: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Order created with unique orderNumber and invoice' },
          },
        },
      },
      '/api/concierge/contact': {
        post: {
          tags: ['Concierge & Inquiries'],
          summary: 'Submit consultation inquiry to Jodhpur Atelier',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'subject', 'message'],
                  properties: {
                    name: { type: 'string', example: 'Smt. Radhika' },
                    email: { type: 'string', example: 'radhika@example.com' },
                    phone: { type: 'string', example: '+91 98765 43210' },
                    subject: { type: 'string', example: 'Bespoke Saree Consultation' },
                    message: { type: 'string', example: 'Inquiring about Sunset Ombre Chiffon saree dispatch date.' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Inquiry received by atelier concierge' },
          },
        },
      },
      '/api/admin/stats': {
        get: {
          tags: ['Admin Controls'],
          summary: 'Get atelier KPI metrics (Total sales, loom inspection queue, patron count)',
          responses: {
            '200': { description: 'Dashboard metrics' },
            '403': { description: 'Admin authentication required' },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiSpec);
}
