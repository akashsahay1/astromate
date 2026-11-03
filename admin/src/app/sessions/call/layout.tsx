import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Call Sessions | Astromate',
  description: 'Manage call sessions for Astromate platform',
};

export default function CallSessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}