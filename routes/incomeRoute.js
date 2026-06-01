import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addIncome,
  deleteIncome,
  downloadIncomeExcel,
  getAllIncome,
} from "../controllers/incomeController.js";

const incomeRoute = express.Router();

incomeRoute.post("/add", protect, addIncome);
incomeRoute.get("/get", protect, getAllIncome);
incomeRoute.delete("/:id", protect, deleteIncome);
incomeRoute.get("/downloadexcel", protect, downloadIncomeExcel);

export default incomeRoute;
