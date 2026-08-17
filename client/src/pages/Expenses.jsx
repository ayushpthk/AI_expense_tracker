import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Receipt,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";
import "../App.css";

function Expenses() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedExpense, setExpandedExpense] = useState(null);
  const [expandedPerson, setExpandedPerson] = useState(null);

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

  const filteredExpenses = expenses.filter((expense) => {
    const searchText = search.toLowerCase();

    return (
      expense.title.toLowerCase().includes(searchText) ||
      expense.category.toLowerCase().includes(searchText)
    );
  });

  const totalSpending = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
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

  const groupedMoneyOwed = moneyOwed.reduce(
    (groups, split) => {
      const name = split.personName.trim();

      if (!groups[name]) {
        groups[name] = {
          personName: name,
          total: 0,
          expenses: [],
        };
      }

      groups[name].total += Number(split.amount);

      groups[name].expenses.push({
        id: split.id,
        title: split.expenseTitle,
        amount: Number(split.amount),
      });

      return groups;
    },
    {}
  );

  const moneyOwedGroups = Object.values(groupedMoneyOwed);

  const totalMoneyOwed = moneyOwedGroups.reduce(
    (total, person) =>
      total + person.total,
    0
  );
  const handleDelete = async (expenseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://ai-expense-tracker-s5m6.onrender.com/api/expenses/${expenseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete expense"
        );
      }

      setExpenses((currentExpenses) =>
        currentExpenses.filter(
          (expense) => expense.id !== expenseId
        )
      );

    } catch (error) {
      console.error(
        "Error deleting expense:",
        error
      );

      window.alert(
        error.message || "Failed to delete expense"
      );
    }
  };
  const handleTogglePaid = async (splitId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://ai-expense-tracker-s5m6.onrender.com/api/expenses/split/${splitId}/toggle-paid`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update payment status"
        );
      }

      setExpenses((currentExpenses) =>
        currentExpenses.map((expense) => ({
          ...expense,
          splits: expense.splits?.map((split) =>
            split.id === splitId
              ? {
                ...split,
                isPaid: data.split.isPaid,
              }
              : split
          ),
        }))
      );

    } catch (error) {
      console.error(
        "Error updating payment status:",
        error
      );

      alert(
        error.message ||
        "Failed to update payment status"
      );
    }
  };

  return (
    <div className="expenses-page">

      {/* Header */}

      <div className="expenses-header">

        <div className="expenses-heading">

          <button
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1>Expenses</h1>

            <p>
              Track and manage all your transactions.
            </p>
          </div>

        </div>

        <button
          className="add-expense-btn"
          onClick={() => navigate("/add-expense")}
        >
          <Plus size={18} />
          Add Expense
        </button>

      </div>


      {/* Summary */}

      <div className="expenses-summary">

        <div>
          <span>Total Expenses</span>

          <strong>
            {expenses.length}
          </strong>
        </div>

        <div>
          <span>Total Spending</span>

          <strong>
            ₹{totalSpending.toLocaleString("en-IN")}
          </strong>
        </div>

      </div>
      {moneyOwedGroups.length > 0 && (
        <section className="money-owed-card">

          <div className="money-owed-header">

            <div>
              <h2>
                💸 Money Owed To You
              </h2>

              <p>
                People who still owe you money
              </p>
            </div>

            <strong className="money-owed-total">
              ₹{totalMoneyOwed.toLocaleString("en-IN")}
            </strong>

          </div>


          <div className="money-owed-list">

            {moneyOwedGroups.map((person) => (

              <div
                className="money-owed-person"
                key={person.personName}
              >

                <button
                  type="button"
                  className="money-owed-person-header"
                  onClick={() =>
                    setExpandedPerson(
                      expandedPerson === person.personName
                        ? null
                        : person.personName
                    )
                  }
                >

                  <div>
                    <strong>
                      {person.personName}
                    </strong>

                    <span>
                      {person.expenses.length}{" "}
                      {person.expenses.length === 1
                        ? "expense"
                        : "expenses"}
                    </span>
                  </div>

                  <div className="money-owed-person-right">

                    <strong>
                      ₹{person.total.toLocaleString("en-IN")}
                    </strong>

                    <span>
                      {expandedPerson === person.personName
                        ? "▲"
                        : "▼"}
                    </span>

                  </div>

                </button>


                {expandedPerson === person.personName && (

                  <div className="money-owed-person-expenses">

                    {person.expenses.map((expense) => (

                      <div
                        className="money-owed-expense"
                        key={expense.id}
                      >

                        <span>
                          {expense.title}
                        </span>

                        <strong>
                          ₹
                          {expense.amount.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            ))}

          </div>

        </section>
      )}


      {/* Search */}

      <div className="expenses-toolbar">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>


      {/* Expenses */}

      <section className="expenses-list-card">

        <div className="expenses-list-header">

          <div>
            <h2>Your Expenses</h2>

            <p>
              {filteredExpenses.length} transaction
              {filteredExpenses.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

        </div>


        {loading ? (
          <div className="empty-expenses">
            <p>Loading expenses...</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="empty-expenses">

            <Receipt size={40} />

            <h3>
              No expenses found
            </h3>

            <p>
              Add an expense to start tracking
              your spending.
            </p>

            <button
              className="add-expense-btn"
              onClick={() =>
                navigate("/add-expense")
              }
            >
              <Plus size={18} />
              Add Expense
            </button>

          </div>
        ) : (
          <div className="expenses-table">

            {filteredExpenses.map((expense) => (

              <div
                className="expense-item"
                key={expense.id}
              >

                <div className="expense-item-icon">
                  <Receipt size={19} />
                </div>

                <div className="expense-item-details">

                  <strong>
                    {expense.title}
                  </strong>

                  <span>
                    {expense.category}
                  </span>

                </div>

                <div className="expense-item-date">
                  {new Date(
                    expense.date
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>

                <strong className="expense-item-amount">
                  ₹
                  {Number(
                    expense.amount
                  ).toLocaleString("en-IN")}
                </strong>

                <button
                  className="edit-expense-btn"
                  onClick={() =>
                    navigate("/add-expense", {
                      state: {
                        expense: expense,
                      },
                    })
                  }
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  className="delete-expense-btn"
                  onClick={() =>
                    handleDelete(expense.id)
                  }
                >
                  <Trash2 size={16} />
                  Delete
                </button>

                {/* Split information */}

                {expense.splits &&
                  expense.splits.length > 0 && (

                    <div className="expense-split-container">

                      <button
                        type="button"
                        className="split-toggle-btn"
                        onClick={() =>
                          setExpandedExpense(
                            expandedExpense === expense.id
                              ? null
                              : expense.id
                          )
                        }
                      >
                        Split with {expense.splits.length}{" "}
                        {expense.splits.length === 1
                          ? "person"
                          : "people"}

                        <span>
                          {expandedExpense === expense.id
                            ? "▲"
                            : "▼"}
                        </span>
                      </button>


                      {expandedExpense === expense.id && (

                        <div className="split-details">

                          <h4>
                            Split Details
                          </h4>

                          {expense.splits.map((split) => (

                            <div
                              className="split-detail-row"
                              key={split.id}
                            >

                              <div className="split-person-info">

                                <span>
                                  {split.personName}
                                </span>

                                <strong>
                                  ₹
                                  {Number(
                                    split.amount
                                  ).toLocaleString("en-IN")}
                                </strong>

                              </div>

                              <div className="split-payment-action">

                                {split.isPaid ? (

                                  <button
                                    type="button"
                                    className="paid-status paid-status-btn"
                                    onClick={() =>
                                      handleTogglePaid(split.id)
                                    }
                                  >
                                    ✓ Paid
                                  </button>

                                ) : (

                                  <button
                                    type="button"
                                    className="mark-paid-btn"
                                    onClick={() =>
                                      handleTogglePaid(split.id)
                                    }
                                  >
                                    Mark as Paid
                                  </button>

                                )}

                              </div>

                            </div>

                          ))}

                          <div className="split-detail-summary">

                            <div>
                              <span>
                                Pending from others
                              </span>

                              <strong>
                                ₹
                                {expense.splits
                                  .filter((split) => !split.isPaid)
                                  .reduce(
                                    (total, split) =>
                                      total + Number(split.amount),
                                    0
                                  )
                                  .toLocaleString("en-IN")}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Your share
                              </span>

                              <strong>
                                ₹
                                {(
                                  Number(expense.amount) -
                                  expense.splits.reduce(
                                    (total, split) =>
                                      total + Number(split.amount),
                                    0
                                  )
                                ).toLocaleString("en-IN")}
                              </strong>
                            </div>

                          </div>

                        </div>

                      )}

                    </div>

                  )}

              </div>

            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Expenses;