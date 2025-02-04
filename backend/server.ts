import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const server = express();
const port = 3000;

server.get('/', (req, res) => {
  res.send('Hello!');
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
export default server;  

