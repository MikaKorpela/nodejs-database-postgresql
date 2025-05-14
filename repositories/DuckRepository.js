import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

async function findAll() {
  const query = 'SELECT * FROM duck';

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    throw new Error(JSON.stringify({ status: 500, message: `Failed to fetch entities; ${err}`}));
  }
}

async function findByUid(uid) {
  const query = 'SELECT * FROM duck WHERE uid = $1';
  const values = [uid];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(JSON.stringify({ status: 500, message: `Failed to fetch entity ${uid}; ${err}`}));
  }
}

async function create(duck) {
  const query = 'INSERT INTO duck (name) VALUES ($1) RETURNING *';
  const values = [duck.name];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(JSON.stringify({ status: 500, message: `Failed to create entity; ${err}`}));
  }
}

async function update(uid, duck) {
  const query = 'UPDATE duck SET name= $1 WHERE uid = $2 RETURNING *';
  const values = [duck.name, uid];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(JSON.stringify({ status: 500, message: `Failed to update entity ${uid}; ${err}`}));
  }
}

async function deleteByUid(uid) {
  const query = 'DELETE FROM duck WHERE uid=$1';
  const values = [uid];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(JSON.stringify({ status: 500, message: `Failed to delete entity ${uid}; ${err}`}));
  }
}

module.exports = {findAll, findByUid, create, update, deleteByUid};



