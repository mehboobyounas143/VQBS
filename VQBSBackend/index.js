require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path'); // ✅ Added to serve static files
const connectDB = require('./connectDB');
const questionRoutes = require('./routes/questionRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const topicRoutes = require('./routes/topicRoutes');
const difficultyLevelRoutes = require('./routes/difficultyLevelRoutes');
const reportRoutes = require('./routes/reportRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const responseRoutes = require('./routes/responseRoutes');
const searchRoutes = require('./routes/search'); // ✅ Added search route

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ✅ Added to serve uploads folder

app.get('/', (req, res) => {
  res.json('Hello Welcome!');
});

app.use('/api', questionRoutes);
app.use('/api', subjectRoutes);
app.use('/api', topicRoutes);
app.use('/api', difficultyLevelRoutes);
app.use('/api', reportRoutes);
app.use('/api', studentRoutes);
app.use('/api', adminRoutes);
app.use('/api', responseRoutes);
app.use('/api/search', searchRoutes); // ✅ Search route added here

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
