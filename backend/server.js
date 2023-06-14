const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

const port = process.env.PORT || 5000;

connectDB();
const app = express();

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('join-room', (userId) => {
    socket.join(userId);
  });

  // Send message to users (who are present in members array)
  socket.on('send-message', (message) => {
    io.to(message.members[0])
      .to(message.members[1])
      .emit('recieve-message', message);
  });
});

//Cookie parser middleware
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

app.use(notFound);
app.use(errorHandler);

server.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
