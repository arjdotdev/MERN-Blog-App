import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mt-10 p-6 bg-white rounded shadow max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
      <p className="mb-6">You’re now logged in.</p>
      <button
        onClick={handleLogout}
        className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Log Out
      </button>
    </div>
  );
};
