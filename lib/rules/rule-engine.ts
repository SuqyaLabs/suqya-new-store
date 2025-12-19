/**
 * Business Rules Engine
 * 
 * A lightweight rule evaluation engine supporting JSON Logic-like conditions
 * and various action types for business logic customization.
 */

import type { BusinessRule, BusinessRuleAction } from '@/types/multi-business'

// Supported operators for conditions
type Operator = 
  | '==' | '!=' | '>' | '<' | '>=' | '<='
  | 'in' | 'not_in' | 'contains' | 'not_contains'
  | 'starts_with' | 'ends_with'
  | 'is_empty' | 'is_not_empty'
  | 'and' | 'or' | 'not'

interface Condition {
  field?: string
  operator: Operator
  value?: unknown
  conditions?: Condition[] // For and/or/not
}

interface RuleContext {
  // Entity data being evaluated
  entity: Record<string, unknown>
  // Entity type (product, order, customer, etc.)
  entityType: string
  // Current tenant config
  tenantConfig?: Record<string, unknown>
  // Additional context data
  [key: string]: unknown
}

interface RuleResult {
  matched: boolean
  actions: BusinessRuleAction[]
  errors: string[]
  appliedValues: Record<string, unknown>
}

/**
 * Evaluate a single condition against context
 */
function evaluateCondition(condition: Condition, context: RuleContext): boolean {
  const { operator, field, value, conditions } = condition

  // Handle logical operators
  if (operator === 'and' && conditions) {
    return conditions.every(c => evaluateCondition(c, context))
  }
  if (operator === 'or' && conditions) {
    return conditions.some(c => evaluateCondition(c, context))
  }
  if (operator === 'not' && conditions && conditions[0]) {
    return !evaluateCondition(conditions[0], context)
  }

  // Get field value from context
  if (!field) return false
  const fieldValue = getNestedValue(context, field)

  // Evaluate comparison operators
  switch (operator) {
    case '==':
      return fieldValue === value
    case '!=':
      return fieldValue !== value
    case '>':
      return Number(fieldValue) > Number(value)
    case '<':
      return Number(fieldValue) < Number(value)
    case '>=':
      return Number(fieldValue) >= Number(value)
    case '<=':
      return Number(fieldValue) <= Number(value)
    case 'in':
      return Array.isArray(value) && value.includes(fieldValue)
    case 'not_in':
      return Array.isArray(value) && !value.includes(fieldValue)
    case 'contains':
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(value)
      }
      if (typeof fieldValue === 'string') {
        return fieldValue.includes(String(value))
      }
      return false
    case 'not_contains':
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(value)
      }
      if (typeof fieldValue === 'string') {
        return !fieldValue.includes(String(value))
      }
      return true
    case 'starts_with':
      return typeof fieldValue === 'string' && fieldValue.startsWith(String(value))
    case 'ends_with':
      return typeof fieldValue === 'string' && fieldValue.endsWith(String(value))
    case 'is_empty':
      return fieldValue === null || fieldValue === undefined || fieldValue === '' || 
        (Array.isArray(fieldValue) && fieldValue.length === 0)
    case 'is_not_empty':
      return fieldValue !== null && fieldValue !== undefined && fieldValue !== '' &&
        !(Array.isArray(fieldValue) && fieldValue.length === 0)
    default:
      return false
  }
}

/**
 * Get nested value from object using dot notation
 * e.g., "entity.price" or "entity.custom_data.calories"
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.')
  let current: unknown = obj

  for (const part of parts) {
    if (current === null || current === undefined) return undefined
    if (typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }

  return current
}

/**
 * Apply rule actions and return results
 */
