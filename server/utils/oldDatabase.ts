import Database from 'better-sqlite3';
import { useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();
const TABLE_NAME = 'anime';

export const db = new Database(config.databasePath, {
    // verbose: console.log
});

interface resultType {
    data: any[];
    length: number;
    status?: number;
    message?: string;
}

export const getAll = async (search: string, fields: string, limit: number, offset: number, tableName: string = TABLE_NAME): Promise<resultType> => {
    try {
        const maxCharacterOfSearch = 50;
        if (search.length > maxCharacterOfSearch) {
            throw new Error(`Search query too long. Maximum length is ${maxCharacterOfSearch} characters.`);
        }

        // Validate fields if not '*'
        if (fields !== '*') {
            const validFieldsStmt = db.prepare(`PRAGMA table_info(${tableName})`);
            const validFieldsRows = validFieldsStmt.all();
            const validFields = validFieldsRows.map((row: any) => row.name);

            const requestedFields = fields.split(',').map(f => f.trim());
            const invalidFields = requestedFields.filter(f => !validFields.includes(f));
            if (invalidFields.length > 0) {
                throw new Error(`Invalid field(s): ${invalidFields.join(', ')}`);
            }
        }

        // Only allow safe field names (already validated above)
        const selectedFields = fields === '*' ? '*' : fields.split(',').map(f => `"${f.trim()}"`).join(', ');

        let sql = `SELECT ${selectedFields} FROM "${tableName}"`;
        const query: any[] = [];

        if (search) {
            sql += ` WHERE title_romaji LIKE ?`;
            query.push(`%${search}%`);
        }

        sql += ` ORDER BY id LIMIT ? OFFSET ?`;
        query.push(limit, offset);

        const stmt = db.prepare(sql);
        const rows = stmt.all(...query);

        return {
            data: rows,
            length: rows.length,
            status: 200,
            message: 'Records fetched successfully.'
        };
    } catch (error: any) {
        return {
            data: [],
            length: 0,
            status: 500,
            message: error.message || 'There was an error fetching the data, please try again later.',
        };
    }
};

/**
 * Fetch a record by its ID.
 * This function retrieves a single record from the database based on the provided ID.
 * @param {number} id - The ID of the record to fetch.
 * @param {string} [tableName=TABLE_NAME] - The name of the table to query. Defaults to 'anime'.
 * @returns {Promise<resultType>} - A promise that resolves to an object containing the fetched record, its length, status code, and a message.
 * @throws {Error} - Throws an error if no record is found with the given ID or if there is an issue with the database query.
 * @example
 * const result = await getById(1);
 */
export const getById = async (id: number, tableName: string = TABLE_NAME): Promise<resultType> => {
    try {
        const sql = `SELECT * FROM "${tableName}" WHERE id = ?`;
        const stmt = db.prepare(sql);
        const row = stmt.get(id);

        if (!row) {
            throw new Error(`No record found with id ${id}`);
        }

        return {
            data: [row],
            length: 1,
            status: 200,
            message: 'Record fetched successfully.',
        };
    } catch (error: any) {
        return {
            data: [],
            length: 0,
            status: 404,
            message: `There was an error fetching the data, please try again later. Error: ${error.message || 'Unknown error'}`
        };
    }
};

export const getDetailsAnimeById = async (id: number, tableName: string = TABLE_NAME): Promise<resultType> => {
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
        const row = stmt.get(id) as Record<string, any>;

        if (!row) {
            throw new Error(`No record found with id ${id}`);
        }

        const {release_format_id, status_type_id, source_media_type_id, ...animeData} = row;
        
        return {
            data: [{
                ...animeData,
                anime_studio_relations: row.anime_studio_relations ? JSON.parse(row.anime_studio_relations) : []
            }],
            length: 1,
            status: 200,
            message: 'Record fetched successfully.',
        };
    } catch (error: any) {
        return {
            data: [],
            length: 0,
            status: 404,
            message: `There was an error fetching the data, please try again later. Error: ${error.message || 'Unknown error'}`
        };
    }
}

