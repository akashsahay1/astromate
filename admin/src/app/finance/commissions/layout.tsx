import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commissions | Astromate',
  description: 'Manage astrologer commissions for Astromate platform',
};

export default function CommissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}