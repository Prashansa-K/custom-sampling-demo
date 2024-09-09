const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes');

const app = express();
app.use(express.json());

app.use('/api', bookRoutes);

mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Books service running on port ${PORT}`);
});
