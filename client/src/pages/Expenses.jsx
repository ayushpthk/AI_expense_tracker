
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Receipt,
  Search,
  Pencil,
  Trash2,
  Wallet,
  HandCoins,
  ChevronDown,
  ChevronUp,
  Utensils,
  Car,
  ShoppingBag,
  House,
  Clapperboard,
  HeartPulse,
  CircleHelp,
  Check,
  Users,
  ArrowUpRight,
  X,
} from "lucide-react";
import "../App.css";

function Expenses() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedExpense, setExpandedExpense] = useState(null);
  const [expandedPerson, setExpandedPerson] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://ai-expense-tracker-s5m6.onrender.com/api/expenses",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch expenses");
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

  const groupedMoneyOwed = moneyOwed.reduce((groups, split) => {
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
  }, {});

  const moneyOwedGroups = Object.values(groupedMoneyOwed);

  const totalMoneyOwed = moneyOwedGroups.reduce(
    (total, person) => total + person.total,
    0
  );

  const categoryIcons = {
    Food: Utensils,
    Travel: Car,
    Shopping: ShoppingBag,
    Bills: House,
    Entertainment: Clapperboard,
    Health: HeartPulse,
    Other: CircleHelp,
  };

  const getCategoryIcon = (category) => categoryIcons[category] || Receipt;

  const filteredExpenses = expenses
    .filter((expense) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        expense.title.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        (expense.notes || "").toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" || expense.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortOrder === "oldest") {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortOrder === "highest") {
        return Number(b.amount) - Number(a.amount);
      }
      return Number(a.amount) - Number(b.amount);
    });

  const handleDelete = async (expenseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://ai-expense-tracker-s5m6.onrender.com/api/expenses/${expenseId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete expense");
      }

      setExpenses((current) =>
        current.filter((expense) => expense.id !== expenseId)
      );
    } catch (error) {
      console.error("Error deleting expense:", error);
      window.alert(error.message || "Failed to delete expense");
    }
  };

  const handleTogglePaid = async (splitId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://ai-expense-tracker-s5m6.onrender.com/api/expenses/split/${splitId}/toggle-paid`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update payment status");
      }

      setExpenses((current) =>
        current.map((expense) => ({
          ...expense,
          splits: expense.splits?.map((split) =>
            split.id === splitId
              ? { ...split, isPaid: data.split.isPaid }
              : split
          ),
        }))
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      window.alert(error.message || "Failed to update payment status");
    }
  };

  return (
    <div className="ledger-page">
      <nav className="ledger-navbar">
        <button
          type="button"
          className="ledger-brand"
          onClick={() => navigate("/dashboard")}
        >
          <span className="ledger-brand-icon">
            <Wallet size={21} />
          </span>
          <span>smartspend<span className="ledger-brand-dot">.</span></span>
        </button>

        <button
          type="button"
          className="ledger-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>
      </nav>

      <main className="ledger-content">
        <section className="ledger-hero">
          <div>
            <span className="ledger-eyebrow">YOUR FINANCIAL JOURNAL</span>
            <h1>
              Every rupee,
              <br />
              <span>accounted for.</span>
            </h1>
            <p>Your spending, shared expenses, and little details — all in one place.</p>
          </div>

          <button
            type="button"
            className="ledger-add-button"
            onClick={() => navigate("/add-expense")}
          >
            <Plus size={19} />
            Add expense
          </button>
          <div className="ledger-hero-sticker" aria-hidden="true">₹</div>
        </section>

        <section className="ledger-stats">
          <div className="ledger-stat ledger-stat-peach">
            <span className="ledger-stat-icon"><Receipt size={19} /></span>
            <span className="ledger-stat-label">TOTAL TRANSACTIONS</span>
            <strong>{expenses.length}</strong>
            <span className="ledger-stat-foot">Expenses recorded</span>
          </div>

          <div className="ledger-stat ledger-stat-sage">
            <span className="ledger-stat-icon"><Wallet size={19} /></span>
            <span className="ledger-stat-label">TOTAL SPENDING</span>
            <strong>₹{totalSpending.toLocaleString("en-IN")}</strong>
            <span className="ledger-stat-foot">Across all expenses</span>
          </div>

          <div className="ledger-stat ledger-stat-yellow">
            <span className="ledger-stat-icon"><HandCoins size={19} /></span>
            <span className="ledger-stat-label">STILL OWED TO YOU</span>
            <strong>₹{totalMoneyOwed.toLocaleString("en-IN")}</strong>
            <span className="ledger-stat-foot">
              {moneyOwedGroups.length} {moneyOwedGroups.length === 1 ? "person" : "people"} with pending payments
            </span>
          </div>
        </section>

        {moneyOwedGroups.length > 0 && (
          <section className="ledger-owed-panel">
            <div className="ledger-panel-heading">
              <div className="ledger-panel-icon"><HandCoins size={21} /></div>
              <div>
                <h2>Money coming back</h2>
                <p>Keep track of who's yet to pay you back.</p>
              </div>
              <strong className="ledger-owed-total">
                ₹{totalMoneyOwed.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="ledger-people-list">
              {moneyOwedGroups.map((person) => (
                <div className="ledger-person" key={person.personName}>
                  <button
                    type="button"
                    className="ledger-person-toggle"
                    aria-expanded={expandedPerson === person.personName}
                    onClick={() =>
                      setExpandedPerson(
                        expandedPerson === person.personName
                          ? null
                          : person.personName
                      )
                    }
                  >
                    <span className="ledger-avatar">
                      {person.personName.charAt(0).toUpperCase()}
                    </span>
                    <span className="ledger-person-main">
                      <strong>{person.personName}</strong>
                      <small>
                        {person.expenses.length} outstanding{" "}
                        {person.expenses.length === 1 ? "share" : "shares"}
                      </small>
                    </span>
                    <strong className="ledger-person-amount">
                      ₹{person.total.toLocaleString("en-IN")}
                    </strong>
                    {expandedPerson === person.personName
                      ? <ChevronUp size={18} />
                      : <ChevronDown size={18} />}
                  </button>

                  {expandedPerson === person.personName && (
                    <div className="ledger-person-details">
                      {person.expenses.map((expense) => (
                        <div key={expense.id} className="ledger-person-expense">
                          <span>{expense.title}</span>
                          <strong>₹{expense.amount.toLocaleString("en-IN")}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="ledger-transactions">
          <div className="ledger-transactions-heading">
            <div>
              <span className="ledger-eyebrow">THE FULL PICTURE</span>
              <h2>Your expenses</h2>
              <p>
                {filteredExpenses.length}{" "}
                {filteredExpenses.length === 1 ? "transaction" : "transactions"}
                {search || categoryFilter !== "All" ? " found" : " in your journal"}
              </p>
            </div>
            <span className="ledger-receipt-decoration"><Receipt size={24} /></span>
          </div>

          <div className="ledger-toolbar">
            <label className="ledger-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search name, category, or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <select
              className="ledger-filter"
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All categories</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>

            <select
              className="ledger-filter"
              aria-label="Sort expenses"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest amount</option>
              <option value="lowest">Lowest amount</option>
            </select>
          </div>

          {loading ? (
            <div className="ledger-empty">
              <div className="ledger-empty-icon"><Receipt size={27} /></div>
              <h3>Gathering your expenses...</h3>
              <p>Your transactions will appear here in a moment.</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="ledger-empty">
              <div className="ledger-empty-icon"><Receipt size={27} /></div>
              <h3>{expenses.length === 0 ? "A fresh page." : "Nothing found."}</h3>
              <p>
                {expenses.length === 0
                  ? "Add your first expense and start understanding your spending."
                  : "Try a different search or category filter."}
              </p>
              {expenses.length === 0 ? (
                <button
                  type="button"
                  className="ledger-add-button"
                  onClick={() => navigate("/add-expense")}
                >
                  <Plus size={18} /> Add your first expense
                </button>
              ) : (
                <button
                  type="button"
                  className="ledger-clear-filters"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("All");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="ledger-expense-list">
              {filteredExpenses.map((expense) => {
                const CategoryIcon = getCategoryIcon(expense.category);
                const pendingAmount = (expense.splits || [])
                  .filter((split) => !split.isPaid)
                  .reduce((total, split) => total + Number(split.amount), 0);

                return (
                  <article className="ledger-expense" key={expense.id}>
                    <div className={`ledger-expense-icon ledger-icon-${expense.category.toLowerCase()}`}>
                      <CategoryIcon size={21} />
                    </div>

                    <div className="ledger-expense-main">
                      <strong>{expense.title}</strong>
                      <div className="ledger-expense-meta">
                        <span>{expense.category}</span>
                        <span className="ledger-meta-dot">·</span>
                        <span>
                          {new Date(expense.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {expense.notes && (
                        <p className="ledger-expense-notes">{expense.notes}</p>
                      )}
                      {expense.splits?.length > 0 && (
                        <span className={`ledger-payment-chip ${pendingAmount > 0 ? "pending" : "settled"}`}>
                          <Users size={13} />
                          {pendingAmount > 0
                            ? `₹${pendingAmount.toLocaleString("en-IN")} pending`
                            : "All shares settled"}
                        </span>
                      )}
                    </div>

                    <div className="ledger-expense-right">
                      <strong className="ledger-expense-amount">
                        ₹{Number(expense.amount).toLocaleString("en-IN")}
                      </strong>
                      <div className="ledger-expense-actions">
                        <button
                          type="button"
                          className="ledger-edit"
                          onClick={() =>
                            navigate("/add-expense", { state: { expense } })
                          }
                          aria-label={`Edit ${expense.title}`}
                          title="Edit expense"
                        >
                          <Pencil size={15} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="ledger-delete"
                          onClick={() => handleDelete(expense.id)}
                          aria-label={`Delete ${expense.title}`}
                          title="Delete expense"
                        >
                          <Trash2 size={15} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {expense.splits?.length > 0 && (
                      <div className="ledger-splits">
                        <button
                          type="button"
                          className="ledger-splits-toggle"
                          aria-expanded={expandedExpense === expense.id}
                          onClick={() =>
                            setExpandedExpense(
                              expandedExpense === expense.id ? null : expense.id
                            )
                          }
                        >
                          <Users size={15} />
                          Split with {expense.splits.length}{" "}
                          {expense.splits.length === 1 ? "person" : "people"}
                          {expandedExpense === expense.id
                            ? <ChevronUp size={16} />
                            : <ChevronDown size={16} />}
                        </button>

                        {expandedExpense === expense.id && (
                          <div className="ledger-splits-details">
                            {expense.splits.map((split) => (
                              <div className="ledger-split-row" key={split.id}>
                                <div className="ledger-split-person">
                                  <span className="ledger-avatar small">
                                    {split.personName.charAt(0).toUpperCase()}
                                  </span>
                                  <div>
                                    <strong>{split.personName}</strong>
                                    <small>
                                      {split.isPaid ? "Payment received" : "Payment pending"}
                                    </small>
                                  </div>
                                </div>
                                <strong className="ledger-split-amount">
                                  ₹{Number(split.amount).toLocaleString("en-IN")}
                                </strong>
                                <button
                                  type="button"
                                  className={split.isPaid ? "ledger-paid" : "ledger-mark-paid"}
                                  onClick={() => handleTogglePaid(split.id)}
                                >
                                  {split.isPaid ? <><Check size={14} /> Paid</> : "Mark paid"}
                                </button>
                              </div>
                            ))}

                            <div className="ledger-split-summary">
                              <span>Still owed</span>
                              <strong>
                                ₹{pendingAmount.toLocaleString("en-IN")}
                              </strong>
                              <span>Your share</span>
                              <strong>
                                ₹{(
                                  Number(expense.amount) -
                                  expense.splits.reduce(
                                    (total, split) => total + Number(split.amount),
                                    0
                                  )
                                ).toLocaleString("en-IN")}
                              </strong>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <button
          type="button"
          className="ledger-bottom-link"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowUpRight size={16} />
          Back to your financial overview
        </button>
      </main>
    </div>
  );
}

export default Expenses;
