import express from "express";
import cors from "cors";

import { PORT } from "./config/appConfig.js";

import tipsRoutes from "./routes/tips.js";
import modelsRoutes from "./routes/models.js";
import inventoryRoutes from "./routes/inventory.js";
import transactionRoutes from "./routes/transactions.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Temple Tip Inventory Backend Running",
  });
});

app.use("/api/tips", tipsRoutes);
app.use("/api/models", modelsRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);


// --------LOCAL HOST -----------
// app.listen(PORT, () => {
//   console.log(`Server Running: http://localhost:${PORT}`);
// });

// --------SERVER----------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running on Port ${PORT}`);
});