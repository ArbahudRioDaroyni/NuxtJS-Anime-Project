import type { H3Event } from 'h3';
import type { PrismaClient } from '@prisma/client'
import { getPrismaClient } from '~/server/utils/prisma'

export interface ModelField {
  modelName: string
  name: string
  typeName: string
  isList: boolean
  isEnum: boolean
}

export interface ValidationResultModelField {
  valid: boolean
  data: Record<string, unknown>
  errors: string[]
}

const prisma = getPrismaClient()

export function isFields(event: H3Event, field?: string): {
  isValid: boolean;
  message: string;
  data: object | string | null;
} {
  try {
    // If no field is provided, allow all fields
    if (!field || field.trim() === '') {
      return {
        isValid: true,
        message: 'All fields are valid',
        data: null
      };
    }

    // Parse requested fields
    const requestedFields = field
      .split(',')
      .map(f => f.trim())
      .filter(Boolean);

    // Extract table name from URL
    const url = event.node.req.url ?? '';
    const baseUrl = url.split('?')[0] || '';
    const table = baseUrl.split('/')[2] || '';

    // Get model fields from Prisma
    const model = (prisma as PrismaClient)[table as keyof PrismaClient]?.fields;
    if (!model) {
      return {
        isValid: false,
        message: `Model "${table}" not found`,
        data: null
      };
    }

    const validFields = Object.keys(model);
    const invalidFields = requestedFields.filter(f => !validFields.includes(f));

    if (invalidFields.length > 0) {
      return {
        isValid: false,
        message: `Invalid field(s): ${invalidFields.join(', ')}`,
        data: null
      };
    }

    // Return fields as an object { fieldName: true }
    const safeFields = Object.fromEntries(requestedFields.map(f => [f, true]));

    return {
      isValid: true,
      message: 'All fields are valid',
      data: safeFields
    };
  } catch (error: unknown) {
    return {
      isValid: false,
      message: error instanceof Error ? error.message : 'An error occurred during field validation',
      data: null
    };
  }
}

/**
 * Validates and coerces a record's values based on model field definitions.
 */
export function validateRecordAgainstModel(
  record: Record<string, unknown>,
  modelFields: Record<string, ModelField>
): ValidationResultModelField {
  const result: Record<string, unknown> = {}
  const errors: string[] = []

  for (const [key, value] of Object.entries(record)) {
    const field = modelFields[key]
    if (!field) {
      errors.push(`Unknown field: ${key}`)
      continue
    }

    const parsed = coerceValue(value, field.typeName)
    if (parsed instanceof Error) {
      errors.push(`Invalid ${field.typeName} for "${key}": ${value}`)
    } else {
      result[key] = parsed
    }
  }

  return {
    valid: errors.length === 0,
    data: result,
    errors,
  }
}

/**
 * Coerces a value to its expected Prisma type.
 */
function coerceValue(value: unknown, typeName: string): unknown | Error {
  if (value === null || value === undefined || value === '') return null

  switch (typeName) {
    case 'Int': {
      const n = Number(value)
      return Number.isInteger(n) ? n : new Error('Expected integer')
    }
    case 'Float': {
      const n = Number(value)
      return isNaN(n) ? new Error('Expected float') : n
    }
    case 'Boolean': {
      if (typeof value === 'boolean') return value
      if (value === 'true' || value === '1' || value === 1) return true
      if (value === 'false' || value === '0' || value === 0) return false
      return new Error('Expected boolean')
    }
    case 'DateTime': {
      const d = new Date(value as string)
      return isNaN(d.getTime()) ? new Error('Invalid DateTime') : d
    }
    case 'String': {
      return String(value)
    }
    default:
      return value
  }
}