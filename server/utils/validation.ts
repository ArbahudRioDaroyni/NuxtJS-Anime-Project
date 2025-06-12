import type { H3Event } from 'h3';
import { getPrismaClient } from '~/server/utils/prisma'

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
    const model = (prisma as any)[table]?.fields;
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
  } catch (error: any) {
    return {
      isValid: false,
      message: error.message || 'An error occurred during field validation',
      data: null
    };
  }
}