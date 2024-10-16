const DatabaseUtils = require("./server/database/databaseUtils");
const utilsDB = new DatabaseUtils();

const create_database = async () => {
  try {
    const createTBLS = await utilsDB.connect();

    const connection = await utilsDB.connectToDatabase({
      ...utilsDB.connectionConfig,
      database: process.env.DB_NAME,
    });

    if (createTBLS) await utilsDB.createTables(connection);
  } catch (err) {
    console.error(err);
  }
};

create_database();
