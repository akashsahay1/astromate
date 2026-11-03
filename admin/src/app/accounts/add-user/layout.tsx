import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add User | Astromate',
  description: 'Add new user to Astromate platform',
};

export default function AddUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}