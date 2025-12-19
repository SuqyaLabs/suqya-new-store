/**
 * Pre-built Business Rule Templates
 * 
 * Common rules that can be used across different business types
 */

import type { BusinessRule } from '@/types/multi-business'
import { condition, action } from './rule-engine'

// Helper to create a rule with defaults
function createRule(
  partial: Partial<Omit<BusinessRule, 'conditions'>> & { 
    name: string
    rule_type: BusinessRule['rule_type']
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    conditions?: any
  }
): BusinessRule {
  return {
    id: `template_${partial.name.toLowerCase().replace(/\s+/g, '_')}`,
    tenant_id: undefined,
    name: partial.name,
    description: partial.description,
    rule_type: partial.rule_type,
    trigger_event: partial.trigger_event || 'manual',
    conditions: partial.conditions || {},
    actions: partial.actions || [],
    priority: partial.priority || 100,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

// ============================================
// VALIDATION RULES
// ============================================

export const validationRules = {
  /**
   * Require minimum order amount
   */
  minOrderAmount: (minAmount: number, currency = 'DZD'): BusinessRule =>
    createRule({
      name: 'Minimum Order Amount',
      description: `Order must be at least ${minAmount} ${currency}`,
      rule_type: 'validation',
      trigger_event: 'order.validate',
      conditions: condition.lessThan('entity.total', minAmount),
      actions: [
        action.error(`Le montant minimum de commande est ${minAmount} ${currency}`)
      ],
      priority: 10
    }),

  /**
   * Require product stock availability
   */
  requireStock: (): BusinessRule =>
    createRule({
      name: 'Stock Availability',
      description: 'Product must have stock available',
      rule_type: 'validation',
      trigger_event: 'cart.add',
      conditions: condition.lessOrEqual('entity.stock_quantity', 0),
      actions: [
        action.error('Ce produit est en rupture de stock')
      ],
      priority: 5
    }),

  /**
   * Require nutrition info for nutrition business
   */
  requireNutritionInfo: (): BusinessRule =>
    createRule({
      name: 'Require Nutrition Info',
      description: 'Products must have calorie information',
      rule_type: 'validation',
      trigger_event: 'product.save',
      conditions: condition.and(
        condition.equals('tenantConfig.business_type', 'nutrition'),
        condition.isEmpty('entity.custom_data.calories')
      ),
      actions: [
        action.error('Les informations nutritionnelles (calories) sont requises')
      ],
      priority: 20
    }),

  /**
   * Require size selection for clothing
   */
  requireSizeSelection: (): BusinessRule =>
    createRule({
      name: 'Require Size Selection',
      description: 'Size must be selected before adding to cart',
      rule_type: 'validation',
      trigger_event: 'cart.add',
      conditions: condition.and(
        condition.equals('tenantConfig.business_type', 'clothing'),
        condition.isEmpty('entity.selected_size')
      ),
      actions: [
        action.error('Veuillez sélectionner une taille')
      ],
      priority: 15
    })
}

// ============================================
// CALCULATION RULES
// ============================================

export const calculationRules = {
  /**
   * Apply service charge percentage
   */
  serviceCharge: (percentage: number): BusinessRule =>
    createRule({
      name: 'Service Charge',
      description: `Add ${percentage}% service charge`,
      rule_type: 'calculation',
      trigger_event: 'order.calculate',
      conditions: condition.greaterThan('entity.total', 0),
      actions: [
        action.addFee('service_charge', percentage)
      ],
      priority: 50
    }),

  /**
   * Free delivery above threshold
   */
  freeDeliveryThreshold: (threshold: number): BusinessRule =>
    createRule({
      name: 'Free Delivery',
      description: `Free delivery for orders above ${threshold}`,
      rule_type: 'calculation',
      trigger_event: 'order.calculate',
      conditions: condition.greaterOrEqual('entity.subtotal', threshold),
      actions: [
        action.setField('delivery_fee', 0),
        action.setField('free_delivery_applied', true)
      ],
      priority: 60
    }),

  /**
   * Calculate total calories for nutrition orders
   */
  calculateTotalCalories: (): BusinessRule =>
    createRule({
      name: 'Calculate Total Calories',
      description: 'Sum calories from all items',
      rule_type: 'calculation',
      trigger_event: 'order.calculate',
      conditions: condition.equals('tenantConfig.business_type', 'nutrition'),
      actions: [
        action.aggregate('total_calories', 'sum', 'entity.items.*.calories')
      ],
      priority: 70
    }),

  /**
   * Apply bulk discount
   */
  bulkDiscount: (minQuantity: number, discountPercent: number): BusinessRule =>
    createRule({
      name: 'Bulk Discount',
      description: `${discountPercent}% off for ${minQuantity}+ items`,
      rule_type: 'calculation',
      trigger_event: 'order.calculate',
      conditions: condition.greaterOrEqual('entity.item_count', minQuantity),
      actions: [
        action.setField('bulk_discount_percent', discountPercent),
        action.setField('bulk_discount_applied', true)
      ],
      priority: 40
    })
}

// ============================================
// WORKFLOW RULES
// ============================================

export const workflowRules = {
  /**
   * Send to kitchen when order placed (restaurant)
   */
  sendToKitchen: (): BusinessRule =>
    createRule({
      name: 'Send to Kitchen',
      description: 'Route order to kitchen display',
      rule_type: 'workflow',
      trigger_event: 'order.placed',
      conditions: condition.and(
        condition.equals('tenantConfig.business_type', 'restaurant'),
        condition.in('entity.order_type', ['dine_in', 'takeaway'])
      ),
      actions: [
        action.setField('kitchen_status', 'pending'),
        action.notify('Nouvelle commande en cuisine'),
        action.triggerWorkflow('kitchen_display')
      ],
      priority: 10
    }),

  /**
   * Notify low stock
   */
  lowStockAlert: (threshold: number): BusinessRule =>
    createRule({
      name: 'Low Stock Alert',
      description: `Alert when stock falls below ${threshold}`,
      rule_type: 'workflow',
      trigger_event: 'inventory.update',
      conditions: condition.and(
        condition.lessOrEqual('entity.stock_quantity', threshold),
        condition.greaterThan('entity.stock_quantity', 0)
      ),
      actions: [
        action.notify(`Stock bas: ${threshold} unités restantes`),
        action.setField('low_stock_alert', true)
      ],
      priority: 30
    }),

  /**
   * Auto-confirm order for pickup
   */
  autoConfirmPickup: (): BusinessRule =>
    createRule({
      name: 'Auto Confirm Pickup',
      description: 'Automatically confirm pickup orders',
      rule_type: 'workflow',
      trigger_event: 'order.placed',
      conditions: condition.equals('entity.delivery_method', 'pickup'),
      actions: [
        action.setField('status', 'confirmed'),
        action.notify('Commande confirmée automatiquement (retrait)')
      ],
      priority: 20
    })
}

// ============================================
// CONSTRAINT RULES
// ============================================

export const constraintRules = {
  /**
   * Limit order quantity per product
   */
  maxQuantityPerProduct: (maxQty: number): BusinessRule =>
    createRule({
      name: 'Max Quantity Per Product',
      description: `Maximum ${maxQty} units per product`,
      rule_type: 'constraint',
      trigger_event: 'cart.update',
      conditions: condition.greaterThan('entity.quantity', maxQty),
      actions: [
        action.setField('quantity', maxQty),
        action.error(`Maximum ${maxQty} unités par produit`)
      ],
      priority: 10
    }),

  /**
   * Business hours constraint
   */
  businessHours: (openHour: number, closeHour: number): BusinessRule =>
    createRule({
      name: 'Business Hours',
      description: `Orders only between ${openHour}h and ${closeHour}h`,
      rule_type: 'constraint',
      trigger_event: 'order.validate',
      conditions: condition.or(
        condition.lessThan('context.current_hour', openHour),
        condition.greaterOrEqual('context.current_hour', closeHour)
      ),
      actions: [
        action.error(`Commandes acceptées entre ${openHour}h et ${closeHour}h`)
      ],
      priority: 5
    }),

  /**
   * Delivery zone constraint
   */
  deliveryZone: (allowedWilayas: string[]): BusinessRule =>
    createRule({
      name: 'Delivery Zone',
      description: 'Restrict delivery to specific wilayas',
      rule_type: 'constraint',
      trigger_event: 'order.validate',
      conditions: condition.and(
        condition.equals('entity.delivery_method', 'delivery'),
        condition.not(condition.in('entity.shipping_wilaya', allowedWilayas))
      ),
      actions: [
        action.error('Livraison non disponible dans cette wilaya')
      ],
      priority: 15
    })
}

// Export all templates grouped
export const ruleTemplates = {
  validation: validationRules,
  calculation: calculationRules,
  workflow: workflowRules,
  constraint: constraintRules
}
