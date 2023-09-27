const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

// Create Transactions table in DB
const Ledger = sequelize.define("Ledger", {
  payer: {
    type: DataTypes.STRING,
  },
  points: {
    type: DataTypes.INTEGER,
  },
  timestamp: {
    type: DataTypes.DATE,
  },
});

sequelize
  .sync({ force: true })
  .then(() => console.log("Tables have been synchronized"))
  .catch((error) => console.error("Unable to synchronize the tables:", error));

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));

module.exports = {
  sequelize,
  Ledger,
};
