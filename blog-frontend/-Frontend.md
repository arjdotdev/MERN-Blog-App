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
