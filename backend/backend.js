import { PrismaClient } from '@prisma/client';
import express from 'express';

const app = express();
const port = 3000;

const prisma = new PrismaClient()

app.get('/', (req, res) => {
   res.send('Hello World, from express');
});

app.get('/api', (req, res) => {
   //retrive all data from message table
   prisma.message.findMany().then((result) => {
      //send only the "text" field
      res.send(result.map((message) => message.text));
   });
});

app.listen(port, function () {
   console.log("Server listening on port " + port)
 })
