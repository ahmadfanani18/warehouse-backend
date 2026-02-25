import 'dotenv/config';
import app from './app';
import { logger } from './infrastructure/logger';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    logger.info(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
  }
});
