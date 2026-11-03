import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers | Astromate',
  description: 'Manage customers for Astromate platform',
};

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}