import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hello FHEVM Tutorial - Learn Fully Homomorphic Encryption',
  description: 'Interactive tutorial for building your first FHEVM dApp with encrypted computations on Ethereum',
  keywords: 'FHEVM, Zama, tutorial, Ethereum, encryption, privacy, blockchain, web3',
  authors: [{ name: 'Zama Community' }],
  openGraph: {
    title: 'Hello FHEVM Tutorial',
    description: 'Learn to build privacy-preserving dApps with FHEVM',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
