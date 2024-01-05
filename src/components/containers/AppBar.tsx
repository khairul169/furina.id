import { ComponentProps } from "react";

import headerImg from "@/assets/images/header-img.gif";
import titleImg from "@/assets/images/title-img.svg";
import ahogeImg from "@/assets/images/furina-ahoge.svg";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utility/utils";

const AppBar = () => {
  return (
    <header className="w-full bg-[#111a21] shadow">
      <div className="container py-8 md:py-4 flex flex-col md:flex-row items-center gap-4">
        <Link
          to="/"
          className="flex flex-col md:flex-row items-center gap-2 md:gap-4"
        >
          <img
            src={headerImg}
            alt="Furina gif by u/Quit-Creative"
            className="h-12 md:h-16"
          />
          <img src={titleImg} alt="Furina" className="h-6 md:h-10" />
        </Link>

        <Navbar>
          <NavbarItem path="/" title="Pet the Furina" />
          <NavbarItem path="/furina-beloved" title="Shrimp" />
        </Navbar>
      </div>
    </header>
  );
};

const Navbar = ({ children }: ComponentProps<"div">) => {
  return (
    <nav className="flex-1 flex items-center justify-end gap-3 md:gap-5 overflow-x-auto md:overflow-x-hidden">
      {children}
    </nav>
  );
};

type NavbarItemProps = {
  path: string;
  title: string;
  isExact?: boolean;
};

const NavbarItem = ({ path, title, isExact = true }: NavbarItemProps) => {
  const { pathname } = useLocation();
  const isActive = isExact ? pathname === path : pathname.startsWith(path);

  return (
    <Link to={path} className="group flex items-center md:py-4">
      <img
        src={ahogeImg}
        alt="ahoge"
        className={cn(
          "h-4 md:h-6 group-hover:-scale-x-100 transition-transform",
          isActive ? "-scale-x-100" : ""
        )}
      />

      <p
        className={cn(
          "text-white ml-2 md:ml-4 md:text-xl border-b-2 border-dotted group-hover:border-white/80 border-transparent transition-all",
          isActive ? "border-white" : ""
        )}
      >
        {title}
      </p>
    </Link>
  );
};

export default AppBar;
