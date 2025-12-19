'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { CustomFieldSchema } from '@/types/multi-business'

interface DynamicFieldProps {
  fieldKey: string
  schema: CustomFieldSchema
  value: unknown
  onChange: (value: unknown) => void
  locale?: 'fr' | 'ar' | 'en'
  disabled?: boolean
  error?: string
  className?: string
}

export function DynamicField({
  fieldKey,
  schema,
  value,
  onChange,
  locale = 'fr',
  disabled = false,
  error,
  className
}: DynamicFieldProps) {
  // Get localized label
  const label = locale === 'ar'
    ? (schema.label_ar || schema.label)
    : locale === 'en'
      ? (schema.label_en || schema.label)
      : schema.label

  const isRequired = schema.required
  const helpText = schema.help_text

  const renderField = () => {
    switch (schema.type) {
      case 'text':
        return (
          <Input
            id={fieldKey}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder}
            disabled={disabled}
            className={error ? 'border-destructive' : ''}
          />
        )

      case 'textarea':
        return (
          <Textarea
            id={fieldKey}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder}
            disabled={disabled}
            className={cn("min-h-24", error ? 'border-destructive' : '')}
          />
        )

      case 'number':
        return (
          <div className="flex items-center gap-2">
            <Input
              id={fieldKey}
              type="number"
              value={value !== undefined && value !== null ? String(value) : ''}
              onChange={(e) => {
                const val = e.target.value
                onChange(val === '' ? null : parseFloat(val))
              }}
              placeholder={schema.placeholder}
              min={schema.validation?.min}
              max={schema.validation?.max}
              disabled={disabled}
              className={cn("flex-1", error ? 'border-destructive' : '')}
            />
            {schema.unit && (
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {schema.unit}
              </span>
            )}
          </div>
        )

      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id={fieldKey}
              checked={(value as boolean) || false}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm">{label}</span>
          </label>
        )

      case 'select':
        return (
          <select
            id={fieldKey}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value || null)}
            disabled={disabled}
            className={cn(
              "w-full h-10 px-3 rounded-md border border-input bg-background text-sm",
              "focus:outline-none focus:ring-2 focus:ring-ring",
              error ? 'border-destructive' : ''
            )}
          >
            <option value="">
              {locale === 'ar' ? 'اختر...' : 'Sélectionner...'}
            </option>
            {schema.options?.map((opt) => {
              const optValue = typeof opt === 'string' ? opt : opt.value
              const optLabel = typeof opt === 'string'
                ? opt
                : locale === 'ar'
                  ? (opt.label_ar || opt.label)
                  : locale === 'en'
                    ? (opt.label_en || opt.label)
                    : opt.label
              return (
                <option key={optValue} value={optValue}>
                  {optLabel}
                </option>
              )
            })}
          </select>
        )

      case 'multiselect':
        const selectedValues = (value as string[]) || []
        return (
          <div className="space-y-2">
            {schema.options?.map((opt) => {
              const optValue = typeof opt === 'string' ? opt : opt.value
              const optLabel = typeof opt === 'string'
                ? opt
                : locale === 'ar'
                  ? (opt.label_ar || opt.label)
                  : locale === 'en'
                    ? (opt.label_en || opt.label)
                    : opt.label
              const isChecked = selectedValues.includes(optValue)

              return (
                <label key={optValue} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange([...selectedValues, optValue])
                      } else {
                        onChange(selectedValues.filter((v) => v !== optValue))
                      }
                    }}
                    disabled={disabled}
                    className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{optLabel}</span>
                </label>
              )
            })}
          </div>
        )

      case 'date':
        return (
          <Input
            id={fieldKey}
            type="date"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value || null)}
            disabled={disabled}
            className={error ? 'border-destructive' : ''}
          />
        )

      case 'json':
        return (
          <Textarea
            id={fieldKey}
            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : (value as string) || ''}
            onChange={(e) => {
              try {
                onChange(JSON.parse(e.target.value))
              } catch {
                onChange(e.target.value)
              }
            }}
            placeholder={schema.placeholder || '{}'}
            disabled={disabled}
            className={cn("min-h-32 font-mono text-sm", error ? 'border-destructive' : '')}
          />
        )

      default:
        return (
          <Input
            id={fieldKey}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.placeholder}
            disabled={disabled}
          />
        )
    }
  }

  // For boolean type, label is rendered inline
  if (schema.type === 'boolean') {
    return (
      <div className={cn("space-y-1", className)}>
        {renderField()}
        {helpText && (
          <p className="text-xs text-muted-foreground">{helpText}</p>
        )}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={fieldKey} className="flex items-center gap-1">
        {label}
        {isRequired && <span className="text-destructive">*</span>}
      </Label>
      {renderField()}
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
