import Home from "./pages/home/Home.tsx";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router";
import UserList from "./pages/users/UserList.tsx";
import PetsList from "./pages/pets/PetsList.tsx";
import Header from "./components/header/Header.tsx";
import SideMenu from "./components/side-menu/SideMenu.tsx";
import Login from "./pages/login/Login.tsx";
import {useEffect, useState} from "react";
import {Toaster} from "react-hot-toast";
import PetDetails from "./pages/pets/PetDetails.tsx";

export default function App() {
    const Layout = () => {
        const [isCollapsed, setIsCollapsed] = useState(false);
        const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
        const [theme, setTheme] = useState("light");

        useEffect(() => {
            const savedTheme = localStorage.getItem("theme");
            const html = document.documentElement;

            if (savedTheme) {
                html.classList.add(savedTheme);
                html.classList.remove(savedTheme === "dark" ? "light" : "dark");
                setTheme(savedTheme);
            } else {
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const defaultTheme = prefersDark ? "dark" : "light";
                html.classList.add(defaultTheme);
                html.classList.remove(defaultTheme === "dark" ? "light" : "dark");
                setTheme(defaultTheme);
            }
        }, []);

        const toggleTheme = () => {
            const html = document.documentElement;
            if (theme === "dark") {
                html.classList.remove("dark");
                html.classList.add("light");
                localStorage.setItem("theme", "light");
                setTheme("light");
            } else {
                html.classList.remove("light");
                html.classList.add("dark");
                localStorage.setItem("theme", "dark");
                setTheme("dark");
            }
        };

        return (
            <>
                <div className={"main"}>
                    <Header
                        collapsed={isCollapsed}
                        onToggleCollapse={() => setIsCollapsed(v => !v)}
                        onOpenMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        onThemeToggle={() => toggleTheme()}
                        theme={theme}
                    />
                    <div className={"container"}>
                        <div className={"side-menu-container"}>
                            <SideMenu
                                collapsed={isCollapsed}
                                mobileOpen={isMobileMenuOpen}
                                onCloseMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            />
                        </div>
                        <div className={`content-container transition-all duration-300 ease-in-out ${isCollapsed ? 'px-2 lg:px-20 py-8' : 'px-2 lg:px-12 py-8'}`}>
                            <Outlet/>
                        </div>
                    </div>
                    {/*<Footer/>*/}
                    <Toaster/>
                </div>
            </>
        );
    }

    return (
        <>
            <RouterProvider router={createBrowserRouter([
                {
                    path: "/",
                    element: <Layout/>,
                    children: [
                        {
                            path: "/",
                            element: <Home/>,
                        },
                        {
                            path: "/users",
                            element: <UserList/>
                        },
                        {
                            path: "/pets",
                            element: <PetsList/>
                        },
                        {
                            path: "/pets/:id",
                            element: <PetDetails/>
                        }
                    ]
                },
                {
                    path: "/login",
                    element: <Login/>
                }
            ])}/>
        </>
    )
}