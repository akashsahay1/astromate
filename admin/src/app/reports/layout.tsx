import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reports | Astromate',
  description: 'Admin reports for Astromate platform',
};

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}