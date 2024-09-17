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
