import xlsx from "xlsx";
import expenseModel from "../models/expenseModel.js";

// Add expense
export const addExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { icon, source, amount, date } = req.body;

    // Validate input
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create expense
    const newExpense = new expenseModel({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });
    await newExpense.save();
    res.status(201).json({ data: newExpense });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all expense
export const getallExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expense = await expenseModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({ data: expense });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    await expenseModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense delete successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download expense excel
export const downloadExpenseExcel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { from, to } = req.query;
    const filter = { userId };

    if (from && to) {
      filter.date = {
        $gte: new Date(from),
        $lt: new Date(to),
      };
    }
    const expense = await expenseModel.find(filter).sort({ date: -1 });

    // Prepare data in excel
    const data = expense.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0],
    }));
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    res.status(200).json({ message: "Download successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
