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
  username: process.env.DB__USER || 'postgres',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB__DATABASE || 'postgres',
  host: process.env.DB__HOST || 'localhost',
  port: process.env.DB__PORT || 5432,
  dialect: 'postgres',
}

export {
  app,
  db
}
