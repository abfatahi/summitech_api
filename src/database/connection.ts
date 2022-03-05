import MongoClient from 'mongoose';
import 'dotenv/config';

export default () => {
  MongoClient.connect(`${process.env.DB_URL}`)
    .then(() => {
      console.log('🚀 Connected to Database 🚀');
    })
    .catch((error) => console.error(error));
};
