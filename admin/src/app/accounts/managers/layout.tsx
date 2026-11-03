import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Managers | Astromate',
  description: 'Manage managers for Astromate platform',
};

export default function ManagersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}