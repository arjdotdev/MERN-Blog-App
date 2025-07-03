Tailwind CSS(Utility first CSS framework) Setup

npx is a package runner that comes with npm which lets you execute binaries without installing them globally

Tailwind CSS Intellisense: for auto-recommendation

Tailwind CSS version 4 has different setup which is very easy.

AuthContext:
Create Context:
const AuthContext = createContext<AuthContextType>({
token: null,
login: () => {},
logout: () => {},
});

"createContext" makes a Context object.
The argument is the default value (used only if a component tries to consume the context without a Provider)

AuthProvider:
export const AuthProvider = ({ children }: { children: ReactNode }) => {

Wrap your app or part of it with <AuthProvider></AuthProvider> so any child can access the auth context.

const [token, setToken] = useState<string | null>(() => {
return localStorage.getItem('token');
});
We use localStorage so even a page reload preserve login status.

useEffect
useEffect(() => {
if (token) {
localStorage.setItem('token', token);
} else {
localStorage.removeItem('token');
}
}, [token]);

If the token state is not null, write it to localStorage.
If it is null (on logout), remove it.

const login = (jwt: string) => {
setToken(jwt);
};

const logout = () => {
setToken(null);
};

Helpers to update the token. Calling "login" and "logout" both will update React state and via useEffect update storage.

return (
<AuthContext.Provider value={{ token, login,logout }>
{children}
</AuthContext.Provider>
)

We render the built-in Provider component passing our state and functions as the value.

export const useAuth = () => useContext(AuthContext);
A small wrapper so other components can simply do:
const { token, login, logout } = useAuth();

Problem: Props Drilling
Context API: (global state manager)
It allows you to share state or data globally in React Application without using Props.

Context API works in 4 steps:
Create a Context
Create a ContextProvider
User the ContextProvider
Consume the Context

Example:
Create the context:
// ThemeContext.js
import { createContext } from "react";

export const ThemeContext = createContext(null);

Create a Provider
// ThemeProvider.js
import { useState } from "react";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }) => {
const [theme, setTheme] = useState("light");

return (
<ThemeContext.Provider value={{ theme, setTheme }}>
{children}
</ThemeContext.Provider>
);
};

Use it in the app
// App.js
import { ThemeProvider } from "./ThemeProvider";
import Page from "./Page";

function App() {
return (
<ThemeProvider>
<Page />
</ThemeProvider>
);
}

Consume the context
// Page.js
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

function Page() {
const { theme, setTheme } = useContext(ThemeContext);

return (

<div>
<h1>Current theme: {theme}</h1>
<button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
Toggle Theme
</button>
</div>
);
}

TypeScript Concepts
const AuthContext = createContext<AuthContextType>({..})

The first mean, Generic Parameter. This tells TypeScript "our context value will always match the shape described by AuthContextType".
AuthContext is not a object with that shape. So we can not do "AuthContext:AuthContextType"

const [token, setToken]=useState<string|null>(()=>{return localStorage.getItem("token")})
<string | null> is a TypeScript generic telling React "this piece of state can hold either a string or null."

Why "const AuthContext: AuthContextType=createContext({...})" is wrong?
The second mean, AuthContext is an object shaped like AuthContextType but in reality createContext<T>() returns a React.Context<T>.
i.e. const AuthContext:React.Context<AuthContextType>=createContext<AuthContextType>()

React Router Dom
npm install react-router-dom
npm install --save-dev @types/react-router-dom

Wrap your application in main.tsx using "BrowserRouter"
<StrictMode>
<BrowserRouter>
<AuthProvider>
<App />
</AuthProvider>
</BrowserRouter>
</StrictMode>
BrowserRouter uses HTML5 History API under the hood to listen for changes to the URL. Without it, <Routes>, <Route>, <Link> cannot read or update the url.

Defining Routes
Key Words or Components: Routes > Route(path, element props), Navigate(props to)
<Routes>
<Route
path="/"
element={
token
? <Navigate to="/dashboard">
: <Navigate to="/login">
}

> </Routes>

Link component

<Link to="/login" className="text-blue-600 underline">
Log in
</Link>

Navigate
const navigate = useNavigate();
usage:
navigate("/dashboard)
