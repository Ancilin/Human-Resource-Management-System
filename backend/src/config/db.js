import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import pg from 'pg';

// Load env variables
dotenv.config();

let db;

const DATABASE_URL = process.env.DATABASE_URL;

if (DATABASE_URL) {
  // ==========================================
  // Production / Cloud PostgreSQL Connection
  // ==========================================
  console.log('PostgreSQL DATABASE_URL detected. Connecting to Neon...');
  
  const { Pool } = pg;

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Neon serverless connections
    }
  });

  // Helper: Convert SQLite ? to PostgreSQL $1, $2, $3...
  const convertPlaceholders = (sql) => {
    let index = 1;
    return sql.replace(/\?/g, () => `$${index++}`);
  };

  // Helper: Translate SQLite schema creation queries into PostgreSQL
  const translateSchema = (sql) => {
    return sql
      .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY')
      .replace(/REAL/gi, 'DOUBLE PRECISION')
      .replace(/DATETIME/gi, 'TIMESTAMP');
  };

  db = {
    get: async (sql, params = []) => {
      const res = await pool.query(convertPlaceholders(sql), params);
      return res.rows[0] || null;
    },
    all: async (sql, params = []) => {
      const res = await pool.query(convertPlaceholders(sql), params);
      return res.rows;
    },
    run: async (sql, params = []) => {
      const translatedSql = convertPlaceholders(sql);
      
      // If it is an INSERT statement, append RETURNING id to capture lastID
      let finalSql = translatedSql;
      if (/insert\s+into/i.test(translatedSql) && !/returning/i.test(translatedSql)) {
        finalSql += ' RETURNING id';
      }

      const res = await pool.query(finalSql, params);
      return {
        lastID: res.rows[0] ? (res.rows[0].id || res.rows[0].lastid) : null,
        changes: res.rowCount
      };
    },
    exec: async (sql) => {
      // Execute multi-line schema scripts
      const queries = translateSchema(sql)
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0);
      
      for (const q of queries) {
        await pool.query(q);
      }
    }
  };
} else {
  // ==========================================
  // Local Development SQLite Connection
  // ==========================================
  console.log('No DATABASE_URL found. Falling back to local SQLite...');
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const dbPath = path.resolve(__dirname, '../../hrms.db');
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  sqlite3.verbose();

  const rawDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error connecting to SQLite database:', err.message);
    } else {
      console.log('Connected to SQLite database at:', dbPath);
    }
  });

  rawDb.run('PRAGMA foreign_keys = ON;');

  db = {
    get: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        rawDb.get(sql, params, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    },
    all: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        rawDb.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    },
    run: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        rawDb.run(sql, params, function (err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        });
      });
    },
    exec: (sql) => {
      return new Promise((resolve, reject) => {
        rawDb.exec(sql, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  };
}

export default db;
export { db };
