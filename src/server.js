import app from './app';
import logger from './util/logger';

const server = app.listen(app.get('port'), () => {
  logger.debug(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`);
});

export default server;
