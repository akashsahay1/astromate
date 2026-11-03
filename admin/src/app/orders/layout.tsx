import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders Management | Astromate',
  description: 'Manage customer orders for Astromate platform',
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}