/**
 * Fetch a record by a specific row name and value.
 * This function retrieves a single record from the database based on the provided row name and value.
 * @param {string} row - The name of the row to search by.
 * @param {string | number} value - The value to search for in the specified row.
 * @param {string} [tableName=TABLE_NAME] - The name of the table to query. Defaults to 'anime'.
 * @returns {Promise<resultType>} - A promise that resolves to an object containing the fetched record, its length, status code, and a message.
 * @throws {Error} - Throws an error if no record is found with the given row name and value, or if there is an issue with the database query.
 * @example
 * const result = await getByRowName('title', 'Naruto');
 */
export const getByRowName = async (row: string, value: string | number, tableName: string = TABLE_NAME): Promise<resultType> => {
    try {
        const sql = `SELECT * FROM "${tableName}" WHERE "${row}" = ?`;
        const stmt = db.prepare(sql);
        const rowData = stmt.get(value);

        if (!rowData) {
            throw new Error(`No record found with ${row} = ${value}`);
        }

        return {
            data: [rowData],
            length: 1,
            status: 200,
            message: 'Record fetched successfully.'
        };
    } catch (error: any) {
        return {
            data: [],
            length: 0,
            status: 404,
            message: `There was an error fetching the data, please try again later. Error: ${error.message || 'Unknown error'}`
        };
    }
}

/**
 * Create a new record in the database.
 * This function inserts a new record into the specified table with the provided object data.
 * @param {Record<string, any>} object - The object containing the data to insert into the table.
 * @param {string} [tableName=TABLE_NAME] - The name of the table to insert the record into. Defaults to 'anime'.
 * @returns {Promise<resultType>} - A promise that resolves to an object containing the ID of the newly created record, its length, status code, and a message.
 * @throws {Error} - Throws an error if the insert operation fails or if there is an issue with the database query.
 * @example
 * const newRecord = { title: 'Naruto', genre: 'Action', episodes: 220 };
 * const result = await create(newRecord);
 */
export const create = async (object: Record<string, any>, tableName: string = TABLE_NAME): Promise<resultType> => {
    try {
        const fields = Object.keys(object).map(f => `"${f}"`).join(', ');
        const placeholders = Object.keys(object).map(() => '?').join(', ');
        const values = Object.values(object);

        const sql = `INSERT INTO "${tableName}" (${fields}) VALUES (${placeholders})`;
        const stmt = db.prepare(sql);
        const info = stmt.run(...values);

        if (info.changes === 0) {
            throw new Error('Insert operation failed, no rows were affected.');
        }

        return {
            data: [{ id: info.lastInsertRowid }],
            length: 1,
            status: 201,
            message: 'Record created successfully.'
        };
    } catch (error: any) {
        return {
            data: [],
            length: 0,
            status: 500,
            message: `There was an error creating the record, please try again later. Error: ${error.message || 'Unknown error'}`
        };
    }
}

/**
 * Bulk create multiple records in the database.
 * This function inserts multiple records into the specified table with the provided array of objects.
 * @param {Record<string, any>[]} objects - An array of objects containing the data to insert into the table.
 * @param {string} [tableName=TABLE_NAME] - The name of the table to insert the records into. Defaults to 'anime'.
 * @returns {Promise<resultType>} - A promise that resolves to an object containing the number of records created, their last inserted row ID, status code, and a message.
 * @throws {Error} - Throws an error if the bulk insert operation fails or if there is an issue with the database query.
 * @example
 * const newRecords = [
 *  { title: 'Naruto', genre: 'Action', episodes: 220 },
 *  { title: 'One Piece', genre: 'Adventure', episodes: 1000 },
 * ];
 * const result = await bulkCreate(newRecords);
 */
