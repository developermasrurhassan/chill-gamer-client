import { Outlet } from "react-router";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { UseTheme } from "../ThemeControl/ThemeContext";

const MainLayout = () => {

    const { isDark } = UseTheme();

    return (
        <div className={isDark ? "bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 " : ""} >
            <header className="">
                <Header></Header>
            </header>
            <main>
                <section className="max-w-7xl mx-auto">
                    <Outlet></Outlet>
                </section>
            </main>
            <footer>
                <Footer></Footer>
            </footer>
        </div >
    );
};

export default MainLayout;