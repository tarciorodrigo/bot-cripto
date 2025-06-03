const axios = require("axios");
const db = require("./db");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 104874;
const SELL_PRICE = 105096;
const API_URL = "https://testnet.binance.vision";
const API_URL_PROD = "https://api.binance.vision";

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

  if (price <= sma * 0.9 && !isOpened) {
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
  } else if (price >= sma * 1.1 && isOpened) {
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
    console.log("Hold...");
  }
  console.log(`------------------------------`);
}

setInterval(startSMA, 3000);

startSMA();
