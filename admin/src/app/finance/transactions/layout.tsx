import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transactions | Astromate',
  description: 'Manage transactions for Astromate platform',
};

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}