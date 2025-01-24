const pool = require('../db');

const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM task');
    res.status(200).json({ tasks: result.rows });
  } catch (err) {
    console.error('Database query failed', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};
const getTask = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM task WHERE id = $1', [id]);
    console.log(result);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Database query failed', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { name, completed } = req.body;
  try {
    const result = await pool.query(
      'UPDATE task SET name = $1, completed =$2 WHERE id = $3 RETURNING *',
      [name, completed, id]
    );
    console.log(result);
    res.status(201).json(result.rows);
  } catch (err) {
    console.error('Database query failed', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM task WHERE id = $1 RETURNING *',
      [id]
    );
    console.log(result);
    res.status(204).json(result.rows);
  } catch (err) {
    console.error('Database query failed', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};
const addTask = async (req, res) => {
  const { name, completed = false } = req.body; // Default false
  try {
    const result = await pool.query(
      'INSERT INTO task (name, completed) VALUES ($1, $2) RETURNING *',
      [name, completed]
    );
    res.status(201).json(result.rows[0]); // Return single task object
  } catch (err) {
    console.error('Database query failed', err);
    res.status(500).json({ error: 'Failed to add task' });
  }
};

module.exports = { getAllTasks, addTask, getTask, updateTask, deleteTask };
