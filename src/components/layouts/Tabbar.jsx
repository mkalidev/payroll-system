import React from "react";

import { NavLink, useLocation } from "react-router-dom";

export default function Tabbar({ slug, data }) {
  const { pathname } = useLocation();

  return (
    <div className="w-full relative">
      <div className="w-full overflow-x-auto bg-gray-100 rounded-lg px-4 py-2.5 flex gap-3 w-full border-b border-b-white/10">
        {data.map((item) => {
          const fullPath = `/workspace/${slug}/${item.link}`;
          const isActive = pathname === fullPath;
          return (
            <NavLink
              to={`/workspace/${slug}/${item.link}`}
              key={item.id}
              className="space-y-3"
            >
              {/* left indicator only if active */}
              <div
                aria-disabled={item.id === 4}
                onClick={(e) => {
                  if (item.id === 4) {
                    e.preventDefault();
                  }
                }}
                className={`flex items-center w-full h-[44px] px-3 gap-2 text-sm font-light cursor-pointer rounded-lg hover:opacity-60
                      ${isActive ? "bg-c-color text-white" : ""}`}
              >
                {item.icon}
                <span className="whitespace-nowrap">
                  {item.name} {item.id === 4 && "(Coimg soon)"}{" "}
                </span>
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
