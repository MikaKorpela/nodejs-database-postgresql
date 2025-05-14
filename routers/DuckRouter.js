import express from 'express';
import duckService from '../services/DuckService';

const router = express.Router();

router.get('/', async (req, res) => {
  duckService.findAll()
  .then(result => res.json(result))
  .catch(err => {
    const error = getError(err)
    res.status(error.status).json(error.message);
  });
});

router.get('/:uid', async (req, res) => {
  duckService.findByUid(req)
  .then(result => res.json(result))
  .catch(err => {
    const error = getError(err)
    res.status(error.status).json(error.message);
  });
});

router.get('/:uid', async (req, res) => {
  try {
    const result = await duckService.findByUid(req);
    res.json(result);
  } catch (err) {
    const error = getError(err);
    res.status(error.status).json(error.message);
  }
});

router.post('/', (req, res) => {
  duckService.create(req, res)
  .then(result => res.status(201).json(result))
  .catch(err => {
    const error = getError(err)
    res.status(error.status).json(error.message);
  });
})

router.put('/:uid', (req, res) => {
  duckService.update(req, res)
  .then(result => res.json(result))
  .catch(err => {
    const error = getError(err)
    res.status(error.status).json(error.message);
  });
})

router.delete('/:uid', (req, res) => {
  duckService.deleteByUid(req, res)
  .then(result => res.status(204).json(result))
  .catch(err => {
    const error = getError(err)
    res.status(error.status).json(error.message);
  });
})

function getError(err) {
  try {
    if (err?.message) {
      return JSON.parse(err.message);
    }
  } catch (parseError) {
    console.error('Failed to parse error message:', parseError);
    throw new Error(
        JSON.stringify({status: 500, message: 'Error parsing error message'}));
  }

  return {status: 500, message: 'Internal server error'};
}

module.exports = {
  router,
  getError
};
