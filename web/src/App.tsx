import React, { useEffect } from "react";
import {
	BrowserRouter,
	Navigate,
	Outlet,
	Route,
	Routes,
	useLocation,
	useParams,
} from "react-router-dom";
import { User } from "./lib/store";
import { useAtomValue, useSetAtom } from "jotai";
const Home = React.lazy(() => import("./pages/Home"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Contacts = React.lazy(() => import("./pages/Contacts"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Chat = React.lazy(() => import("./pages/Chat"));
import { GET } from "./lib/fetch";
import { useQuery } from "@tanstack/react-query";
import { socket } from "./lib/socket";
const Topbar = React.lazy(() => import("./components/Topbar"));
const Sidebar = React.lazy(() => import("./components/Sidebar"));

function RequireAuth() {
	const user: User = useAtomValue(User);
	const location = useLocation();
	const { chatId } = useParams<{ chatId: string }>();

	if (!user) {
		return <Navigate to="/login" state={{ from: location }} />;
	}

	return (
		<div className="w-full h-full flex gap-2">
			<div className={`md:w-[30%] ${chatId ? "hidden md:block" : "w-full"}`}>
				<Outlet />
			</div>
			<Chat className={`flex-1 mr-2 ${!chatId ? "hidden md:block" : ""}`} />
		</div>
	);
}

function AuthRoute() {
	const user = useAtomValue(User);

	if (user) {
		return <Navigate to="/" />;
	}

	return <Outlet />;
}

function Navbar() {
	const location = useLocation();
	return (
		location.pathname !== "/login" &&
		location.pathname !== "/register" && (
			<>
				{/* Desktop sidebar - left side */}
				<aside className="hidden md:flex w-20 flex-col border-r border-b bg-background rounded-lg">
					<Sidebar />
				</aside>
				{/* Mobile navbar - bottom */}
				<nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t">
					<Sidebar />
				</nav>
			</>
		)
	);
}

function App() {
	const setUser: any = useSetAtom(User as any);
	const { data: user, error } = useQuery({
		queryKey: ["me"],
		queryFn: () => GET("http://localhost:5000/me"),
	});
	useEffect(() => {
		if (user) {
			setUser(user);
		}

		if (error) {
			setUser(null);
		}

		return () => {
			setUser(null);
		};
	}, [user, setUser, error]);

	useEffect(() => {
		if (user && !socket.connected) {
			socket.connect();
		} else if (!user && socket.connected) {
			socket.disconnect();
		}
	}, [user]);

	return (
		<React.Suspense fallback={<div>Loading...</div>}>
			<div className="min-h-screen w-full bg-muted/40 flex flex-col gap-2">
				<BrowserRouter>
					<Topbar />
					<div className="w-full flex gap-2 flex-1 pb-20 md:pb-4">
						<Navbar />
						<div className="w-full min-h-full">
							<Routes>
								<Route element={<RequireAuth />}>
									<Route
										path="/"
										element={<Navigate to="/chat" />}
									/>
									<Route path="/chat" element={<Home />} />
									<Route path="/chat/:chatId" element={<Home />} />
									<Route path="/me" element={<Profile />} />
									<Route
										path="/contacts"
										element={<Contacts />}
									/>
									<Route
										path="/settings"
										element={<Settings />}
									/>
								</Route>
								<Route element={<AuthRoute />}>
									<Route path="/login" element={<Login />} />
									<Route
										path="/register"
										element={<Register />}
									/>
								</Route>
								<Route path="*" element={<Navigate to="/" />} />
							</Routes>
						</div>
					</div>
				</BrowserRouter>
			</div>
		</React.Suspense>
	);
}

export default App;
