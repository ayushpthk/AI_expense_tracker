
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Wallet,
  ArrowLeft,
  Receipt,
  Utensils,
  Car,
  ShoppingBag,
  House,
  HeartPulse,
  Clapperboard,
  CircleHelp,
  CalendarDays,
  Users,
  Plus,
  X,
  Sparkles,
  CheckCircle2,
  StickyNote,
} from "lucide-react";
import "../App.css";

function AddExpense() {
  const navigate = useNavigate();
  const location = useLocation();

  const editingExpense = location.state?.expense;
  const isEditing = Boolean(editingExpense);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [splits, setSplits] = useState([
    { personName: "", amount: "" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(String(editingExpense.amount));
      setCategory(editingExpense.category);
      setDate(
        new Date(editingExpense.date).toISOString().split("T")[0]
      );
      setNotes(editingExpense.notes || "");

      if (editingExpense.splits?.length > 0) {
        setSplitEnabled(true);
        setSplits(
          editingExpense.splits.map((split) => ({
            id: split.id,
            personName: split.personName,
            amount: String(split.amount),
            isPaid: split.isPaid,
          }))
        );
      } else {
        setSplitEnabled(false);
        setSplits([{ personName: "", amount: "" }]);
      }
    }
  }, [editingExpense]);

  const totalSplitAmount = splits.reduce(
    (total, split) => total + Number(split.amount || 0),
    0
  );

  const yourShare = Number(amount || 0) - totalSplitAmount;

  const categories = [
    { name: "Food", icon: Utensils, color: "peach" },
    { name: "Travel", icon: Car, color: "sage" },
    { name: "Shopping", icon: ShoppingBag, color: "yellow" },
    { name: "Bills", icon: House, color: "plum" },
    { name: "Entertainment", icon: Clapperboard, color: "peach" },
    { name: "Health", icon: HeartPulse, color: "sage" },
    { name: "Other", icon: CircleHelp, color: "yellow" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!title.trim() || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter an expense name and a valid amount greater than zero.");
      setLoading(false);
      return;
    }

    if (splitEnabled) {
      if (
        splits.some(
          (split) =>
            !split.personName.trim() ||
            !Number.isFinite(Number(split.amount)) ||
            Number(split.amount) <= 0
        )
      ) {
        setError("Please enter a valid name and amount for every person.");
        setLoading(false);
        return;
      }

      if (totalSplitAmount > Number(amount)) {
        setError("Split amounts cannot be greater than the expense amount.");
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");

      const url = isEditing
        ? `https://ai-expense-tracker-s5m6.onrender.com/api/expenses/${editingExpense.id}`
        : "https://ai-expense-tracker-s5m6.onrender.com/api/expenses";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          amount: Number(amount),
          category,
          date,
          notes,
          splits: splitEnabled
            ? splits.map((split) => ({
                personName: split.personName.trim(),
                amount: Number(split.amount),
                isPaid: Boolean(split.isPaid),
              }))
            : [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditing ? "Failed to update expense" : "Failed to add expense")
        );
      }

      navigate("/expenses");
    } catch (error) {
      console.error(error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const addSplitPerson = () => {
    setSplits([...splits, { personName: "", amount: "" }]);
  };

  const removeSplitPerson = (index) => {
    setSplits(splits.filter((_, splitIndex) => splitIndex !== index));
  };

  const updateSplit = (index, field, value) => {
    setSplits(
      splits.map((split, splitIndex) =>
        splitIndex === index
          ? { ...split, [field]: value }
          : split
      )
    );
  };

  return (
    <div className="spend-page">
      <nav className="spend-navbar">
        <button
          type="button"
          className="spend-brand"
          onClick={() => navigate("/dashboard")}
        >
          <span className="spend-brand-icon">
            <Wallet size={21} />
          </span>
          <span>smartspend<span className="spend-brand-dot">.</span></span>
        </button>

        <button
          type="button"
          className="spend-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>
      </nav>

      <main className="spend-layout">
        <section className="spend-intro">
          <span className="spend-eyebrow">
            <Sparkles size={15} />
            YOUR MONEY, YOUR STORY
          </span>

          <h1>
            Every little
            <br />
            expense <span>counts.</span>
          </h1>

          <p>
            Keep track of where your money goes.
            A little clarity today makes better decisions tomorrow.
          </p>

          <div className="spend-note-card">
            <div className="spend-note-icon">
              <Receipt size={22} />
            </div>
            <div>
              <strong>Small entries, big picture.</strong>
              <p>Record it now. Understand it later.</p>
            </div>
          </div>

          <div className="spend-decoration" aria-hidden="true">
            <span>₹</span>
            <span>✳</span>
            <span>↗</span>
          </div>
        </section>

        <section className="spend-form-panel">
          <div className="spend-form-heading">
            <div>
              <span className="spend-step-label">
                {isEditing ? "UPDATE RECORD" : "NEW RECORD"}
              </span>
              <h2>{isEditing ? "Edit expense" : "Add an expense"}</h2>
              <p>
                {isEditing
                  ? "Make changes to your expense details."
                  : "A few details and you're all set."}
              </p>
            </div>
            <div className="spend-form-heading-icon">
              <Receipt size={25} />
            </div>
          </div>

          {error && (
            <div className="spend-error" role="alert">
              {error}
            </div>
          )}

          <form className="spend-form" onSubmit={handleSubmit}>
            <div className="spend-field">
              <label htmlFor="expense-title">What did you spend on?</label>
              <input
                id="expense-title"
                type="text"
                placeholder="e.g. Weekend groceries"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="spend-field">
              <label htmlFor="expense-amount">How much was it?</label>
              <div className="spend-amount-wrap">
                <span>₹</span>
                <input
                  id="expense-amount"
                  type="number"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="spend-field">
              <label>Choose a category</label>
              <div className="spend-category-grid">
                {categories.map(({ name, icon: Icon, color }) => (
                  <button
                    type="button"
                    key={name}
                    className={`spend-category-option ${color} ${
                      category === name ? "selected" : ""
                    }`}
                    aria-pressed={category === name}
                    onClick={() => setCategory(name)}
                  >
                    <Icon size={20} />
                    <span>{name}</span>
                    {category === name && (
                      <CheckCircle2 className="spend-category-check" size={15} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="spend-field">
              <label htmlFor="expense-date">
                <CalendarDays size={15} />
                When did it happen?
              </label>
              <input
                id="expense-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="spend-field">
              <label htmlFor="expense-notes">
                <StickyNote size={15} />
                A note for later <span className="spend-optional">(optional)</span>
              </label>
              <textarea
                id="expense-notes"
                placeholder="Anything you'd like to remember?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="spend-split-toggle">
              <div className="spend-split-toggle-copy">
                <span className="spend-split-icon">
                  <Users size={20} />
                </span>
                <div>
                  <strong>Sharing this expense?</strong>
                  <p>Add people who owe you money.</p>
                </div>
              </div>

              <label className="spend-switch">
                <input
                  type="checkbox"
                  checked={splitEnabled}
                  onChange={(e) => {
                    setSplitEnabled(e.target.checked);
                    if (!e.target.checked) {
                      setSplits([{ personName: "", amount: "" }]);
                    }
                  }}
                />
                <span className="spend-switch-track" />
              </label>
            </div>

            {splitEnabled && (
              <div className="spend-split-panel">
                <div className="spend-split-heading">
                  <div>
                    <h3>Who's chipping in?</h3>
                    <p>Add each person and the amount they owe.</p>
                  </div>
                  <Users size={22} />
                </div>

                {splits.map((split, index) => (
                  <div className="spend-split-person" key={index}>
                    <input
                      aria-label={`Person ${index + 1} name`}
                      type="text"
                      placeholder="Person's name"
                      value={split.personName}
                      onChange={(e) =>
                        updateSplit(index, "personName", e.target.value)
                      }
                      required={splitEnabled}
                    />
                    <div className="spend-split-amount">
                      <span>₹</span>
                      <input
                        aria-label={`Person ${index + 1} amount`}
                        type="number"
                        placeholder="Amount"
                        min="0.01"
                        step="0.01"
                        value={split.amount}
                        onChange={(e) =>
                          updateSplit(index, "amount", e.target.value)
                        }
                        required={splitEnabled}
                      />
                    </div>
                    {splits.length > 1 && (
                      <button
                        type="button"
                        className="spend-remove-person"
                        aria-label={`Remove person ${index + 1}`}
                        onClick={() => removeSplitPerson(index)}
                      >
                        <X size={17} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="spend-add-person"
                  onClick={addSplitPerson}
                >
                  <Plus size={16} />
                  Add another person
                </button>

                <div className="spend-split-totals">
                  <div>
                    <span>Others owe you</span>
                    <strong>₹{totalSplitAmount.toLocaleString("en-IN")}</strong>
                  </div>
                  <div>
                    <span>Your share</span>
                    <strong>
                      ₹{Math.max(yourShare, 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            <div className="spend-form-actions">
              <button
                type="button"
                className="spend-cancel-btn"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="spend-submit-btn"
                disabled={loading}
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Saving..."
                  : isEditing
                    ? "Update expense"
                    : "Save expense"}
                {!loading && <ArrowLeft className="spend-submit-arrow" size={17} />}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default AddExpense;
