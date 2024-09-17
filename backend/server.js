const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { router: authRoutes } = require('./routes/auth');
const dataRoutes = require('./routes/data');
const Data = require('./models/Data');


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

//saving a table 
app.post('/api/:groupname/tables', async (req, res) => {
  const { name, data } = req.body;
  const { groupname } = req.params;
  try {
      // Find the group by name
      const group = await Data.findOne({ name: groupname });
      if (!group) {
          return res.status(404).json({ error: 'Group not found' });
      }

      // Create new table
      const newTable = { name, data };
      
      // Add table to the group's tables array
      group.tables.push(newTable);
      await group.save();

      res.status(201).json(newTable);
  } catch (error) {
      res.status(500).json({ error: 'Failed to save table' });
  }
});

//fetching tables
app.get('/api/:groupname/tables', async (req, res) => {
  const { groupname } = req.params;
  try {
      // Find the group by name
      const group = await Data.findOne({ name: groupname });
      if (!group) {
          return res.status(404).json({ error: 'Group not found' });
      }

      // Return the tables associated with the group
      res.json(group.tables);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

//update tables
app.put('/api/:groupname/tables/:tableId', async (req, res) => {
  const { groupname, tableId } = req.params;
  const { name, data } = req.body;
  try {
      // Find the group by name
      const group = await Data.findOne({ name: groupname });
      if (!group) {
          return res.status(404).json({ error: 'Group not found' });
      }

      // Find the table by its ID and update it
      const table = group.tables.id(tableId);
      if (!table) {
          return res.status(404).json({ error: 'Table not found' });
      }

      table.name = name || table.name;
      table.data = data || table.data;
      await group.save();

      res.json(table);
  } catch (error) {
      res.status(500).json({ error: 'Failed to update table' });
  }
});

//delete table
app.delete('/api/:groupname/tables/:tableId', async (req, res) => {
  const { groupname, tableId } = req.params;
  try {
    const group = await Data.findOne({ name: groupname });
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Filter out the table with the matching tableId
    group.tables = group.tables.filter(table => table._id.toString() !== tableId);

    // Save the updated group
    await group.save();

    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete table' });
  }
});


//search table 
app.get('/api/:groupname/tables/search', async (req, res) => {
  const { groupname } = req.params;
  const { name } = req.query; // Query parameter for searching by table name

  try {
      // Find the group by name
      const group = await Data.findOne({ name: groupname });
      if (!group) {
          return res.status(404).json({ error: 'Group not found' });
      }

      // Filter tables based on the name query parameter
      const matchingTables = group.tables.filter(table => table.name.includes(name));
      
      // Return the matching tables
      res.json(matchingTables);
  } catch (error) {
      res.status(500).json({ error: 'Failed to search tables' });
  }
});


  
