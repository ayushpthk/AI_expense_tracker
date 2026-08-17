import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  Target,
  Utensils,
  Car,
  ShoppingCart,
  Receipt,
  Sparkles,
  Plus,
  ArrowRight,
  LogOut,
  HandCoins,
} from "lucide-react";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyBudget, setMonthlyBudget] = useState(15000);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [savingBudget, setSavingBudget] = useState(false);

  const totalSpending = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );
  const moneyOwed = expenses.flatMap((expense) =>
    (expense.splits || [])
      .filter((split) => !split.isPaid)
      .map((split) => ({
        ...split,
        expenseTitle: expense.title,
      }))
  );

  const totalMoneyOwed = moneyOwed.reduce(
    (total, split) =>
      total + Number(split.amount),
    0
  );

  const peopleOwing = new Set(
    moneyOwed.map((split) => split.personName.trim().toLowerCase())
  ).size;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthSpending = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);

      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );
  const remainingBudget =
    monthlyBudget - thisMonthSpending;


  const categoryTotals = expenses.reduce(
    (totals, expense) => {
      const category = expense.category;

      totals[category] =
        (totals[category] || 0) +
        Number(expense.amount);

      return totals;
    },
    {}
  );

  const categoryTotal = Object.values(categoryTotals).reduce(
    (total, amount) => total + amount,
    0
  );

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://ai-expense-tracker-s5m6.onrender.com/api/expenses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch expenses"
          );
        }

        setExpenses(data.expenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://ai-expense-tracker-s5m6.onrender.com/api/budget",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch budget"
          );
        }

        setMonthlyBudget(Number(data.monthlyBudget));

      } catch (error) {
        console.error(
          "Error fetching budget:",
          error
        );
      } finally {
        setBudgetLoading(false);
      }
    };

    fetchBudget();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };
  const handleEditBudget = () => {
    setBudgetInput(String(monthlyBudget));
    setIsEditingBudget(true);
  };

  const handleSaveBudget = async () => {
    const budget = Number(budgetInput);

    if (!Number.isFinite(budget) || budget < 0) {
      alert("Please enter a valid budget.");
      return;
    }

    try {
      setSavingBudget(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://ai-expense-tracker-s5m6.onrender.com/api/budget",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            monthlyBudget: budget,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update budget"
        );
      }

      setMonthlyBudget(Number(data.monthlyBudget));
      setIsEditingBudget(false);

    } catch (error) {
      console.error("Error updating budget:", error);

      alert(
        error.message || "Failed to update budget"
      );
    } finally {
      setSavingBudget(false);
    }
  };
  return (
    <div className="dashboard-page">

      {/* Navbar */}
      <nav className="dashboard-navbar">

        <div className="logo dashboard-logo">
          <div className="logo-icon">
            <Wallet size={20} />
          </div>

          <span>
            ExpenseTracker <b>AI</b>
          </span>
        </div>

        <div className="dashboard-nav-right">

          <span className="user-name">
            {user?.name || "User"}
          </span>
          <button
            className="settings-btn"
            onClick={() => navigate("/settings")}
          >
            Settings
          </button>
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>

      </nav>

      {/* Dashboard Content */}
      <main className="dashboard-content">

        {/* Welcome */}
        <div className="welcome-section">

          <div>
            <h1>
              Welcome back, {user?.name || "User"} 👋
            </h1>

            <p>
              Your money, understood. Here's your financial overview.
            </p>
          </div>

          <button
            className="add-expense-btn"
            onClick={() => navigate("/add-expense")}
          >
            <Plus size={18} />
            Add Expense
          </button>

        </div>

        {/* Summary Cards */}
        <section className="summary-cards">

          <div className="summary-card">

            <div className="summary-icon">
              <Wallet size={21} />
            </div>

            <span>Total Spending</span>

            <h2>
              ₹{totalSpending.toLocaleString("en-IN")}
            </h2>

            <p>All recorded expenses</p>

          </div>

          <div className="summary-card">

            <div className="summary-icon">
              <TrendingUp size={21} />
            </div>

            <span>This Month</span>

            <h2>
              ₹{thisMonthSpending.toLocaleString("en-IN")}
            </h2>

            <p>Current month spending</p>

          </div>

          <div className="summary-card">

            <div className="summary-icon">
              <Target size={21} />
            </div>

            <div className="budget-title-row">

              <span>Monthly Budget</span>

              <button
                className="edit-budget-btn"
                onClick={handleEditBudget}
              >
                Edit
              </button>

            </div>

            <h2>
              {budgetLoading
                ? "Loading..."
                : `₹${monthlyBudget.toLocaleString("en-IN")}`}
            </h2>

            <p>
              ₹{Math.max(remainingBudget, 0).toLocaleString("en-IN")} remaining
            </p>
            {isEditingBudget && (
              <div className="budget-edit-form">

                <input
                  type="number"
                  min="0"
                  step="100"
                  value={budgetInput}
                  onChange={(e) =>
                    setBudgetInput(e.target.value)
                  }
                  placeholder="Enter monthly budget"
                />

                <div className="budget-edit-actions">

                  <button
                    className="budget-cancel-btn"
                    onClick={() =>
                      setIsEditingBudget(false)
                    }
                    disabled={savingBudget}
                  >
                    Cancel
                  </button>

                  <button
                    className="budget-save-btn"
                    onClick={handleSaveBudget}
                    disabled={savingBudget}
                  >
                    {savingBudget
                      ? "Saving..."
                      : "Save"}
                  </button>

                </div>

              </div>
            )}

          </div>

          {/* Money Owed */}

          <div
            className="summary-card money-owed-summary-card"
            onClick={() => navigate("/expenses")}
          >

            <div className="summary-icon">
              <HandCoins size={21} />
            </div>

            <span>
              Money Owed To You
            </span>

            <h2>
              ₹{totalMoneyOwed.toLocaleString("en-IN")}
            </h2>

            <p>
              {peopleOwing === 0
                ? "No pending payments"
                : `${peopleOwing} ${peopleOwing === 1
                  ? "person owes"
                  : "people owe"
                } you`}
            </p>

          </div>

        </section>

        {/* Main Dashboard Grid */}
        <section className="dashboard-grid">

          {/* Spending Overview */}
          <div className="dashboard-card spending-card">

            <div className="card-header">

              <div>
                <h2>Spending Overview</h2>

                <p>
                  Your spending by category
                </p>
              </div>

              <span className="card-period">
                This month
              </span>

            </div>

            <div className="category-list">

              {["Food", "Travel", "Shopping", "Bills"].map(
                (category) => {

                  const amount = categoryTotals[category] || 0;

                  const percentage =
                    categoryTotal > 0
                      ? Math.round((amount / categoryTotal) * 100)
                      : 0;

                  const icons = {
                    Food: <Utensils size={18} />,
                    Travel: <Car size={18} />,
                    Shopping: <ShoppingCart size={18} />,
                    Bills: <Receipt size={18} />,
                  };

                  return (
                    <div
                      className="category-row"
                      key={category}
                    >

                      <div>

                        <span className="category-name">
                          <span className="category-icon">
                            {icons[category]}
                          </span>

                          {category}
                        </span>

                        <small>
                          {percentage}%
                        </small>

                      </div>

                      <strong>
                        ₹{amount.toLocaleString("en-IN")}
                      </strong>

                    </div>
                  );
                }
              )}

            </div>
          </div>



          {/* AI Insight */}
          <div className="dashboard-card ai-card">

            <div className="ai-card-title">

              <span className="ai-large-icon">
                <Sparkles size={25} />
              </span>

              <div>
                <h2>AI Insight</h2>

                <p>
                  SmartSpend AI noticed something.
                </p>
              </div>

            </div>

            <div className="ai-message">

              <p>
                Your food spending increased by
                <strong> 18%</strong> this month.
              </p>

              <p>
                You could save around
                <strong> ₹750</strong> by reducing
                unnecessary food expenses.
              </p>

            </div>

            <button className="ai-action">
              View spending analysis
              <ArrowRight size={16} />
            </button>

          </div>

        </section>

        {/* Recent Expenses */}
        <section className="dashboard-card recent-expenses">

          <div className="card-header">

            <div>
              <h2>Recent Expenses</h2>

              <p>
                Your latest transactions
              </p>
            </div>

            <button
              className="view-all-btn"
              onClick={() => navigate("/expenses")}
            >
              View all
            </button>

          </div>

          <div className="expense-list">

            {loading ? (
              <p>Loading expenses...</p>
            ) : expenses.length === 0 ? (
              <p>No expenses yet.</p>
            ) : (
              expenses.slice(0, 5).map((expense) => (

                <div
                  className="expense-row"
                  key={expense.id}
                >

                  <div className="expense-info">

                    <div className="expense-icon">
                      <Receipt size={19} />
                    </div>

                    <div>

                      <strong>
                        {expense.title}
                      </strong>

                      <span>
                        {expense.category}
                      </span>

                    </div>

                  </div>

                  <strong>
                    ₹
                    {Number(expense.amount).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              ))
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;