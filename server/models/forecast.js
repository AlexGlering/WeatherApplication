//Model for the Forecast table in the database

// Import the Sequelize library, DataTypes, and Model class
const { Sequelize, DataTypes, Model } = require("sequelize");

// Set up a new Sequelize instance for connecting to the database
const sequelize = new Sequelize("weather_app", "root", "", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
});

// Define the Forecast model class, extending the Sequelize Model class
class Forecast extends Model {}

// Initialize the Forecast model with its attributes and options
Forecast.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    avgtemp_c: DataTypes.FLOAT,
    totalprecip_mm: DataTypes.FLOAT,
    maxwind_kph: DataTypes.FLOAT,
    avghumidity: DataTypes.FLOAT,
  },
  {
    sequelize,
    modelName: "Forecast",
    tableName: "forecasts",
    indexes: [
      {
        unique: true,
        fields: ["city", "date"],
      },
    ],
    timestamps: false,
  }
);

// Synchronize the model with the database, creating the table if it doesn't exist
sequelize
  .sync()
  .then(() => {
    console.log("Forecasts table has been successfully created.");
  })
  .catch((error) => {
    console.error("Unable to create the forecasts table:", error);
  });

// Export the Forecast model for use in other modules
module.exports = Forecast;
