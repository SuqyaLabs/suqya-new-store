'use client'

import { useTenant } from '@/hooks/use-tenant'
import type { CustomFieldSchema } from '@/types/multi-business'
import { cn } from '@/lib/utils'

interface CustomFieldsDisplayProps {
  entityType: 'product' | 'category' | 'customer' | 'order' | 'variant'
  values: Record<string, unknown>
  locale?: 'fr' | 'ar' | 'en'
  layout?: 'grid' | 'list' | 'inline'
  showEmpty?: boolean
  className?: string
}

export function CustomFieldsDisplay({
  entityType,
  values,
  locale = 'fr',
  layout = 'grid',
  showEmpty = false,
  className
}: CustomFieldsDisplayProps) {
  const { productSchema } = useTenant()

  // Get schema based on entity type
  const schema: Record<string, CustomFieldSchema> = entityType === 'product'
    ? productSchema
    : {}

  const schemaEntries = Object.entries(schema)

  if (schemaEntries.length === 0) {
    return null
  }

  const getLabel = (fieldSchema: CustomFieldSchema) => {
    return locale === 'ar'
      ? (fieldSchema.label_ar || fieldSchema.label)
      : locale === 'en'
        ? (fieldSchema.label_en || fieldSchema.label)
        : fieldSchema.label
  }

  const formatValue = (fieldKey: string, fieldSchema: CustomFieldSchema): string | null => {
    const value = values[fieldKey]

    if (value === undefined || value === null || value === '') {
      return showEmpty ? '-' : null
    }

    switch (fieldSchema.type) {
      case 'boolean':
        return value ? (locale === 'ar' ? 'نعم' : 'Oui') : (locale === 'ar' ? 'لا' : 'Non')

      case 'number':
        const numValue = Number(value)
        if (fieldSchema.unit) {
          return `${numValue} ${fieldSchema.unit}`
        }
        return String(numValue)

      case 'select':
        const selectedOpt = fieldSchema.options?.find(opt =>
          (typeof opt === 'string' ? opt : opt.value) === value
        )
        if (!selectedOpt) return String(value)
        if (typeof selectedOpt === 'string') return selectedOpt
        return locale === 'ar'
          ? (selectedOpt.label_ar || selectedOpt.label)
          : locale === 'en'
            ? (selectedOpt.label_en || selectedOpt.label)
            : selectedOpt.label

      case 'multiselect':
        const selectedValues = value as string[]
        if (!selectedValues || selectedValues.length === 0) return showEmpty ? '-' : null
        return selectedValues.map(v => {
          const opt = fieldSchema.options?.find(o =>
            (typeof o === 'string' ? o : o.value) === v
          )
          if (!opt) return v
          if (typeof opt === 'string') return opt
          return locale === 'ar'
            ? (opt.label_ar || opt.label)
            : locale === 'en'
              ? (opt.label_en || opt.label)
              : opt.label
        }).join(', ')

      case 'date':
        try {
          return new Date(value as string).toLocaleDateString(
            locale === 'ar' ? 'ar-DZ' : locale === 'en' ? 'en-US' : 'fr-FR'
          )
        } catch {
          return String(value)
        }

      case 'json':
        return typeof value === 'object' ? JSON.stringify(value) : String(value)

      default:
        return String(value)
    }
  }

  // Filter out empty values if showEmpty is false
  const displayFields = schemaEntries.filter(([key, schema]) => {
    const formatted = formatValue(key, schema)
    return formatted !== null
  })

  if (displayFields.length === 0) {
    return null
  }

  if (layout === 'inline') {
    return (
      <div className={cn("flex flex-wrap gap-x-4 gap-y-1 text-sm", className)}>
        {displayFields.map(([key, fieldSchema]) => {
          const formatted = formatValue(key, fieldSchema)
          return (
            <span key={key} className="text-muted-foreground">
              <span className="font-medium">{getLabel(fieldSchema)}:</span>{' '}
              <span className="text-foreground">{formatted}</span>
            </span>
          )
        })}
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <dl className={cn("space-y-2", className)}>
        {displayFields.map(([key, fieldSchema]) => {
          const formatted = formatValue(key, fieldSchema)
          return (
            <div key={key} className="flex justify-between text-sm">
              <dt className="text-muted-foreground">{getLabel(fieldSchema)}</dt>
              <dd className="font-medium">{formatted}</dd>
            </div>
          )
        })}
      </dl>
    )
  }

  // Grid layout (default)
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {displayFields.map(([key, fieldSchema]) => {
        const formatted = formatValue(key, fieldSchema)
        return (
          <div key={key} className="space-y-1">
            <dt className="text-xs text-muted-foreground uppercase tracking-wide">
              {getLabel(fieldSchema)}
            </dt>
            <dd className="text-sm font-medium">{formatted}</dd>
          </div>
        )
      })}
    </div>
  )
}

// Compact display for product cards
interface CustomFieldsBadgesProps {
  entityType: 'product' | 'category' | 'customer' | 'order' | 'variant'
  values: Record<string, unknown>
  fields?: string[] // Specific fields to show
  locale?: 'fr' | 'ar' | 'en'
  className?: string
}

export function CustomFieldsBadges({
  entityType,
  values,
  fields,
  locale = 'fr',
  className
}: CustomFieldsBadgesProps) {
  const { productSchema } = useTenant()

  const schema: Record<string, CustomFieldSchema> = entityType === 'product'
    ? productSchema
    : {}

  // Filter to only requested fields or fields marked for list display
  const displayFields = Object.entries(schema).filter(([key, fieldSchema]) => {
    if (fields) {
      return fields.includes(key) && values[key] !== undefined && values[key] !== null
    }
    // Check if field should be displayed in list (from custom_field_definitions)
    const displayInList = (fieldSchema as CustomFieldSchema & { display_in_list?: boolean }).display_in_list
    return displayInList && values[key] !== undefined && values[key] !== null
  })

  if (displayFields.length === 0) {
    return null
  }

  const formatBadgeValue = (key: string, fieldSchema: CustomFieldSchema): string => {
    const value = values[key]

    if (fieldSchema.type === 'number' && fieldSchema.unit) {
      return `${value} ${fieldSchema.unit}`
    }

    if (fieldSchema.type === 'boolean') {
      return value ? (locale === 'ar' ? fieldSchema.label_ar || fieldSchema.label : fieldSchema.label) : ''
    }

    return String(value)
  }

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {displayFields.map(([key, fieldSchema]) => {
        const badgeValue = formatBadgeValue(key, fieldSchema)
        if (!badgeValue) return null

        return (
          <span
            key={key}
            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
          >
            {badgeValue}
          </span>
        )
      })}
    </div>
  )
}
