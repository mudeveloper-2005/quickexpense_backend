import xlsx from "xlsx";
import incomeModel from "../models/incomeModel.js";

// Add income
export const addIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const { icon, source, amount, date } = req.body;

    // Validate input
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create income
    const newIncome = incomeModel({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });
    await newIncome.save();
    res.status(201).json({ data: newIncome });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all income
export const getAllIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const income = await incomeModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({ data: income });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete income
export const deleteIncome = async (req, res) => {
  try {
    await incomeModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Income delete successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download income excel
export const downloadIncomeExcel = async (req, res) => {
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
    const income = await incomeModel.find(filter).sort({ date: -1 });

    // Prepare data in excel
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0],
    }));
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    res.status(200).json({ message: "Download successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
