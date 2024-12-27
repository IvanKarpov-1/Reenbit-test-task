import 'dotenv/config';
import { server } from './server.js';
import connectToMongoDb from './app/db/connectToMongoDb.js';

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  connectToMongoDb();
  console.log(`Server is running on ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
