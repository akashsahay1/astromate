import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Astrologers | Astromate',
  description: 'Manage astrologers for Astromate platform',
};

export default function AstrologersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}