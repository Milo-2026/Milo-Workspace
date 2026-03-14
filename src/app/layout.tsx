import { ReactNode } from 'react';

export const metadata = {
  title: 'Side Quest Studios - Agent Fleet',
  description: 'Multi-agent AI system for SaaS automation',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
