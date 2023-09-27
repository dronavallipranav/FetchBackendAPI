const express = require("express");
const { sequelize, Ledger } = require("./storage/database");
const app = express();
const port = 8000;

app.use(express.json());

/*
  POST /add
  { payer: <string>, points: <integer>, timestamp: <string> }

  Response:
    200 OK
    400 Bad Request
    500 Internal Server Error

  Description:
    Creates a user record in the database for the given payer, points, and timestamp.
*/
app.post("/add", async (req, res) => {
  const payer = req.body.payer;
  const points = req.body.points;
  const timestamp = req.body.timestamp;

  if (points < 0) return res.status(400).send("Can't add negative points");
  // Checks format of request
  if (!timestamp || !points || !payer)
    return res.status(400).send("Request not formatted correctly");

  try {
    // Add transaction to table
    await Ledger.create({ payer, points, timestamp });
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

/*
  POST /spend
  { points: <integer> }

  Response:
    200 OK
    400 Bad Request
    500 Internal Server Error

  Description:
    Spends the given points from the user's balance. Points are spent in the order they were received.
*/
app.post("/spend", async (req, res) => {
  let spent = req.body.points;
  if (spent <= 0)
    return res.status(400).send("Can't spend zero or negative points");
  try {
    // Get all user transactions sorted by timestamp
    const records = await Ledger.findAll({
      order: [["timestamp", "ASC"]],
    });

    // Calculate totalPoints before continuing to prevent modifying database
    const pointsArray = records.map((record) => record.points);
    let totalPoints = 0;
    pointsArray.forEach((x) => {
      totalPoints += x;
    });
    // Check if user has enough points to spend
    if (spent > totalPoints)
      return res.status(400).send("User does not have enough points to spend");

    var result = {};
    // Iterate over each transaction in database
    for (const record of records) {
      if (result[record.payer] == undefined) result[record.payer] = 0; // Initialize payer to 0 if not in result

      if (spent > 0) {
        // If the user has enough points to spend, we remove the record from the database
        if (spent >= record.points) {
          result[record.payer] -= record.points;
          spent -= record.points;
          await record.destroy();
        } else {
          // Else we reduce the records point by spent and save the result in the database
          result[record.payer] -= spent;
          record.points -= spent;
          spent = 0;
          await record.save();
        }
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

/*
  GET /balance

  Response:
    200 OK
    500 Internal Server Error

  Description:
    Returns the user's balance of points per payer.
*/
app.get("/balance", async (req, res) => {
  try {
    const records = await Ledger.findAll({
      // Returns user points for each payer
      attributes: [
        "payer",
        [sequelize.fn("SUM", sequelize.col("points")), "points"],
      ],
      // Aggregation on payer
      group: ["payer"],
    });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
  });
}
module.exports = app;
