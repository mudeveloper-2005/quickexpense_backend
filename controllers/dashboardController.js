import mongoose from "mongoose";
import incomeModel from "../models/incomeModel.js";
import expenseModel from "../models/expenseModel.js";

// Get dashboard
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(String(userId));

    // Total income
    const totalIncome = await incomeModel.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Total expense
    const totalExpense = await expenseModel.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Fetch last 5 transaction (income + expense)
    const lastTransaction = [
      ...(await incomeModel.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "income",
        }),
      ),
      ...(await expenseModel.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "expense",
        }),
      ),
    ].sort((a, b) => b.date - a.date);
    res.status(200).json({
      data: {
        totalBalance:
          (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
        totalIncome: totalIncome[0]?.total || 0,
        totalExpense: totalExpense[0]?.total || 0,
        recentTransaction: lastTransaction,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
