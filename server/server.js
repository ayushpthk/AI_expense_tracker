import express from "express";
import cors from "cors";
import "dotenv/config";
import expenseRoutes from "./routes/expenses.js";

import prisma from "./lib/prisma.js";
import authRoutes from "./routes/auth.js";
import budgetRoutes from "./routes/budget.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budget", budgetRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "SmartSpend AI Backend is running!"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const users = await prisma.user.findMany();

        res.json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});