export const bulkCreate = async (objects: Record<string, any>[], tableName: string = TABLE_NAME): Promise<resultType> => {
    try {
        if (!Array.isArray(objects) || objects.length === 0) {
            throw new Error('No records provided for bulk creation.');
        }

        const fields = Object.keys(objects[0]).map(f => `"${f}"`).join(', ');
        const placeholders = Object.keys(objects[0]).map(() => '?').join(', ');
        const values = objects.flatMap(obj => Object.values(obj));

        const sql = `INSERT INTO "${tableName}" (${fields}) VALUES (${placeholders})`;
        const stmt = db.prepare(sql);
        const info = stmt.run(...values);

        if (info.changes === 0) {
            throw new Error('Bulk insert operation failed, no rows were affected.');
        }

        return {
            data: [{ changes: info.changes, lastInsertRowid: info.lastInsertRowid }],
            length: info.changes,
            status: 201,
            message: 'Records created successfully.'
        };
    } catch (error: any) {
        return {
            data: [],
            length: 0,
            status: 500,
            message: `There was an error creating the records, please try again later. Error: ${error.message || 'Unknown error'}`
        };
    }
}

/**
 * Update a record by its ID.
 * This function updates an existing record in the database based on the provided ID and object data.
 * @param {number} id - The ID of the record to update.
 * @param {Record<string, any>} object - The object containing the data to update in the record.
 * @param {string} [tableName=TABLE_NAME] - The name of the table to update. Defaults to 'anime'.
 * @returns {Promise<resultType>} - A promise that resolves to an object containing the number of records updated, status code, and a message.
 * @throws {Error} - Throws an error if no record is found with the given ID or if there is an issue with the database query.
 * @example
 * const updatedRecord = { title: 'Naruto Shippuden', genre: 'Action', episodes: 500 };
 * const result = await update(1, updatedRecord);
 */
export const update = async (id: number, object: Record<string, any>, tableName: string = TABLE_NAME): Promise<resultType> => {
    try {
        const fields = Object.keys(object).map(f => `"${f}" = ?`).join(', ');
        const values = Object.values(object);

        if (values.length === 0) {
            throw new Error('No fields provided for update.');
        }

        const sql = `UPDATE "${tableName}" SET ${fields} WHERE id = ?`;
        const stmt = db.prepare(sql);
        const info = stmt.run(...values, id);

        if (info.changes === 0) {
            throw new Error(`No record found with id ${id} or no changes made.`);
        }

        return {
            data: [{ id }],
            length: 1,
            status: 200,
            message: 'Record updated successfully.'
        };
    } catch (error: any) {
        return {
            data: [],
            length: 0,
            status: 500,
            message: `There was an error updating the record, please try again later. Error: ${error.message || 'Unknown error'}`
        };
    }
}

/**
 * Delete a record by its ID.
 * This function deletes a record from the database based on the provided ID.
 * @param {object[]} objects - An array of objects containing the data to update in the records.
 * @param {string} [tableName=TABLE_NAME] - The name of the table to delete from. Defaults to 'anime'.
 * @returns {Promise<resultType>} - A promise that resolves to an object containing the number of records deleted, status code, and a message.
 * @throws {Error} - Throws an error if no record is found with the given ID or if there is an issue with the database query.
 * @example
 * const result = await deleteById(1);
 */
export const bulkUpdate = async (objects: Record<string, any>[], tableName: string = TABLE_NAME): Promise<resultType> => {
    try {
        if (!Array.isArray(objects) || objects.length === 0) {
            throw new Error('No records provided for bulk update.');
        }

        const updates = objects.map(obj => {
            const id = obj.id;
            const fields = Object.keys(obj).filter(f => f !== 'id').map(f => `"${f}" = ?`).join(', ');
            const values = Object.values(obj).filter((_, index) => index !== 0); // Exclude ID from values
            return { id, fields, values };
        });

        const sqls = updates.map(update => `UPDATE "${tableName}" SET ${update.fields} WHERE id = ?`);
        const stmt = db.transaction((...args: any[]) => {
            for (let i = 0; i < updates.length; i++) {
                db.prepare(sqls[i]).run(...updates[i].values, updates[i].id);
            }
        });

        stmt();

        return {
            data: [{ changes: updates.length }],
            length: updates.length,
            status: 200,
            message: 'Records updated successfully.'
        };
    } catch (error: any) {
        return {
            data: [],
            length: 0,
            status: 500,
            message: `There was an error updating the records, please try again later. Error: ${error.message || 'Unknown error'}`
        };
    }
}

