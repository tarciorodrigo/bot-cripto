const axios = require("axios");
const db = require("./db");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 104874;
const SELL_PRICE = 105096;
const API_URL = "https://testnet.binance.vision";

let isOpened = false;
let operationName = "";
let balance = 0.00001;

async function start() {
  const { data } = await axios.get(
    `${API_URL}/api/v3/klines?limit=21&interval=15m&symbol=${SYMBOL}`
  );
  const candle = data[data.length - 1];
  const price = parseFloat(candle[4]); // Close price of the last candle

  console.clear();
  console.log(`Price: ${price}`);

  if (price <= BUY_PRICE && !isOpened) {
    isOpened = true;
    console.log(`Buy at ${price}`);

    operationName = "BUY";
    value = price;
    //operationDate = new Date().toISOString();

    var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    operationDate = localISOTime = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, -1);

    const operation = { operationName, value, operationDate };
    db.insert(operation)
      .then(() => console.log("Operation saved to database"))
      .catch((err) => console.error("Error saving operation:", err));
  } else if (price >= SELL_PRICE && isOpened) {
    isOpened = false;
    console.log(`Sell at ${price}`);

    operationName = "SELL";
    value = price;
    //operationDate = new Date().toISOString();
    var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    operationDate = localISOTime = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, -1);

    const operation = { operationName, value, operationDate };
    db.insert(operation)
      .then(() => console.log("Operation saved to database"))
      .catch((err) => console.error("Error saving operation:", err));
  } else {
    console.log(`Hold...${isOpened}`);
  }
  console.log(`------------------------`);
}

setInterval(start, 3000);

start();
