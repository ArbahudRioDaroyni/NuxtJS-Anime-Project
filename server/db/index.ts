import Database from 'better-sqlite3';
import type { ResponseType } from '~/types/database'

const config = useRuntimeConfig();
const TABLE_NAME = 'anime';

export const db = new Database(config.databasePath, {
	// verbose: console.log
});

/**
 * Fetch all records with optional search, field selection, limit, and offset.
 * @param {string} search - Search string for title_romaji.
 * @param {string} fields - Comma-separated list of fields to select, or '*' for all.
 * @param {number} limit - Maximum number of records to fetch.
 * @param {number} offset - Number of records to skip.
 * @param {string} [tableName=TABLE_NAME] - Table name to query.
 * @returns {Promise<ResponseType>} - Result object with data, length, status, and message.
 * @throws {Error} - Throws an error if the search string exceeds the maximum length or if invalid fields are requested.
 * @example
 * const result = await getAll('Naruto', 'id,title_romaji,episodes', 10, 0);
 */
export const getAll = async (
  search: string,
  fields: string,
  limit: number,
  offset: number,
  tableName: string = TABLE_NAME
): Promise<ResponseType> => {
  try {
    const maxSearchLength = 50;
    if (search.length > maxSearchLength) {
      throw new Error(`Search query too long. Maximum length is ${maxSearchLength} characters.`);
    }

    // Validate and build selected fields
    let selectedFields = '*';
    if (fields !== '*') {
      const tableInfo = db.prepare(`PRAGMA table_info(${tableName})`).all() as TableInfoRow[];
      const validFields = new Set(tableInfo.map(row => row.name));
      const requestedFields = fields.split(',').map(f => f.trim());
      const invalidFields = requestedFields.filter(f => !validFields.has(f));
      if (invalidFields.length) {
        throw new Error(`Invalid field(s): ${invalidFields.join(', ')}`);
      }
      selectedFields = requestedFields.map(f => `"${f}"`).join(', ');
    }

    // Build SQL and params
    let sql = `SELECT ${selectedFields} FROM "${tableName}"`;
    const params: unknown[] = [];

    if (search) {
      sql += ` WHERE title_romaji LIKE ?`;
      params.push(`%${search}%`);
    }

    sql += ` ORDER BY id LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const rows = db.prepare(sql).all(...params);

    return {
      data: rows,
      length: rows.length,
      code: 200,
      success: true,
      message: 'Records fetched successfully.'
    };
  } catch (error: unknown) {
    return {
      data: [],
      length: 0,
      code: 500,
      success: false,
      message: error instanceof Error
        ? error.message
        : 'There was an error fetching the data, please try again later.',
    };
  }
};

/**
 * Fetch a record by its ID.
 * This function retrieves a single record from the database based on the provided ID.
 * @param {number} id - The ID of the record to fetch.
 * @param {string} [tableName=TABLE_NAME] - The name of the table to query. Defaults to 'anime'.
 * @returns {Promise<ResponseType>} - A promise that resolves to an object containing the fetched record, its length, status code, and a message.
 * @throws {Error} - Throws an error if no record is found with the given ID or if there is an issue with the database query.
 * @example
 * const result = await getById(1);
 */
export const getById = async (
  id: number,
  tableName: string = TABLE_NAME
): Promise<ResponseType> => {
  try {
    const sql = `SELECT * FROM "${tableName}" WHERE id = ?`;
    const row = db.prepare(sql).get(id);

    if (!row) {
      throw new Error(`No record found with id ${id}`);
    }

    return {
      data: [row],
      length: 1,
      code: 200,
      success: true,
      message: 'Record fetched successfully.',
    };
  } catch (error: unknown) {
    return {
      data: [],
      length: 0,
      code: 404,
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'There was an error fetching the data, please try again later.',
    };
  }
};

export const getDetailsAnimeById = async (id: number, tableName: string = TABLE_NAME): Promise<ResponseType> => {
	try {
		const sql = `
			SELECT 
				anime.*,
				release_formats.name AS format,
				status_types.name AS status,
				media_types.name AS source,
				(
					SELECT json_group_array(json_object(
						'is_main', asr.is_main,
						'studio_name', studios.name
					))
					FROM anime_studio_relations asr
					LEFT JOIN studios ON asr.studio_id = studios.id
					WHERE asr.anime_id = anime.id
				) AS anime_studio_relations
			FROM ${tableName}
			LEFT JOIN release_formats ON anime.release_format_id = release_formats.id
			LEFT JOIN status_types ON anime.status_type_id = status_types.id
			LEFT JOIN media_types ON anime.source_media_type_id = media_types.id
			WHERE anime.id = ?
		`;
		const stmt = db.prepare(sql);
		const row = stmt.get(id) as Record<string, unknown>;

		if (!row) {
			throw new Error(`No record found with id ${id}`);
		}

		const {release_format_id, status_type_id, source_media_type_id, ...animeData} = row;
		
		return {
			data: [{
				...animeData,
				anime_studio_relations: typeof row.anime_studio_relations === 'string' && row.anime_studio_relations
					? JSON.parse(row.anime_studio_relations)
					: []
			}],
			length: 1,
			code: 200,
      success: true,
			message: 'Record fetched successfully.',
		};
	} catch (error: unknown) {
		return {
			data: [],
			length: 0,
			code: 404,
      success: false,
			message: (error instanceof Error ? error.message : 'There was an error fetching the data, please try again later.'),
		};
	}
}

/**
 * Fetch a record by a specific row name and value.
 * This function retrieves a single record from the database based on the provided row name and value.
 * @param {string} row - The name of the row to search by.
 * @param {string | number} value - The value to search for in the specified row.
 * @param {string} [tableName=TABLE_NAME] - The name of the table to query. Defaults to 'anime'.
 * @returns {Promise<ResponseType>} - A promise that resolves to an object containing the fetched record, its length, status code, and a message.
 * @throws {Error} - Throws an error if no record is found with the given row name and value, or if there is an issue with the database query.
 * @example
 * const result = await getByRowName('title', 'Naruto');
 */
export const getByRowName = async (
  row: string,
  value: string | number,
  tableName: string = TABLE_NAME
): Promise<ResponseType> => {
  try {
    // Validate column name
    const tableInfo = db.prepare(`PRAGMA table_info(${tableName})`).all() as TableInfoRow[];
    const validFields = new Set(tableInfo.map(col => col.name));
    if (!validFields.has(row)) {
      throw new Error(`Invalid column name: ${row}`);
    }

    const sql = `SELECT * FROM "${tableName}" WHERE "${row}" = ?`;
    const rowData = db.prepare(sql).get(value);

    if (!rowData) {
      throw new Error(`No record found with ${row} = ${value}`);
    }

    return {
      data: [rowData],
      length: 1,
      code: 200,
      success: true,
      message: 'Record fetched successfully.'
    };
  } catch (error: unknown) {
    return {
      data: [],
      length: 0,
      code: 404,
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'There was an error fetching the data, please try again later.',
    };
  }
};

/**
 * Create a new record in the database.
 * This function inserts a new record into the specified table with the provided object data.
 * @param {Record<string, unknown>} object - The object containing the data to insert into the table.
 * @param {string} [tableName=TABLE_NAME] - The name of the table to insert the record into. Defaults to 'anime'.
 * @returns {Promise<ResponseType>} - A promise that resolves to an object containing the ID of the newly created record, its length, status code, and a message.
 * @throws {Error} - Throws an error if the insert operation fails or if there is an issue with the database query.
 * @example
 * const newRecord = { title: 'Naruto', genre: 'Action', episodes: 220 };
 * const result = await create(newRecord);
 */
export const create = async (
  object: Record<string, unknown>,
  tableName: string = TABLE_NAME
): Promise<ResponseType> => {
  try {
    const keys = Object.keys(object);
    if (keys.length === 0) {
      throw new Error('No fields provided for creation.');
    }

    const fields = keys.map(f => `"${f}"`).join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map(k => object[k]);

    const sql = `INSERT INTO "${tableName}" (${fields}) VALUES (${placeholders})`;
    const info = db.prepare(sql).run(...values);

    if (info.changes === 0) {
      throw new Error('Insert operation failed, no rows were affected.');
    }

    return {
      data: [{ id: info.lastInsertRowid }],
      length: 1,
      code: 200,
      success: true,
      message: 'Record created successfully.'
    };
  } catch (error: unknown) {
    return {
      data: [],
      length: 0,
      code: 500,
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'There was an error creating the record, please try again later.',
    };
  }
};

/**
 * Bulk create multiple records in the database.
 * This function inserts multiple records into the specified table with the provided array of objects.
 * @param {Record<string, unknown>[]} objects - An array of objects containing the data to insert into the table.
 * @param {string} [tableName=TABLE_NAME] - The name of the table to insert the records into. Defaults to 'anime'.
 * @returns {Promise<ResponseType>} - A promise that resolves to an object containing the number of records created, their last inserted row ID, status code, and a message.
 * @throws {Error} - Throws an error if the bulk insert operation fails or if there is an issue with the database query.
 * @example
 * const newRecords = [
 *  { title: 'Naruto', genre: 'Action', episodes: 220 },
 *  { title: 'One Piece', genre: 'Adventure', episodes: 1000 },
 * ];
 * const result = await bulkCreate(newRecords);
 */
export const bulkCreate = async (
  objects: Record<string, unknown>[],
  tableName: string = TABLE_NAME
): Promise<ResponseType> => {
  try {
    if (!Array.isArray(objects) || objects.length === 0) {
      throw new Error('No records provided for bulk creation.');
    }

    const keys = Object.keys(objects[0]);
    if (keys.length === 0) {
      throw new Error('No fields provided for bulk creation.');
    }

    const fields = keys.map(f => `"${f}"`).join(', ');
    const placeholders = `(${keys.map(() => '?').join(', ')})`;
    const sql = `INSERT INTO "${tableName}" (${fields}) VALUES ${objects.map(() => placeholders).join(', ')}`;
    const values = objects.flatMap(obj => keys.map(k => obj[k]));

    const stmt = db.prepare(sql);
    const info = stmt.run(...values);

    if (info.changes === 0) {
      throw new Error('Bulk insert operation failed, no rows were affected.');
    }

    return {
      data: [{ changes: info.changes, lastInsertRowid: info.lastInsertRowid }],
      length: info.changes,
      code: 200,
      success: true,
      message: 'Records created successfully.'
    };
  } catch (error: unknown) {
    return {
      data: [],
      length: 0,
      code: 500,
      success: false,
      message: error instanceof Error
        ? error.message
        : 'There was an error creating the records, please try again later.',
    };
  }
};

/**
 * Update a record by its ID.
 * This function updates an existing record in the database based on the provided ID and object data.
 * @param {number} id - The ID of the record to update.
 * @param {Record<string, unknown>} object - The object containing the data to update in the record.
 * @param {string} [tableName=TABLE_NAME] - The name of the table to update. Defaults to 'anime'.
 * @returns {Promise<ResponseType>} - A promise that resolves to an object containing the number of records updated, status code, and a message.
 * @throws {Error} - Throws an error if no record is found with the given ID or if there is an issue with the database query.
 * @example
 * const updatedRecord = { title: 'Naruto Shippuden', genre: 'Action', episodes: 500 };
 * const result = await update(1, updatedRecord);
 */
export const update = async (
  id: number,
  object: Record<string, unknown>,
  tableName: string = TABLE_NAME
): Promise<ResponseType> => {
  try {
    const keys = Object.keys(object);
    if (keys.length === 0) {
      throw new Error('No fields provided for update.');
    }

    const fields = keys.map(key => `"${key}" = ?`).join(', ');
    const values = keys.map(key => object[key]);

    const sql = `UPDATE "${tableName}" SET ${fields} WHERE id = ?`;
    const info = db.prepare(sql).run(...values, id);

    if (info.changes === 0) {
      throw new Error(`No record found with id ${id} or no changes made.`);
    }

    return {
      data: [{ id }],
      length: 1,
      code: 200,
      success: true,
      message: 'Record updated successfully.'
    };
  } catch (error: unknown) {
    return {
      data: [],
      length: 0,
      code: 500,
      success: false,
      message: error instanceof Error
        ? error.message
        : 'There was an error updating the record, please try again later.',
    };
  }
};

/**
 * Bulk update multiple records in the database.
 * This function updates multiple records in the specified table using the provided array of objects.
 * Each object must include an 'id' property to identify the record.
 * @param {Record<string, unknown>[]} objects - Array of objects to update (each must include 'id').
 * @param {string} [tableName=TABLE_NAME] - Table name to update. Defaults to 'anime'.
 * @returns {Promise<ResponseType>} - Result object with number of records updated, status, and message.
 * @throws {Error} - Throws if no records provided, missing 'id', or update fails.
 * @example
 * const updates = [
 *   { id: 1, title: 'Naruto Shippuden' },
 *   { id: 2, episodes: 1001 }
 * ];
 * const result = await bulkUpdate(updates);
 */
export const bulkUpdate = async (
  objects: Record<string, unknown>[],
  tableName: string = TABLE_NAME
): Promise<ResponseType> => {
  try {
    if (!Array.isArray(objects) || objects.length === 0) {
      throw new Error('No records provided for bulk update.');
    }

    const updates = objects.map(obj => {
      if (!('id' in obj)) {
        throw new Error('Each object must include an "id" property.');
      }
      const { id, ...fieldsObj } = obj;
      const fieldKeys = Object.keys(fieldsObj);
      if (fieldKeys.length === 0) {
        throw new Error('No fields provided for update in one of the objects.');
      }
      const fields = fieldKeys.map(f => `"${f}" = ?`).join(', ');
      const values = fieldKeys.map(f => fieldsObj[f]);
      return { id, fields, values };
    });

    const transaction = db.transaction(() => {
      for (const update of updates) {
        const sql = `UPDATE "${tableName}" SET ${update.fields} WHERE id = ?`;
        const info = db.prepare(sql).run(...update.values, update.id);
        if (info.changes === 0) {
          throw new Error(`No record found with id ${update.id} or no changes made.`);
        }
      }
    });

    transaction();

    return {
      data: [{ changes: updates.length }],
      length: updates.length,
      code: 200,
      success: true,
      message: 'Records updated successfully.'
    };
  } catch (error: unknown) {
    return {
      data: [],
      length: 0,
      code: 500,
      success: false,
      message: error instanceof Error
        ? error.message
        : 'There was an error updating the records, please try again later.',
    };
  }
};

/**
 * Soft delete a record by its ID by setting the deleted_at timestamp.
 * @param {number} id - The ID of the record to soft delete.
 * @param {string} [tableName=TABLE_NAME] - The name of the table to update. Defaults to 'anime'.
 * @returns {Promise<ResponseType>} - Result object with id, deleted_at, status, and message.
 * @throws {Error} - Throws if no record is found or update fails.
 * @example
 * const result = await softDelete(1);
 */
export const softDelete = async (
  id: number,
  tableName: string = TABLE_NAME
): Promise<ResponseType> => {
  try {
    const deletedAt = new Date().toISOString();
    const sql = `UPDATE "${tableName}" SET deleted_at = ? WHERE id = ?`;
    const info = db.prepare(sql).run(deletedAt, id);

    if (info.changes === 0) {
      throw new Error(`No record found with id ${id}`);
    }

    return {
      data: [{ id, deleted_at: deletedAt }],
      length: 1,
      code: 200,
      success: true,
      message: 'Record soft-deleted successfully.'
    };
  } catch (error: unknown) {
    return {
      data: [],
      length: 0,
      code: 500,
      success: false,
      message: error instanceof Error
        ? error.message
        : 'There was an error soft-deleting the record, please try again later.',
    };
  }
};

/**
 * Delete a record by its ID.
 * Deletes a record from the specified table based on the provided ID.
 * @param {number} id - The ID of the record to delete.
 * @param {string} [tableName=TABLE_NAME] - The name of the table to delete from. Defaults to 'anime'.
 * @returns {Promise<ResponseType>} - Result object with id, length, status, and message.
 * @throws {Error} - Throws if no record is found or delete fails.
 * @example
 * const result = await destroy(1);
 */
export const destroy = async (
  id: number,
  tableName: string = TABLE_NAME
): Promise<ResponseType> => {
  try {
    const sql = `DELETE FROM "${tableName}" WHERE id = ?`;
    const info = db.prepare(sql).run(id);

    if (info.changes === 0) {
      throw new Error(`No record found with id ${id}`);
    }

    return {
      data: [{ id }],
      length: 1,
      code: 200,
      success: true,
      message: 'Record deleted successfully.',
    };
  } catch (error: unknown) {
    return {
      data: [],
      length: 0,
      code: 500,
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'There was an error deleting the record, please try again later.',
    };
  }
};

/**
 * Fetches the structure of a specified table, including its columns and unique constraints.
 * @param {string} tableName - Name of the table to fetch the structure for.
 * @returns {void} - Logs the table structure and unique constraints to the console.
 * @throws {Error} - Throws an error if the table name is invalid or if the query fails.
 */
interface TableInfoRow {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: unknown;
  pk: number;
}

interface IndexListRow {
  seq: number;
  name: string;
  unique: number;
  origin: string;
  partial: number;
}

interface IndexInfoRow {
  seqno: number;
  cid: number;
  name: string;
}

export const showTableStructure = (tableName: string): void => {
  try {
    const tableInfo = db.prepare(`PRAGMA table_info(${tableName});`).all() as TableInfoRow[];
    console.log(`Structure of table ${tableName}:`);
    console.table(tableInfo);

    const indexList = db.prepare(`PRAGMA index_list(${tableName});`).all() as IndexListRow[];
    const uniqueIndexes = indexList.filter(idx => idx.unique);
    if (uniqueIndexes.length) {
      console.log(`Unique constraints of table ${tableName}:`);
      console.table(uniqueIndexes);

      uniqueIndexes.forEach(idx => {
        const indexInfo = db.prepare(`PRAGMA index_info(${idx.name});`).all() as IndexInfoRow[];
        console.log(`Columns in unique index ${idx.name}:`);
        console.table(indexInfo);
      });
    }
  } catch (error: unknown) {
    console.error(
      `Error fetching structure for table ${tableName}:`,
      error instanceof Error ? error.message : error
    );
  }
};
