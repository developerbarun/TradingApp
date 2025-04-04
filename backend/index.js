require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("./model/UserModel");

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";


const { HoldingsModel } = require("./model/HoldingsModel");

const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req,res) => {
  res.send("Hello");
})

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.get("/orders", async (req, res) => {
  const orders = await OrdersModel.find({});
  res.json(orders);
});


app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    // Save order to Orders collection
    await new OrdersModel({ name, qty, price, mode }).save();

    if (mode === "BUY") {
      let holding = await HoldingsModel.findOne({ name });

      if (holding) {
        // Update existing holding
        const totalQty = holding.qty + qty;
        const totalInvestment = holding.avg * holding.qty + price * qty;

        holding.qty = totalQty;
        holding.avg = totalInvestment / totalQty;
        holding.price = price; // optional: update to last buy price
        await holding.save();
      } else {
        // Create new holding
        const newHolding = await new HoldingsModel({
          name,
          qty,
          avg: price,
          price,
          net: "+0.00%",
          day: "+0.00%",
        });

        await newHolding.save();
      }
    }

    res.send("Buy order processed and holdings updated.");
  } catch (err) {
    console.error("Error in /newOrder:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/newSellOrder", async (req, res) => {
  const { name, qty, price, mode } = req.body;

  const holding = await HoldingsModel.findOne({ name });

  if (!holding || holding.qty < qty) {
    return res.status(400).json({ error: "Not enough holdings to sell." });
  }

  await new OrdersModel({ name, qty, price, mode }).save();

  if (holding.qty === qty) {
    await HoldingsModel.deleteOne({ name });
  } else {
    holding.qty -= qty;
    await holding.save();
  }

  res.send("Sell order placed and holdings updated.");
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, user: { name, email } });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Something went wrong." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
});


async function apps(){
  app.listen(PORT,() => {
    console.log("App started!");
  })

  try {
    await mongoose.connect(uri);
    console.log("DB connected!");
  } catch (err) {
    console.error("DB connection error:", err.message);
  }
}

apps();