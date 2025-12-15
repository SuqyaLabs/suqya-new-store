import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function PanierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get locale from headers or default to 'fr'
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'fr';
  
  // Redirect to localized route
  redirect(`/${locale}/panier`);
}
