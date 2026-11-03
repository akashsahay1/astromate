import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat Sessions | Astromate',
  description: 'Manage chat sessions for Astromate platform',
};

export default function ChatSessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}