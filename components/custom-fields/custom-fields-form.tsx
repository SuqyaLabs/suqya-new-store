'use client'

import { useState, useEffect } from 'react'
import { DynamicField } from './dynamic-field'
import { useTenant } from '@/hooks/use-tenant'
import type { CustomFieldSchema } from '@/types/multi-business'
import { cn } from '@/lib/utils'

interface CustomFieldsFormProps {
  entityType: 'product' | 'category' | 'customer' | 'order' | 'variant'
  initialValues?: Record<string, unknown>
  onChange?: (values: Record<string, unknown>) => void
  locale?: 'fr' | 'ar' | 'en'
  disabled?: boolean
  className?: string
  columns?: 1 | 2 | 3
}

export function CustomFieldsForm({
  entityType,
  initialValues = {},
  onChange,
  locale = 'fr',
  disabled = false,
  className,
  columns = 2
}: CustomFieldsFormProps) {
  const { productSchema, businessType } = useTenant()
  const [values, setValues] = useState<Record<string, unknown>>(initialValues)

  // Get schema based on entity type
  const schema: Record<string, CustomFieldSchema> = entityType === 'product' 
    ? productSchema 
    : {}

  // Update values when initialValues change
  useEffect(() => {
    setValues(initialValues)
  }, [initialValues])

  const handleFieldChange = (fieldKey: string, value: unknown) => {
    const newValues = { ...values, [fieldKey]: value }
    setValues(newValues)
    onChange?.(newValues)
  }

  const schemaEntries = Object.entries(schema)

  if (schemaEntries.length === 0) {
    return null
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  // Group fields by group_name if available
  const groupedFields: Record<string, Array<[string, CustomFieldSchema]>> = {}
  const ungroupedFields: Array<[string, CustomFieldSchema]> = []

  schemaEntries.forEach(([key, fieldSchema]) => {
    // Check if schema has grouping info (from custom_field_definitions)
    const groupName = (fieldSchema as CustomFieldSchema & { group_name?: string }).group_name
    if (groupName) {
      if (!groupedFields[groupName]) {
        groupedFields[groupName] = []
      }
      groupedFields[groupName].push([key, fieldSchema])
    } else {
      ungroupedFields.push([key, fieldSchema])
    }
  })

  const renderFields = (fields: Array<[string, CustomFieldSchema]>) => (
    <div className={cn("grid gap-4", gridCols[columns])}>
      {fields.map(([fieldKey, fieldSchema]) => (
        <DynamicField
          key={fieldKey}
          fieldKey={fieldKey}
          schema={fieldSchema}
          value={values[fieldKey]}
          onChange={(value) => handleFieldChange(fieldKey, value)}
          locale={locale}
          disabled={disabled}
        />
      ))}
    </div>
  )

  return (
    <div className={cn("space-y-6", className)}>
      {/* Grouped fields */}
      {Object.entries(groupedFields).map(([groupName, fields]) => (
        <div key={groupName} className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            {groupName}
          </h4>
          {renderFields(fields)}
        </div>
      ))}

      {/* Ungrouped fields */}
      {ungroupedFields.length > 0 && (
        <div className="space-y-4">
          {Object.keys(groupedFields).length > 0 && (
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {locale === 'ar' ? 'حقول أخرى' : 'Autres champs'}
            </h4>
          )}
          {renderFields(ungroupedFields)}
        </div>
      )}
    </div>
  )
}

// Hook to use custom fields in forms
export function useCustomFields(
  entityType: 'product' | 'category' | 'customer' | 'order' | 'variant',
  initialValues: Record<string, unknown> = {}
) {
  const { productSchema } = useTenant()
  const [values, setValues] = useState<Record<string, unknown>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const schema = entityType === 'product' ? productSchema : {}

  const setValue = (key: string, value: unknown) => {
    setValues(prev => ({ ...prev, [key]: value }))
    // Clear error when value changes
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    Object.entries(schema).forEach(([key, fieldSchema]) => {
      const value = values[key]
      
      // Required validation
      if (fieldSchema.required && (value === undefined || value === null || value === '')) {
        newErrors[key] = 'Ce champ est requis'
      }

      // Number validation
      if (fieldSchema.type === 'number' && value !== undefined && value !== null) {
        const numValue = Number(value)
        if (fieldSchema.validation?.min !== undefined && numValue < fieldSchema.validation.min) {
          newErrors[key] = `Minimum: ${fieldSchema.validation.min}`
        }
        if (fieldSchema.validation?.max !== undefined && numValue > fieldSchema.validation.max) {
          newErrors[key] = `Maximum: ${fieldSchema.validation.max}`
        }
      }

      // Text validation
      if ((fieldSchema.type === 'text' || fieldSchema.type === 'textarea') && typeof value === 'string') {
        if (fieldSchema.validation?.minLength && value.length < fieldSchema.validation.minLength) {
          newErrors[key] = `Minimum ${fieldSchema.validation.minLength} caractères`
        }
        if (fieldSchema.validation?.maxLength && value.length > fieldSchema.validation.maxLength) {
          newErrors[key] = `Maximum ${fieldSchema.validation.maxLength} caractères`
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const reset = (newValues: Record<string, unknown> = {}) => {
    setValues(newValues)
    setErrors({})
  }

  return {
    values,
    errors,
    schema,
    setValue,
    setValues,
    validate,
    reset,
    hasFields: Object.keys(schema).length > 0
  }
}
