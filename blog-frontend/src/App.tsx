import "./App.css";
import { useAuth } from "./context/AuthContext";

function App() {
  const { token, logout } = useAuth();
  return (
    <>
      <h1 className="text-xl text-center">Blog Application</h1>
      <div className="p-4">
        <p>Current token: {token ?? "none"}</p>
        {token && <button onClick={logout}>Log out</button>}
      </div>
    </>
  );
}

export default App;
