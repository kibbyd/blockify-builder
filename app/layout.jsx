import './globals.css';
import SessionProvider from '@/app/_components/SessionProvider';

export const metadata = {
  title: 'Blockify Builder',
  description: 'Professional Shopify page builder with drag-and-drop interface',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500;600;700&family=Bebas+Neue&family=Bitter:wght@400;500;700&family=Cabin:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Crimson+Text:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=Fjalla+One&family=Inter:wght@400;500;600;700&family=Josefin+Sans:wght@400;500;600;700&family=Karla:wght@400;500;600;700&family=Lato:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Manrope:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;500;600;700&family=Nunito+Sans:wght@400;600;700&family=Nunito:wght@400;600;700&family=Open+Sans:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&family=PT+Sans:wght@400;700&family=PT+Serif:wght@400;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&family=Raleway:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Rubik:wght@400;500;600;700&family=Sora:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&family=Source+Serif+Pro:wght@400;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
