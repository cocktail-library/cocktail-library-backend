const app = {
  name: 'cocktail-library-backend',
  port: process.env.APP__PORT || 4000,
}

export interface DbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: string | number;
  dialect: string;
}

const db: DbConfig = {
  username: process.env.COCKTAILS__DB_USER || 'postgres',
  password: process.env.COCKTAILS__DB_PASSWORD || '12345',
  database: process.env.COCKTAILS__DB_DATABASE || 'postgres',
  host: process.env.COCKTAILS__DB__HOST || 'localhost',
  port: process.env.COCKTAILS__DB_PORT || 5432,
  dialect: 'postgres',
}

export {
  app,
  db
}
