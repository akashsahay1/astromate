import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit User | Astromate',
  description: 'Edit user details for Astromate platform',
};

export default function EditUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}