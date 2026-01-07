
import type { BusinessTypeId } from '@/types/multi-business'

export const businessThemeMap: Record<BusinessTypeId, string> = {
  nutrition: 'nutrition_green',  // Fresh green/nature theme
  retail: 'ocean_blue',          // Trustworthy blue theme
  clothing: 'fashion_noir',      // Elegant black/white theme
  restaurant: 'warm_terracotta', // Appetizing warm theme
  services: 'ocean_blue',        // Professional blue theme
  kitchenware: 'raiq_serene',    // Sage green premium kitchenware
  electronics: 'pos_tech',       // Dark tech cyan theme
  custom: 'honey_gold'           // Default golden theme
}

export function getThemeForBusiness(businessType: BusinessTypeId): string {
  return businessThemeMap[businessType] || 'honey_gold'
}
