import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addExpense,
  deleteExpense,
  downloadExpenseExcel,
  getallExpense,
} from "../controllers/expenseController.js";

const expenseRoute = express.Router();

expenseRoute.post("/add", protect, addExpense);
expenseRoute.get("/get", protect, getallExpense);
expenseRoute.delete("/:id", protect, deleteExpense);
expenseRoute.get("/downloadexcel", protect, downloadExpenseExcel);

export default expenseRoute;
