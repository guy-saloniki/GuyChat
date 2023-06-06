const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');

const port = process.env.PORT || 5000;

connectDB();
const app = express();

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie parser middleware
app.use(cookieParser());

app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
