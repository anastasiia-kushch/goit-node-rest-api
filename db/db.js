import { Sequelize } from 'sequelize';
import process from 'process';

const sequelize = new Sequelize(
  'db_contacts_5hmz',
  'db_contacts_5hmz_user',
  'FgQTjFqJy9gqrOEPSJtwpKWbe70do0g6',
  {
    host: 'dpg-d6g42cc50q8c73854t3g-a.oregon-postgres.render.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connection successful');
  } catch (error) {
    console.log('Database connection error:', error.message);
    process.exit(1);
  }
}

export { sequelize, connectDB };
