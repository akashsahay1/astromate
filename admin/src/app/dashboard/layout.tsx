import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Astromate',
  description: 'Admin dashboard for Astromate platform',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}