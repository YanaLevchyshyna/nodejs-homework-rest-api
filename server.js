import app from './app.js';
import { mongoose } from 'mongoose';

// const DB_HOST =
//   'mongodb+srv://yana_levchyshyna:dRs7ROJfFwiOm6HS@cluster0.oi0mjfd.mongodb.net/db-contacts?retryWrites=true&w=majority';

// console.log(process.env);

// PASSWORD: dRs7ROJfFwiOm6HS

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Database connection successful. Use our API on port: ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1); //  закриває усі запущені процеси
  });
