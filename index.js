const express = require("express");
const app = express();
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();
app.use(express.json({ extended: false }));
// Routers
app.use("/api/users", require("./routes/userAPI"));
app.use("/api/products", require("./routes/productAPI"));

// Endpoints
app.get("/", (req, res) => {
  res.send("Hello Node Developer");
});

app.listen(PORT, () => {
  console.log(`Server is listing on port ${PORT}`);
});
