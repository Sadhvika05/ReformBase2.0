const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { router: authRoutes } = require('./routes/auth');
const dataRoutes = require('./routes/data');
const Table = require('./models/Tables')


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/data', dataRoutes); // Existing data routes



// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

  app.post('/api/tables', async (req, res) => {
    const { name, data } = req.body;
    try {
      const newTable = new Table({ name, data });
      const savedTable = await newTable.save();
      res.status(201).json(savedTable);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save table' });
    }
  });
  
  app.get('/api/tables', async (req, res) => {
    try {
      const tables = await Table.find();
      res.json(tables);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tables' });
    }
  });
  
  app.put('/api/tables/:id', async (req, res) => {
    const { id } = req.params;
    const { name, data } = req.body;
    try {
      const updatedTable = await Table.findByIdAndUpdate(id, { name, data }, { new: true });
      res.json(updatedTable);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update table' });
    }
  });
  
  app.delete('/api/tables/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await Table.findByIdAndDelete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete table' });
    }
  });
  

  