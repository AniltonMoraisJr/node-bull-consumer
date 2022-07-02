export default {
  redis: {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: Number(process.env.REDIS_PORT),
  },
  mail: {
    config: {
      host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.MAIL_PORT) || 2525,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    },
    default: {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
    },
  },
  mysql: {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: 'elections',
    logging: false,
    synchronize: true,
    entities: ['src/database/entities/**{.ts,.js}'],
    migrations: ['src/database/migrations/**{.ts,.js}'],
    cli: {
      entitiesDir: 'src/database/entities',
      migrationsDir: 'src/database/migrations',
    },
  },
};
