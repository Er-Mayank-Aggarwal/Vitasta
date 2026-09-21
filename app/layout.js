import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import LayoutShell from './components/LayoutShell';
import NextTopLoader from 'nextjs-toploader';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'VITASTA Saree Atelier | Handcrafted Royal Sarees of Jodhpur',
  description:
    'Vitasta by Smita Saraswat — Handcrafted royal sarees from Jodhpur, Rajasthan. Inspired by royal women, made with pure silks, fine chiffons, and intricate Adda embroidery with pre-dispatch loom video inspection.',
  keywords: [
    'Vitasta Saree Atelier',
    'Jodhpur Royal Sarees',
    'Handloom Chiffon Saree',
    'Banarasi Virasat Silk',
    'Zardozi Gota Patti Saree',
    'Pre-dispatch Loom Video Saree',
  ],
  openGraph: {
    title: 'VITASTA Saree Atelier | Handcrafted Royal Sarees of Jodhpur',
    description: 'Unfolding Serenity — Handcrafted royal sarees of Rajasthan.',
    images: [
      {
        url: 'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675057/vitasta/products/sunset-ombre-chiffon-cutdana-moti-sequin-saree/xztu76kgnn59tlhoc8zo.jpg',
        width: 1200,
        height: 800,
        alt: 'Vitasta Saree Atelier',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#FAF9F6] text-[#1A1A1A] min-h-screen">
        <NextTopLoader color="#C1272D" showSpinner={false} height={3} />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
