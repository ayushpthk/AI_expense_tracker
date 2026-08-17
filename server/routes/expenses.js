import express from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create an expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      amount,
      category,
      date,
      notes,
      splits
    } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({
        message: "Title, amount and category are required"
      });
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: Number(amount),
        category,
        date: date ? new Date(date) : new Date(),
        notes: notes || null,
        userId: req.user.userId,

        splits: splits?.length
          ? {
            create: splits.map((split) => ({
              personName: split.personName,
              amount: Number(split.amount),
            })),
          }
          : undefined,
      },
      include: {
        splits: true,
      },
    });

    res.status(201).json({
      message: "Expense created successfully",
      expense
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create expense"
    });
  }
});

// Get all expenses for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        splits: true,
      },
    });

    res.json({
      expenses,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch expenses",
    });
  }
});
// Update an expense
// Update an expense
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid expense ID",
      });
    }

    const {
      title,
      amount,
      category,
      date,
      notes,
      splits,
    } = req.body;

    // Check that the expense belongs to the logged-in user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: id,
        userId: req.user.userId,
      },
      include: {
        splits: true,
      },
    });

    if (!existingExpense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    // Update the main expense
    const updatedExpense = await prisma.expense.update({
      where: {
        id: id,
      },
      data: {
        title,
        amount: Number(amount),
        category,
        date: date
          ? new Date(date)
          : existingExpense.date,
        notes: notes || null,
      },
    });

    // Update splits if they were sent by the frontend
    if (Array.isArray(splits)) {

      // Delete the old splits
      await prisma.expenseSplit.deleteMany({
        where: {
          expenseId: id,
        },
      });

      // Create the new splits
      if (splits.length > 0) {
        await prisma.expenseSplit.createMany({
          data: splits.map((split) => ({
            expenseId: id,
            personName: split.personName,
            amount: Number(split.amount),
            isPaid: Boolean(split.isPaid),
          })),
        });
      }
    }

    // Get the updated expense including splits
    const finalExpense = await prisma.expense.findUnique({
      where: {
        id: id,
      },
      include: {
        splits: true,
      },
    });

    res.json({
      message: "Expense updated successfully",
      expense: finalExpense,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update expense",
    });
  }
});
// Delete all expenses for the logged-in user
router.delete("/", authMiddleware, async (req, res) => {
  try {
    const result = await prisma.expense.deleteMany({
      where: {
        userId: req.user.userId,
      },
    });

    res.json({
      message: "All expenses deleted successfully",
      deletedCount: result.count,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete expenses",
    });
  }
});
// Delete an expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid expense ID",
      });
    }

    // Check that the expense belongs to the logged-in user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: id,
        userId: req.user.userId,
      },
    });

    if (!existingExpense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    await prisma.expense.delete({
      where: {
        id: id,
      },
    });

    res.json({
      message: "Expense deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete expense",
    });
  }
});
// Toggle an expense split payment status
router.put("/split/:splitId/toggle-paid", authMiddleware, async (req, res) => {
  try {
    const splitId = Number(req.params.splitId);

    if (!Number.isInteger(splitId)) {
      return res.status(400).json({
        message: "Invalid split ID",
      });
    }

    const split = await prisma.expenseSplit.findFirst({
      where: {
        id: splitId,
        expense: {
          userId: req.user.userId,
        },
      },
    });

    if (!split) {
      return res.status(404).json({
        message: "Expense split not found",
      });
    }

    const updatedSplit = await prisma.expenseSplit.update({
      where: {
        id: splitId,
      },
      data: {
        isPaid: !split.isPaid,
      },
    });

    res.json({
      message: updatedSplit.isPaid
        ? "Payment marked as paid"
        : "Payment marked as unpaid",
      split: updatedSplit,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update payment status",
    });
  }
});
export default router;