const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize("weather_app", "root", "", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
});

class Forecast extends Model {}

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

sequelize
  .sync()
  .then(() => {
    console.log("Forecasts table has been successfully created.");
  })
  .catch((error) => {
    console.error("Unable to create the forecasts table:", error);
  });

module.exports = Forecast;
