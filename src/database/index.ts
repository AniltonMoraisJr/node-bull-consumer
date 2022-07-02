import 'reflect-metadata';
import { DataSource } from 'typeorm';
import configs from '../configs';

const AppDataSource = new DataSource({
  ...(configs.mysql as any),
});

AppDataSource.initialize()
  .then(() => {
    console.log('MySQL connected');
  })
  .catch((error) => {
    console.error('MySQL not connected: Error: ' + error.message);
  });

export default AppDataSource;
