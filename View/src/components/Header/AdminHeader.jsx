import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">WanderTales Admin</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.name || "Admin"}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;