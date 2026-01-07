import { setRequestLocale } from "next-intl/server";
import { TenantDebugFloating } from "@/components/debug/tenant-debug-floating";
import { resolveComponent } from "@/components/registry";
import { getServerTenantContext } from "@/lib/tenant/server";
import type { BusinessTypeId } from "@/types/multi-business";
import type { HomePageProps } from "@/components/registry";

export const revalidate = 60;

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "c27fb19a-0121-4395-88ca-2cb8374dc52d";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Get tenant context
  const tenantContext = await getServerTenantContext(TENANT_ID);
  
  // Determine business type
  const businessType: BusinessTypeId = tenantContext?.tenant?.business_type || 'retail';
  
  // Resolve the HomePage component for this business type
  const HomePage = await resolveComponent<HomePageProps>('HomePage', businessType);

  // Build tenant prop for HomePage
  const tenantProp = {
    id: tenantContext?.tenant?.id || TENANT_ID,
    name: tenantContext?.tenant?.name || 'Store',
    business_type: businessType,
    config: tenantContext?.tenant?.config || {},
  };

  return (
    <>
      <HomePage locale={locale} tenant={tenantProp} />
      <TenantDebugFloating />
    </>
  );
}
