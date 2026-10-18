
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  Trash2,
  ShieldCheck,
  Database,
  ReceiptText,
  Sparkles,
} from "lucide-react";
import "../App.css";

function Settings() {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAll = async () => {
    const firstConfirm = window.confirm(
      "Are you sure you want to delete ALL your expenses?"
    );

    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      "This action cannot be undone. Delete all expenses permanently?"
    );

    if (!secondConfirm) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://ai-expense-tracker-s5m6.onrender.com/api/expenses",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete expenses");
      }

      alert(`${data.deletedCount} expense(s) deleted successfully.`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting expenses:", error);
      alert(error.message || "Failed to delete expenses");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="settings-creative">
      <nav className="settings-topbar">
        <button
          className="settings-brand"
          onClick={() => navigate("/dashboard")}
        >
          <span className="settings-brand-mark">s.</span>
          <span>smartspend<span className="settings-brand-dot">.</span></span>
        </button>

        <button
          className="settings-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </button>
      </nav>

      <main className="settings-main">
        
        <section className="settings-section-heading">
          <div>
            <span className="settings-section-kicker">PREFERENCES & DATA</span>
            <h2>Manage your account</h2>
          </div>
          <span className="settings-private-label">
            <ShieldCheck size={15} />
            Private workspace
          </span>
        </section>

        <section className="settings-data-card">
          <div className="settings-data-heading">
            <div className="settings-data-icon">
              <Database size={22} />
            </div>
            <div>
              <h3>Data management</h3>
              <p>Your expense records, all in one place.</p>
            </div>
          </div>

          <div className="settings-info-strip">
            <div className="settings-info-icon">
              <ReceiptText size={20} />
            </div>
            <div>
              <strong>Your expenses belong to you.</strong>
              <p>
                You can remove your saved expense records whenever you want.
                This action does not delete your account or login information.
              </p>
            </div>
          </div>

          <div className="settings-danger-zone">
            <div className="settings-danger-copy">
              <div className="settings-danger-title">
                <span className="settings-danger-icon">
                  <AlertTriangle size={18} />
                </span>
                <h3>Delete all expenses</h3>
              </div>

              <p>
                Permanently delete all expenses associated with your account.
                This cannot be undone, so make sure you really want to start
                with a clean slate.
              </p>
              <span className="settings-danger-note">
                <AlertTriangle size={13} />
                Irreversible action
              </span>
            </div>

            <button
              className="settings-delete-button"
              onClick={handleDeleteAll}
              disabled={deleting}
            >
              <Trash2 size={17} />
              {deleting ? "Deleting..." : "Delete all expenses"}
            </button>
          </div>
        </section>

        <footer className="settings-footer">
          <span className="settings-footer-mark">s.</span>
          <p>Small steps. Smarter spending.</p>
          <span className="settings-footer-status">
            <span />
            Your financial space
          </span>
        </footer>
      </main>
    </div>
  );
}

export default Settings;
