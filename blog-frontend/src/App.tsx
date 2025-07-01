import { useContext } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
// import { useAuth } from "./context/AuthContext";

function App() {
  const { token, logout } = useContext(AuthContext);
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
