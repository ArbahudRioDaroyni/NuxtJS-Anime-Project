import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | null = null

/**
 * Get a singleton instance of PrismaClient
 * @returns PrismaClient instance
 */
export function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

/**
 * Get fields of a specific table from the database using a raw SQL query
 * This function retrieves the column names and data types from the information schema
 * @param tableName - Name of the table to get fields from
 * @return Promise resolving to an array of field objects
 */
export async function getPrismaModelFieldsFromQuery(tableName: string) {
  const result = await getPrismaClient().$queryRaw<
    { column_name: string; data_type: string }[]
  >`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = ${tableName}
    ORDER BY ordinal_position
  `

  const formattedResult = result.map(field => ({
    name: field.column_name,
    type: field.data_type
  }))

  return formattedResult
}

/**
 * Validate and retrieve fields for a specific Prisma model
 * This function checks if the requested fields are valid for the given model
 * @param table - Name of the Prisma model (table)
 * @param field - Comma-separated string of requested fields
 * @return Object containing validation result and safe fields
 * @throws an error if the model or fields are invalid
 */
export function getPrismaModelFields(table: string, field?: string){
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
  } catch (e: unknown) {
    return {
      isValid: false,
      message: e instanceof Error ? e.message : 'An error occurred while retrieving anime list.',
      data: null
    };
  }
}