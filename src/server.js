import errorHandler from 'errorhandler';
import app from './app';
import logger from './util/logger';

app.use(errorHandler());

const server = app.listen(app.get('port'), () => {
  logger.debug(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`);
});

export default server;
