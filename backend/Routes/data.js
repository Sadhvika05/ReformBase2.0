const express = require('express');
const router = express.Router();
const Data = require('../models/Data');
const { protect, admin, moderator } = require('./auth');

// Fetch all groups
router.get('/', protect, async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new group
router.post('/', protect, admin, async (req, res) => {
  try {
    const newData = new Data({ name: req.body.name, tables: [] });
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch tables for a specific group
router.get('/:groupId/tables', protect, async (req, res) => {
  try {
    const group = await Data.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json({ tables: group.tables });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch data for a specific table in a group
router.get('/:groupId/tables/:tableId', protect, async (req, res) => {
  try {
    const group = await Data.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    const table = group.tables.id(req.params.tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json({ content: table.content });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update data for a specific table in a group
router.put('/:groupId/tables/:tableId', protect, moderator, async (req, res) => {
  try {
    const group = await Data.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    const table = group.tables.id(req.params.tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    table.content = req.body.content || table.content;
    table.name = req.body.name || table.name;
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a specific table from a group
router.delete('/:groupId/tables/:tableId', protect, moderator, async (req, res) => {
  try {
    const group = await Data.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    const table = group.tables.id(req.params.tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    table.remove();
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a table to a group
router.post('/:groupId/tables', protect, moderator, async (req, res) => {
  try {
    const group = await Data.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    group.tables.push({ name: req.body.name, content: [] });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update existing group
router.put('/:id', protect, moderator, async (req, res) => {
  try {
    const updatedData = await Data.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete group
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Data.findByIdAndDelete(req.params.id);
    res.json({ message: 'Data deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;