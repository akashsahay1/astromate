import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administrators | Astromate',
  description: 'Manage admins for Astromate platform',
};

export default function AdminsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}