import express from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get monthly budget
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        monthlyBudget: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      monthlyBudget: user.monthlyBudget,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch budget",
    });
  }
});


// Update monthly budget
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { monthlyBudget } = req.body;

    const budget = Number(monthlyBudget);

    if (!Number.isFinite(budget) || budget < 0) {
      return res.status(400).json({
        message: "Please enter a valid budget",
      });
    }

    const user = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        monthlyBudget: budget,
      },
      select: {
        monthlyBudget: true,
      },
    });

    res.json({
      message: "Budget updated successfully",
      monthlyBudget: user.monthlyBudget,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update budget",
    });
  }
});

export default router;