import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Astromate',
  description: 'Admin login for Astromate platform',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}