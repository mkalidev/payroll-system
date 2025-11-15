import React, { useEffect, useRef, useState } from "react";
import { CgChevronDown } from "react-icons/cg";
import { useUser } from "../hooks/useUser";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useAuth";
import MobileSidebar from "./MobileSidebar";

export default function Navbar() {
  const [showOption, setShowOption] = useState(false);
  const [open, setOpen] = useState(false);
  const optionsRef = useRef(null);
  const { user } = useUser();
  const { logoutFn } = useLogout();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOption(false);
      }
    };

    if (showOption) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOption]);

  const handleKebabClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowOption(!showOption);
  };

  return (
    <>
      <div className="w-full mx-auto py-5 bg-white sticky top-0 z-10 border-b border-black/10 h-fit md:h-[85.12px]">
        <div className="mx-auto px-4 md:px-6 flex items-center h-full justify-between max-w-[1280px]">
          <Link to="/">
            <p className="font-semibold text-[16px] md:text-[20px]">
              Welcome,{" "}
              <span className="text-c-color capitalize">{user?.username}</span>
            </p>
          </Link>
          <div className="block md:hidden" onClick={() => setOpen(!open)}>
            <GiHamburgerMenu size={24} />
          </div>
          <div
            className="hidden md:flex items-center gap-3 relative cursor-pointer"
            onClick={handleKebabClick}
          >
            <div className="w-12 h-12 rounded-full bg-c-color overflow-hidden">
              <img src={user?.avatar} alt="" />
            </div>
            <div className="space-y-0">
              <p className="text-sm font-semibold capitalize">
                {user?.fullName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <CgChevronDown />
            {showOption && (
              <div
                ref={optionsRef}
                className="absolute top-17 right-0 z-100 w-[200px] min-h-20 bg-white shadow-md overflow-hidden"
              >
                <Link to="settings">
                  <div
                    className="p-3 w-full hover:bg-black/10 cursor-pointer"
                    onClick={() => setShowOption(false)}
                  >
                    Settings
                  </div>
                </Link>
                <div
                  className="p-3 text-red-500 w-full hover:bg-black/10 cursor-pointer"
                  onClick={logoutFn}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {open && <MobileSidebar setOpen={setOpen} />}
    </>
  );
}
