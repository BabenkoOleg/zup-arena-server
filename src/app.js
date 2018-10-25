import bluebird from 'bluebird';
import express from 'express';
import mongoose from 'mongoose';
import logger from './util/logger';
import { MONGODB_URI } from './util/secrets';

mongoose.Promise = bluebird;
mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => logger.info('MongoDB connection established'))
  .catch(error => logger.error(`MongoDB connection error: ${error}`));

const app = express();

app.set('port', 3000);

app.get('/', (req, res) => {
  res.send('Hello World!!');
});

export default app;
