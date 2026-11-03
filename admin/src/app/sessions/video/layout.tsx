import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Sessions | Astromate',
  description: 'Manage video sessions for Astromate platform',
};

export default function VideoSessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}