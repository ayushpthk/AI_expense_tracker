import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
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
    {
      personName: "",
      amount: "",
    },
  ]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(String(editingExpense.amount));
      setCategory(editingExpense.category);

      setDate(
        new Date(editingExpense.date)
          .toISOString()
          .split("T")[0]
      );

      setNotes(editingExpense.notes || "");

      // Load existing splits
      if (
        editingExpense.splits &&
        editingExpense.splits.length > 0
      ) {
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

        setSplits([
          {
            personName: "",
            amount: "",
          },
        ]);
      }
    }
  }, [editingExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    // Validate split data
    if (splitEnabled) {
      if (
        splits.some(
          (split) =>
            !split.personName.trim() ||
            Number(split.amount) <= 0
        )
      ) {
        setError(
          "Please enter a valid name and amount for every person."
        );
        setLoading(false);
        return;
      }

      if (totalSplitAmount > Number(amount)) {
        setError(
          "Split amounts cannot be greater than the expense amount."
        );
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");

      const url = isEditing
        ? `https://ai-expense-tracker-s5m6.onrender.com/api/expenses/${editingExpense.id}`
        : "https://ai-expense-tracker-s5m6.onrender.com/api/expenses";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title,
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
          (isEditing
            ? "Failed to update expense"
            : "Failed to add expense")
        );
      }

      navigate("/expenses");

    } catch (error) {
      console.error(error);

      setError(
        error.message || "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };
  const addSplitPerson = () => {
    setSplits([
      ...splits,
      {
        personName: "",
        amount: "",
      },
    ]);
  };
  const removeSplitPerson = (index) => {
    setSplits(
      splits.filter((_, splitIndex) => splitIndex !== index)
    );
  };
  const updateSplit = (index, field, value) => {
    setSplits(
      splits.map((split, splitIndex) =>
        splitIndex === index
          ? {
            ...split,
            [field]: value,
          }
          : split
      )
    );
  };
  const totalSplitAmount = splits.reduce(
    (total, split) =>
      total + Number(split.amount || 0),
    0
  );
  const yourShare =
    Number(amount || 0) - totalSplitAmount;
  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>
          {isEditing ? "Edit Expense" : "Add Expense"}
        </h1>

        <p className="auth-subtitle">
          {isEditing
            ? "Update your expense details"
            : "Record a new expense"}
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Title */}

          <div className="form-group">

            <label>
              Expense Name
            </label>

            <input
              type="text"
              placeholder="e.g. Groceries"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />

          </div>


          {/* Amount */}

          <div className="form-group">

            <label>
              Amount
            </label>

            <input
              type="number"
              placeholder="e.g. 1200"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              required
            />

          </div>
          <div className="split-toggle">

            <label>
              <input
                type="checkbox"
                checked={splitEnabled}
                onChange={(e) => {
                  setSplitEnabled(e.target.checked);

                  if (!e.target.checked) {
                    setSplits([
                      {
                        personName: "",
                        amount: "",
                      },
                    ]);
                  }
                }}
              />

              Split this expense
            </label>

          </div>
          {splitEnabled && (
            <div className="split-section">

              <h3>Split Expense</h3>

              <p className="split-description">
                Add the people who owe you money.
              </p>

              {splits.map((split, index) => (
                <div
                  className="split-person"
                  key={index}
                >

                  <input
                    type="text"
                    placeholder="Person name"
                    value={split.personName}
                    onChange={(e) =>
                      updateSplit(
                        index,
                        "personName",
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="number"
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                    value={split.amount}
                    onChange={(e) =>
                      updateSplit(
                        index,
                        "amount",
                        e.target.value
                      )
                    }
                  />

                  {splits.length > 1 && (
                    <button
                      type="button"
                      className="remove-split-btn"
                      onClick={() =>
                        removeSplitPerson(index)
                      }
                    >
                      ×
                    </button>
                  )}

                </div>
              ))}

              <button
                type="button"
                className="add-split-btn"
                onClick={addSplitPerson}
              >
                + Add person
              </button>

              <div className="split-summary">

                <p>
                  Others owe you:
                  <strong>
                    ₹{totalSplitAmount.toLocaleString("en-IN")}
                  </strong>
                </p>

                <p>
                  Your share:
                  <strong>
                    ₹{Math.max(yourShare, 0).toLocaleString("en-IN")}
                  </strong>
                </p>

              </div>

            </div>
          )}


          {/* Category */}

          <div className="form-group">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="Food">
                Food
              </option>

              <option value="Travel">
                Travel
              </option>

              <option value="Shopping">
                Shopping
              </option>

              <option value="Bills">
                Bills
              </option>

              <option value="Entertainment">
                Entertainment
              </option>

              <option value="Health">
                Health
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>


          {/* Date */}

          <div className="form-group">

            <label>
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              required
            />

          </div>


          {/* Notes */}

          <div className="form-group">

            <label>
              Notes
            </label>

            <textarea
              placeholder="Optional notes"
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              rows="3"
            />

          </div>


          {/* Submit */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? isEditing
                ? "Updating..."
                : "Saving..."
              : isEditing
                ? "Update Expense"
                : "Save Expense"}
          </button>


          {/* Cancel */}

          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddExpense;