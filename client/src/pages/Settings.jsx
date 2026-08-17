import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Trash2 } from "lucide-react";
import "../App.css";

function Settings() {
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);

  const handleDeleteAll = async () => {
    const firstConfirm = window.confirm(
      "Are you sure you want to delete ALL your expenses?"
    );

    if (!firstConfirm) {
      return;
    }

    const secondConfirm = window.confirm(
      "This action cannot be undone. Delete all expenses permanently?"
    );

    if (!secondConfirm) {
      return;
    }

    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/expenses",
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
          data.message || "Failed to delete expenses"
        );
      }

      alert(
        `${data.deletedCount} expense(s) deleted successfully.`
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Error deleting expenses:",
        error
      );

      alert(
        error.message ||
        "Failed to delete expenses"
      );

    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="settings-page">

      <div className="settings-header">

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1>Settings</h1>

          <p>
            Manage your account and data.
          </p>
        </div>

      </div>


      <section className="settings-card">

        <div className="settings-card-header">

          <div className="settings-warning-icon">
            <AlertTriangle size={22} />
          </div>

          <div>
            <h2>Data Management</h2>

            <p>
              Manage your stored expense data.
            </p>
          </div>

        </div>


        <div className="danger-zone">

          <div>

            <h3>
              Delete all expenses
            </h3>

            <p>
              Permanently delete all expenses
              associated with your account.
              Your account and login information
              will not be affected.
            </p>

          </div>

          <button
            className="delete-all-btn"
            onClick={handleDeleteAll}
            disabled={deleting}
          >
            <Trash2 size={17} />

            {deleting
              ? "Deleting..."
              : "Delete all expenses"}
          </button>

        </div>

      </section>

    </div>
  );
}

export default Settings;