import "dotenv/config";
import express from "express";
import dns from "dns";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import incomeRoute from "./routes/incomeRoute.js";
import expenseRoute from "./routes/expenseRoute.js";

// App config
const app = express();
const port = 4000;

// Change DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Middleware
app.use(express.json());
app.use(cors());

// DB connect
connectDB();

app.get("/", (req, res) => {
  res.send("API working");
});

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/income", incomeRoute);
app.use("/api/v1/expense", expenseRoute);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