function applyActions(
  actions: BusinessRuleAction[],
  context: RuleContext
): { appliedValues: Record<string, unknown>; errors: string[] } {
  const appliedValues: Record<string, unknown> = {}
  const errors: string[] = []

  for (const action of actions) {
    try {
      switch (action.type) {
        case 'set_field':
          if (action.field && action.value !== undefined) {
            appliedValues[action.field] = action.value
          }
          break

        case 'add_fee':
          // Calculate fee based on percentage or fixed amount
          if (action.percentage) {
            const baseAmount = Number(getNestedValue(context, 'entity.total') || 0)
            appliedValues[action.field || 'fee'] = baseAmount * (action.percentage / 100)
          } else if (action.value !== undefined) {
            appliedValues[action.field || 'fee'] = action.value
          }
          break

        case 'error':
          if (action.message) {
            errors.push(action.message)
          }
          break

        case 'aggregate':
          // Sum, count, avg operations
          if (action.operation && action.source && action.field) {
            const sourceArray = getNestedValue(context, action.source)
            if (Array.isArray(sourceArray)) {
              switch (action.operation) {
                case 'sum':
                  appliedValues[action.field] = sourceArray.reduce(
                    (acc: number, item: unknown) => acc + Number(item), 0
                  )
                  break
                case 'count':
                  appliedValues[action.field] = sourceArray.length
                  break
                case 'avg':
                  appliedValues[action.field] = sourceArray.length > 0
                    ? sourceArray.reduce((acc: number, item: unknown) => acc + Number(item), 0) / sourceArray.length
                    : 0
                  break
              }
            }
          }
          break

        case 'notify':
          // Notification action - just log for now, can be extended
          console.log('[Rule Notification]', action.message)
          break

        case 'trigger_workflow':
          // Workflow trigger - store workflow ID to be executed
          if (action.value) {
            appliedValues['_triggered_workflows'] = [
              ...((appliedValues['_triggered_workflows'] as string[]) || []),
              String(action.value)
            ]
          }
          break
      }
    } catch (err) {
      errors.push(`Action ${action.type} failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return { appliedValues, errors }
}

/**
 * Evaluate a single business rule
 */
export function evaluateRule(rule: BusinessRule, context: RuleContext): RuleResult {
  const result: RuleResult = {
    matched: false,
    actions: [],
    errors: [],
    appliedValues: {}
  }

  // Check if rule is active
  if (!rule.is_active) {
    return result
  }

  // Evaluate conditions
  const conditions = rule.conditions as unknown as Condition
  if (!conditions) {
    // No conditions means always match
    result.matched = true
  } else {
    result.matched = evaluateCondition(conditions, context)
  }

  // If matched, apply actions
  if (result.matched) {
    result.actions = rule.actions
    const { appliedValues, errors } = applyActions(rule.actions, context)
    result.appliedValues = appliedValues
    result.errors = errors
  }

  return result
}

/**
 * Evaluate multiple rules in priority order
 */
export function evaluateRules(
  rules: BusinessRule[],
  context: RuleContext,
  options: { stopOnFirstMatch?: boolean } = {}
): RuleResult[] {
  // Sort by priority (lower number = higher priority)
  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority)
  
  const results: RuleResult[] = []

  for (const rule of sortedRules) {
    const result = evaluateRule(rule, context)
    results.push(result)

    if (options.stopOnFirstMatch && result.matched) {
      break
    }
  }

  return results
}

/**
 * Merge all rule results into a single result
 */
export function mergeRuleResults(results: RuleResult[]): {
  appliedValues: Record<string, unknown>
  errors: string[]
  matchedRules: number
} {
  const appliedValues: Record<string, unknown> = {}
  const errors: string[] = []
  let matchedRules = 0

  for (const result of results) {
    if (result.matched) {
      matchedRules++
      Object.assign(appliedValues, result.appliedValues)
      errors.push(...result.errors)
    }
  }

  return { appliedValues, errors, matchedRules }
}

/**
 * Create a simple condition builder
 */
export const condition = {
  equals: (field: string, value: unknown): Condition => ({
    field,
    operator: '==',
    value
  }),
  notEquals: (field: string, value: unknown): Condition => ({
    field,
    operator: '!=',
    value
  }),
  greaterThan: (field: string, value: number): Condition => ({
    field,
    operator: '>',
    value
  }),
  lessThan: (field: string, value: number): Condition => ({
    field,
    operator: '<',
    value
  }),
  greaterOrEqual: (field: string, value: number): Condition => ({
    field,
    operator: '>=',
    value
  }),
  lessOrEqual: (field: string, value: number): Condition => ({
    field,
    operator: '<=',
    value
  }),
  in: (field: string, values: unknown[]): Condition => ({
    field,
    operator: 'in',
    value: values
  }),
  contains: (field: string, value: unknown): Condition => ({
    field,
    operator: 'contains',
    value
  }),
  isEmpty: (field: string): Condition => ({
    field,
    operator: 'is_empty'
  }),
  isNotEmpty: (field: string): Condition => ({
    field,
    operator: 'is_not_empty'
  }),
  and: (...conditions: Condition[]): Condition => ({
    operator: 'and',
    conditions
  }),
  or: (...conditions: Condition[]): Condition => ({
    operator: 'or',
    conditions
  }),
  not: (cond: Condition): Condition => ({
    operator: 'not',
    conditions: [cond]
  })
}

/**
 * Create action builders
 */
export const action = {
  setField: (field: string, value: unknown): BusinessRuleAction => ({
    type: 'set_field',
    field,
    value
  }),
  addFee: (field: string, percentage?: number, fixedValue?: number): BusinessRuleAction => ({
    type: 'add_fee',
    field,
    percentage,
    value: fixedValue
  }),
  error: (message: string): BusinessRuleAction => ({
    type: 'error',
    message
  }),
  aggregate: (
    field: string,
    operation: 'sum' | 'count' | 'avg',
    source: string
  ): BusinessRuleAction => ({
    type: 'aggregate',
    field,
    operation,
    source
  }),
  notify: (message: string): BusinessRuleAction => ({
    type: 'notify',
    message
  }),
  triggerWorkflow: (workflowId: string): BusinessRuleAction => ({
    type: 'trigger_workflow',
    value: workflowId
  })
}
