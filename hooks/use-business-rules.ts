'use client'

import { useState, useCallback, useMemo } from 'react'
import { useTenant } from '@/hooks/use-tenant'
import { 
  evaluateRules, 
  evaluateRule, 
  mergeRuleResults 
} from '@/lib/rules/rule-engine'
import { ruleTemplates } from '@/lib/rules/rule-templates'
import type { BusinessRule } from '@/types/multi-business'

interface UseBusinessRulesOptions {
  entityType: 'product' | 'order' | 'cart' | 'customer' | 'inventory'
  triggerEvent?: string
  stopOnFirstMatch?: boolean
}

interface RuleEvaluationResult {
  isValid: boolean
  errors: string[]
  appliedValues: Record<string, unknown>
  matchedRules: number
}

/**
 * Hook for evaluating business rules against entities
 */
export function useBusinessRules(options: UseBusinessRulesOptions) {
  const { context, tenant } = useTenant()
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [lastResult, setLastResult] = useState<RuleEvaluationResult | null>(null)

  // Get rules from tenant config
  const tenantRules = useMemo(() => {
    const rules: BusinessRule[] = []
    
    // Get rules from tenant config if available
    const config = context?.tenant?.config as Record<string, unknown> | undefined
    const configRules = config?.rules as BusinessRule[] | undefined
    if (configRules && Array.isArray(configRules)) {
      rules.push(...configRules)
    }

    // Filter by trigger event if specified
    if (options.triggerEvent) {
      return rules.filter(r => r.trigger_event === options.triggerEvent)
    }

    return rules
  }, [context, options.triggerEvent])

  // Evaluate rules against an entity
  const evaluate = useCallback(
    (entity: Record<string, unknown>): RuleEvaluationResult => {
      setIsEvaluating(true)

      try {
        const ruleContext = {
          entity,
          entityType: options.entityType,
          tenantConfig: {
            business_type: tenant?.business_type,
            ...context?.tenant?.config
          }
        }

        const results = evaluateRules(tenantRules, ruleContext, {
          stopOnFirstMatch: options.stopOnFirstMatch
        })

        const merged = mergeRuleResults(results)
        
        const result: RuleEvaluationResult = {
          isValid: merged.errors.length === 0,
          errors: merged.errors,
          appliedValues: merged.appliedValues,
          matchedRules: merged.matchedRules
        }

        setLastResult(result)
        return result
      } finally {
        setIsEvaluating(false)
      }
    },
    [tenantRules, options.entityType, options.stopOnFirstMatch, tenant, context]
  )

  // Evaluate a single rule
  const evaluateSingle = useCallback(
    (rule: BusinessRule, entity: Record<string, unknown>) => {
      const ruleContext = {
        entity,
        entityType: options.entityType,
        tenantConfig: {
          business_type: tenant?.business_type,
          ...context?.tenant?.config
        }
      }

      return evaluateRule(rule, ruleContext)
    },
    [options.entityType, tenant, context]
  )

  return {
    evaluate,
    evaluateSingle,
    isEvaluating,
    lastResult,
    rules: tenantRules,
    hasRules: tenantRules.length > 0
  }
}

/**
 * Hook for order validation rules
 */
export function useOrderValidation() {
  const rules = useBusinessRules({
    entityType: 'order',
    triggerEvent: 'order.validate'
  })

  const validateOrder = useCallback(
    (order: {
      total: number
      subtotal: number
      items: Array<{ id: string; quantity: number; price: number }>
      delivery_method?: string
      shipping_wilaya?: string
    }) => {
      return rules.evaluate(order as Record<string, unknown>)
    },
    [rules]
  )

  return {
    ...rules,
    validateOrder
  }
}

/**
 * Hook for cart validation rules
 */
export function useCartValidation() {
  const rules = useBusinessRules({
    entityType: 'cart',
    triggerEvent: 'cart.add'
  })

  const validateCartItem = useCallback(
    (item: {
      id: string
      quantity: number
      stock_quantity?: number
      selected_size?: string
      selected_color?: string
    }) => {
      return rules.evaluate(item as Record<string, unknown>)
    },
    [rules]
  )

  return {
    ...rules,
    validateCartItem
  }
}

/**
 * Hook for order calculation rules (fees, discounts, etc.)
 */
export function useOrderCalculation() {
  const rules = useBusinessRules({
    entityType: 'order',
    triggerEvent: 'order.calculate'
  })

  const calculateOrder = useCallback(
    (order: {
      subtotal: number
      total: number
      item_count: number
      items: Array<{ calories?: number; price: number }>
      delivery_method?: string
    }) => {
      const result = rules.evaluate(order as Record<string, unknown>)
      
      // Extract calculated values
      return {
        ...result,
        serviceCharge: result.appliedValues.service_charge as number | undefined,
        deliveryFee: result.appliedValues.delivery_fee as number | undefined,
        freeDelivery: result.appliedValues.free_delivery_applied as boolean | undefined,
        bulkDiscount: result.appliedValues.bulk_discount_percent as number | undefined,
        totalCalories: result.appliedValues.total_calories as number | undefined
      }
    },
    [rules]
  )

  return {
    ...rules,
    calculateOrder
  }
}

/**
 * Get pre-built rule templates for a business type
 */
export function useRuleTemplates() {
  const { businessType } = useTenant()

  const templates = useMemo(() => {
    const allTemplates = {
      validation: Object.values(ruleTemplates.validation),
      calculation: Object.values(ruleTemplates.calculation),
      workflow: Object.values(ruleTemplates.workflow),
      constraint: Object.values(ruleTemplates.constraint)
    }

    // Filter templates relevant to business type
    // For now, return all templates - can be filtered based on business type later
    return allTemplates
  }, [businessType])

  return {
    templates,
    businessType,
    // Helper to get a specific template
    getTemplate: (category: keyof typeof ruleTemplates, name: string) => {
      const categoryTemplates = ruleTemplates[category]
      return (categoryTemplates as Record<string, (...args: unknown[]) => BusinessRule>)[name]
    }
  }
}
