const crypto = require("crypto");
const axios = require("axios");
const db = require("./db");
const { URLSearchParams } = require("url");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 105100;
const SELL_PRICE = 105150;
const QUANTITY = "0.001";

const API_URL = "https://testnet.binance.vision";
const API_URL_PROD = "https://api.binance.vision";

const API_KEY = process.env.API_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
//const API_KEY = "l2eAjEsMG8F7i90AjZWAHu4R4brmcwMxRLPc9BnNtWnMp16PDrBNDzacyKes5m0o";
//const SECRET_KEY = "PYYHzy5uHcB4ML9HN6bR6Acnarnm6XTw8WRY6inOwtdci2j1hYZJ1utbIq2pPbDy";

let isOpened = false;
let operationName = "";
let balance = 0.00001;

function calcSMA(data) {
  const closes = data.map((candle) => parseFloat(candle[4])); // Close prices
  const sum = closes.reduce((acc, price) => acc + price, 0);
  return sum / closes.length;
}

function calcEMA(data, period = 20) {
  const closes = data.map((candle) => parseFloat(candle[4])); // Close prices
  const k = 2 / (period + 1);
  let ema = closes[0]; // Start with the first close price

  for (let i = 1; i < closes.length; i++) {
    ema = closes[i] * k + ema * (1 - k);
  }
  return ema;
}

let value = 0;

async function start() {
  const { data } = await axios.get(
    `${API_URL}/api/v3/klines?limit=21&interval=15m&symbol=${SYMBOL}`
  );
  const candle = data[data.length - 1];
  const price = parseFloat(candle[4]); // Close price of the last candle

  console.clear();
  console.log(`Price: ${price}`);
  console.log(`Is Opened: ${isOpened}`);

  if (price <= BUY_PRICE && !isOpened) {
    isOpened = true;
    newOrder(SYMBOL, QUANTITY, "buy");
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
    newOrder(SYMBOL, QUANTITY, "sell");
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
    console.log("Hold...");
  }
  console.log(`------------------------`);
}

async function startSMA() {
  const { data } = await axios.get(
    `${API_URL}/api/v3/klines?limit=21&interval=15m&symbol=${SYMBOL}`
  );
  const candle = data[data.length - 1];
  const price = parseFloat(candle[4]); // Close price of the last candle

  console.clear();
  console.log(`Price: ${price}`);

  const sma21 = calcSMA(data);
  const sma13 = calcSMA(data.slice(8));
  console.log(`SMA (13): ${sma13}`);
  console.log(`SMA (21): ${sma21}`);
  console.log(`Is Opened: ${isOpened}`);

  if (sma13 > sma21 && !isOpened) {
    isOpened = true;
    newOrder(SYMBOL, QUANTITY, "buy");
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
  } else if (sma13 < sma21 && isOpened) {
    isOpened = false;
    newOrder(SYMBOL, QUANTITY, "sell");
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
    console.log("Hold...");
  }
  console.log(`------------------------`);
}

async function startSMA2() {
  const { data } = await axios.get(
    `${API_URL}/api/v3/klines?limit=21&interval=15m&symbol=${SYMBOL}`
  );
  const candle = data[data.length - 1];
  const price = parseFloat(candle[4]); // Close price of the last candle

  console.clear();
  console.log(`Price: ${price}`);

  const sma = calcSMA(data);
  console.log(`SMA (21): ${sma}`);
  console.log(`Is Opened: ${isOpened}`);

  if (price <= sma * 0.9 && isOpened === false) {
    isOpened = true;
    newOrder(SYMBOL, QUANTITY, "buy");
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
  } else if (price >= sma * 1.1 && isOpened === true) {
    isOpened = false;
    newOrder(SYMBOL, QUANTITY, "sell");
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
    console.log("Hold...");
  }
  console.log(`------------------------------`);
}

async function newOrder(symbol, quantity, side) {
  const order = { symbol, quantity, side };
  order.type = "MARKET";
  order.timestamp = Date.now();

  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(new URLSearchParams(order).toString())
    .digest("hex");

  order.signature = signature;

  try {
    const { data } = await axios.post(
      `${API_URL}/api/v3/order`,
      new URLSearchParams(order).toString(),
      {
        headers: {
          "X-MBX-APIKEY": API_KEY,
        },
      }
    );
    console.log("Order response:", data);
  } catch (err) {
    console.error(
      "Error placing order:",
      err.response ? err.response.data : err.message
    );
  }
}

setInterval(start, 3000);

start();
