import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession, Session } from "next-auth"; // Import Session type
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./SessionProvider";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "School Finder",
};

export default async function RootLayout({ 
  children, 
}: {
  children: React.ReactNode
}) {
  const session = (await getServerSession(authOptions)) as Session | null; // Assert the type
  return (
    <html lang="en">
      <head>
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1376209402491765"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}


