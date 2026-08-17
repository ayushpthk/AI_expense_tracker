import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Expenses from "./pages/Expenses";
import Settings from "./pages/Settings";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/add-expense"
          element={<AddExpense />}
        />
        <Route
          path="/expenses"
          element={<Expenses />}
        />
        <Route
          path="/settings"
          element={<Settings />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;