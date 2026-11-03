import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wallets | Astromate',
  description: 'Manage wallets for Astromate platform',
};

export default function WalletsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}