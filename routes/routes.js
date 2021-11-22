addTransaction = require("../functions/transactions");
spendPoints = require("../functions/spend");
getBalances = require("../functions/balances");

const url = require("url");
const path = require("path");
const absolutePath = path.resolve("./public/index.html");
var express = require("express");
var router = express.Router();

const transactions = []; // initialize transaction list

router.get("/", function (req, res) {
  res.sendFile(absolutePath);
});

//transaction route
router.post("/transaction", (req, res) => {
  const { payer, points, timestamp } = req.body;
  //if the sent json doesn't have the name of the fields correctly send an error message
  if (!payer || !points || !timestamp) {
    res.json({
      errorMessage:
        "ERROR: Please enter payer, points, and timestamp as parameters",
    });
  } else if (
    typeof payer != "string" ||
    typeof points != "number" ||
    typeof timestamp != "string"
  ) {
    res.json({
      errorMessage:
        "ERROR: Please make sure the type of each field is correct. ",
      expectedTypes:
        "'payer' : 'STRING', 'points': NUMBER, 'timestamp': 'YYYY-MM-DDTHH:MM:SSZ'",
    });
  } else {
    const transactionAdded = {
      payer,
      points: parseInt(points),
      timestamp,
    };
    addTransaction(transactionAdded, transactions);
    res.json({ message: "Added transaction successfully!", transactionAdded });
  }
});
//spend route
router.post("/spend", (req, res) => {
  const { points } = req.body;
  if (!points || typeof points != "number") {
    res.json({
      errorMessage:
        "ERROR: Please use {'points': INTEGER } as the format to send data",
    });
  } else if (points < 0) {
    res.json({
      errorMessage:
        "ERROR: Cannot spend negative points. Please provide an integer greater than 0",
    });
  } else {
    let pointsSpentList = spendPoints(points, transactions);
    if (typeof pointsSpentList === "string") {
      res.json({
        errorMessage: pointsSpentList,
      });
    } else {
      res.json({ pointsSpentList });
    }
  }
});
//balance route
router.get("/balances", (req, res) => {
  let balance = getBalances(transactions);

  if (typeof balance === "string") {
    res.json({
      errorMessage: balance,
    });
  } else {
    res.json(balance);
  }
});

module.exports = router;