export const softDelete = async (id: number, tableName: string = TABLE_NAME): Promise<resultType> => {
    try {
        const deletedAt = new Date().toISOString();
        const sql = `UPDATE "${tableName}" SET deleted_at = ? WHERE id = ?`;
        const stmt = db.prepare(sql);
        const info = stmt.run(deletedAt, id);

        if (info.changes === 0) {
            throw new Error(`No record found with id ${id}`);
        }

        return {
            data: [{ id, deleted_at: deletedAt }],
            length: 1,
            status: 200,
            message: 'Record soft-deleted successfully.'
        };
    } catch (error: any) {
        return {
            data: [],
            length: 0,
            status: 500,
            message: `There was an error soft-deleting the record, please try again later. Error: ${error.message || 'Unknown error'}`
        };
    }
}

/**
 * Delete a record by its ID.
 * This function deletes a record from the database based on the provided ID.
 * @param {number} id - The ID of the record to delete.
 * @param {string} [tableName=TABLE_NAME] - The name of the table to delete from. Defaults to 'anime'.
 * @returns {Promise<resultType>} - A promise that resolves to an object containing the ID of the deleted record, its length, status code, and a message.
 * @throws {Error} - Throws an error if no record is found with the given ID or if there is an issue with the database query.
 * @example
 * const result = await destroy(1);
 */
export const destroy = async (id: number, tableName: string = TABLE_NAME): Promise<resultType> => {
    try {
        const sql = `DELETE FROM "${tableName}" WHERE id = ?`;
        const stmt = db.prepare(sql);
        const info = stmt.run(id);

        if (info.changes === 0) {
            throw new Error(`No record found with id ${id}`);
        }

        return {
            data: [{ id }],
            length: 1,
            status: 200,
            message: 'Record deleted successfully.'
        };
    } catch (error: any) {
        return {
            data: [],
            length: 0,
            status: 500,
            message: `There was an error deleting the record, please try again later. Error: ${error.message || 'Unknown error'}`
        };
    }
}

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
    dflt_value: any;
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
        const query = `PRAGMA table_info(${tableName});`;
        try {
            const rows = db.prepare(query).all() as TableInfoRow[];
            console.log(`Structure of table ${tableName}:`);
            console.table(rows);

            try {
                const uniqueQuery = `PRAGMA index_list(${tableName});`;
                const indexRows: IndexListRow[] = db.prepare(uniqueQuery).all() as any as IndexListRow[];
                console.log(`Unique constraints of table ${tableName}:`);
                console.table(indexRows.filter(index => index.unique));

                // Fetch columns for each unique index
                indexRows
                    .filter(index => index.unique)
                    .forEach(index => {
                        try {
                            const indexInfoQuery = `PRAGMA index_info(${index.name});`;
                            const infoRows = db.prepare(indexInfoQuery).all() as IndexInfoRow[];
                            console.log(`Columns in unique index ${index.name}:`);
                            console.table(infoRows);
                        } catch (infoError: any) {
                            console.error(`Unexpected error processing index ${index.name}:`, infoError.message);
                        }
                    });
            } catch (uniqueError: any) {
                console.error(`Unexpected error fetching unique constraints for ${tableName}:`, uniqueError.message);
            }
        } catch (error: any) {
            console.error(`Error fetching table structure for ${tableName}:`, error.message);
        }
    } catch (error: any) {
        console.error(`Unexpected error fetching table structure for ${tableName}:`, error.message);
        db.close();
    }
}