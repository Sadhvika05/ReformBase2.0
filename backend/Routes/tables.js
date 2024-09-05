// routes/tables.js

const express = require('express');
const router = express.Router();
const Table = require('../models/Tables');

// Create a new table
router.post('/', async (req, res) => {
  const { name, data } = req.body;

  try {
    const newTable = new Table({ name, data });
    const savedTable = await newTable.save();
    res.json(savedTable);
  } catch (error) {
    res.status(500).json({ message: 'Error saving table', error });
  }
});

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tables', error });
  }
});

// Update a table
router.put('/:id', async (req, res) => {
  const { name, data } = req.body;

  try {
    const updatedTable = await Table.findByIdAndUpdate(
      req.params.id,
      { name, data },
      { new: true }
    );
    res.json(updatedTable);
  } catch (error) {
    res.status(500).json({ message: 'Error updating table', error });
  }
});

// Delete a table
router.delete('/:id', async (req, res) => {
  try {
    const result = await Table.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting table', error });
  }
});


module.exports = router;
