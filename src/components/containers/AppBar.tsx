import { ComponentProps } from "react";

import headerImg from "@/assets/images/header-img.gif";
import titleImg from "@/assets/images/title-img.svg";
import ahogeImg from "@/assets/images/furina-ahoge.svg";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utility/utils";

const AppBar = () => {
  return (
    <header className="w-full bg-[#111a21] shadow">
      <div className="mx-auto max-w-5xl md:px-4 pt-6 md:py-4 flex flex-col md:flex-row items-center gap-4">
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
          <NavbarItem path="/treasures" title="Treasures‧₊˚" />
          <NavbarItem path="/toodle" title="Toodle-oo~" />
        </Navbar>
      </div>
    </header>
  );
};

const Navbar = ({ children }: ComponentProps<"div">) => {
  return (
    <nav className="md:flex-1 self-stretch md:self-center flex items-center px-2 md:px-0 md:justify-end md:gap-5 overflow-x-auto md:overflow-x-hidden">
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
    <Link
      to={path}
      className="group flex flex-shrink-0 items-center px-2 md:px-0 md:py-4 first:ml-auto last:mr-auto"
    >
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
          "text-white ml-2 md:ml-4 md:text-xl py-2 md:py-0 border-b-2 md:border-dotted group-hover:border-primary-500 border-transparent transition-all",
          isActive ? "border-primary-500 md:border-white" : ""
        )}
      >
        {title}
      </p>
    </Link>
  );
};

export default AppBar;
