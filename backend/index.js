// index.js
process.env.SUPPRESS_NO_CONFIG_WARNING = true;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Middleware

app.use(
  cors({
    origin: "https://e-tea-nepal-frontend.vercel.app/", // Specific frontend domain
    credentials: true, // Allow cookies/auth headers
  })
);

app.use(express.json());

// MongoDB connection
var db =
  "mongodb+srv://ashish:jpayotei@cluster0.qqvtkdk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Ensure the public directory exists
const publicPath = path.join(__dirname, "public");
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
  console.log("Created public directory for static files");
}

// Serve static files
app.use("/public", express.static(publicPath));

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", require("./routes/stripe"));

app.use("/api/auth", require("./routes/auth"));

app.use("/api/seller", require("./routes/seller"));

app.use("/api/admin", require("./routes/admin"));

app.use("/api/products", require("./routes/products"));

app.use("/api/orders", require("./routes/orders"));

app.use("/api/notifications", require("./routes/notifications"));

app.use("/api/algorithms", require("./routes/algorithms"));

app.use("/api/cart", require("./routes/cart"));

app.use("/api/user", require("./routes/user"));

app.use("/api/", require("./routes/subscriptions"));

app.use("/api/payment", require("./routes/payment"));

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
