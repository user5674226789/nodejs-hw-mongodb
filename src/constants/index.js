 // src/constants/index.js 

 import express from 'express';
 import cors from 'cors';

 const PORT = 3000;

 const app = express();

 // Middleware для логування часу заптиу
 app.use((req, res, next) => {
     console.log(`Time: ${new Date().toLocaleString()}`);
     next();
 });

 // Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
 // наприклад, у запитах POST або PATCH
 app.use(express.json());

 // Маршрут для обробки GET-запитів на '/'
 app.get('/', (req, res) => {
     res.json({
         message: 'Hello world!',
     });
 });

 // Middleware для обробки помилок (приймає 4 аргументи)
 app.use((err, req, res, next) => {
     res.status(500).json({
         message: 'Something went wrong',
     });
 });

 app.listen(PORT, () => {
     console.log(`Server is running on ${PORT}`);
 });

 app.use('*', (req, res, next) => {
     res.status(404).json({
         message: 'Route not found',
     });
 });

 app.use(cors());
