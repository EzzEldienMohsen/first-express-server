const pool = require('../db');
const { createCustomError } = require('../errors/custom-error');
const asyncWrapper = require('../middleware/async');

const getAllTasks = asyncWrapper(async (req, res, next) => {
  const result = await pool.query('SELECT * FROM task');
  if (result.rowCount === 0) {
    return next(createCustomError(404, 'Not Found'));
  }
  res.status(200).json({ tasks: result.rows });
});
const getTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM task WHERE id = $1', [id]);
  if (result.rowCount === 0) {
    return next(createCustomError(404, 'Not Found'));
  }
  res.status(200).json({ task: result.rows });
});
const updateTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { name, completed } = req.body;

  const result = await pool.query(
    'UPDATE task SET name = $1, completed =$2 WHERE id = $3 RETURNING *',
    [name, completed, id]
  );
  if (result.rowCount === 0) {
    return next(createCustomError(404, 'Not Found'));
  }
  res.status(201).json({ task: result.rows });
});

const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM task WHERE id = $1 RETURNING *',
    [id]
  );
  if (result.rowCount === 0) {
    return next(createCustomError(404, 'Not Found'));
  }
  res.status(204).json({ task: result.rows });
});
const addTask = asyncWrapper(async (req, res, next) => {
  const { name, completed = false } = req.body; // Default false
  const result = await pool.query(
    'INSERT INTO task (name, completed) VALUES ($1, $2) RETURNING *',
    [name, completed]
  );
  if (result.rowCount === 0) {
    return next(createCustomError(404, 'Not Found'));
  }
  res.status(201).json({ task: result.rows[0] }); // Return single task object
});

module.exports = { getAllTasks, addTask, getTask, updateTask, deleteTask };
