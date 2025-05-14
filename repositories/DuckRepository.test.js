import {describe, test, expect, vi, beforeEach} from 'vitest';
import { Pool } from 'pg';
import * as duckRepository from '../repositories/DuckRepository.js';

vi.mock('pg', () => {
  const pool = {
    query: vi.fn(),
  };
  return { Pool: vi.fn(() => pool) };
});

const pool = new Pool();

beforeEach(() => {
  vi.clearAllMocks();
});

const uid1 = '123e4567-e89b-12d3-a456-426614174000';
const name1 = 'Duey';
const uid2 = '123e4567-e89b-12d3-a456-426614174001';
const name2 = 'Huey';
const uid3 = '123e4567-e89b-12d3-a456-426614174002';
const name3 = 'Luey';

describe('testFindAll', () => {
  test('does find three ducks', async () => {
    const ducks = [
      {uid: uid1, name: name1},
      {uid: uid2, name: name2},
      {uid: uid3, name: name3},
    ];
    pool.query.mockResolvedValueOnce({rows: ducks});

    const result = await duckRepository.findAll();

    expect(result.length).toBe(3);
    expect(result).toEqual(ducks);
    expect(pool.query).toBeCalledWith('SELECT * FROM duck');
  });

  test('throws error due to database failure', async () => {
    const error = new Error('Database error');
    pool.query.mockRejectedValueOnce(error);

    await expect(duckRepository.findAll()).rejects.toThrow(
        JSON.stringify({
          status: 500,
          message: `Failed to fetch entities; Error: Database error`
        })
    );

    expect(pool.query).toBeCalledWith('SELECT * FROM duck');
  });
});

describe('testFindByUid', () => {
  test('does find duck by uid', async () => {
    const duck = {uid: uid1, name: name1};
    const row = duck
    pool.query.mockResolvedValueOnce({rows: [row]});

    const result = await duckRepository.findByUid(uid1);

    expect(pool.query).toBeCalledWith('SELECT * FROM duck WHERE uid = $1', [uid1]);
    expect(result).toEqual(duck);
  });

  test('throws error due to database failure', async () => {
    const error = new Error('Database error');
    pool.query.mockRejectedValueOnce(error);

    await expect(duckRepository.findByUid(uid1)).rejects.toThrow(
        JSON.stringify({
          status: 500,
          message: `Failed to fetch entity ${uid1}; Error: Database error`
        })
    );

    expect(pool.query).toBeCalledWith('SELECT * FROM duck WHERE uid = $1', [uid1]);
  });
});

describe('testCreate', () => {
  test('does create duck', async () => {
    const duck = {name: name1};
    const row = {uid: uid1, name: name1};
    pool.query.mockResolvedValueOnce({rows: [row]});

    const result = await duckRepository.create(duck);

    expect(pool.query).toBeCalledWith('INSERT INTO duck (name) VALUES ($1) RETURNING *', [name1]);
    expect(result).toEqual(row);
  });

  test('throws error due to database failure', async () => {
    const error = new Error('Database error');
    pool.query.mockRejectedValueOnce(error);

    const duck = {name: name1};

    await expect(duckRepository.create(duck)).rejects.toThrow(
        JSON.stringify({
          status: 500,
          message: `Failed to create entity; Error: Database error`
        })
    );

    expect(pool.query).toBeCalledWith('INSERT INTO duck (name) VALUES ($1) RETURNING *', [name1]);
  });
});

describe('testUpdate', () => {
  test('does update duck', async () => {
    const duck = {name: name1};
    const row = {uid: uid1, name: name1};
    pool.query.mockResolvedValueOnce({rows: [row]});

    const result = await duckRepository.update(uid1, duck);

    expect(pool.query).toBeCalledWith('UPDATE duck SET name= $1 WHERE uid = $2 RETURNING *', [name1, uid1]);
    expect(result).toEqual(row);
  });

  test('throws error due to database failure', async () => {
    const error = new Error('Database error');
    pool.query.mockRejectedValueOnce(error);

    const duck = {name: name1};

    await expect(duckRepository.update(uid1, duck)).rejects.toThrow(
        JSON.stringify({
          status: 500,
          message: `Failed to update entity ${uid1}; Error: Database error`
        })
    );

    expect(pool.query).toBeCalledWith('UPDATE duck SET name= $1 WHERE uid = $2 RETURNING *', [name1, uid1]);
  });
});

describe('testDeleteByUid', () => {
  test('does delete duck by uid', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const result = await duckRepository.deleteByUid(uid1);

    expect(pool.query).toBeCalledWith('DELETE FROM duck WHERE uid=$1', [uid1]);
    expect(result).toBeUndefined();
  });

  test('throws error due to database failure', async () => {
    const error = new Error('Database error');
    pool.query.mockRejectedValueOnce(error);

    await expect(duckRepository.deleteByUid(uid1)).rejects.toThrow(
        JSON.stringify({
          status: 500,
          message: `Failed to delete entity ${uid1}; Error: Database error`
        })
    );

    expect(pool.query).toBeCalledWith('DELETE FROM duck WHERE uid=$1', [uid1]);
  });
});
