import React, { useState } from "react";
import Account from "../components/features/settings/Account";
import Security from "../components/features/settings/Security";

const settingsData = [
  {
    id: 1,
    name: "Account",
    component: <Account />,
  },
  // {
  //   id: 2,
  //   name: "Verify",
  //   component: "",
  // },
  {
    id: 3,
    name: "Security",
    component: <Security />,
  },
  // {
  //   id: 4,
  //   name: "Preferences",
  //   component: "",
  // },
];

export default function Settings() {
  const [activeTabId, setActiveTabId] = useState(settingsData[0].id);
  const activeTab = settingsData.find((tab) => tab.id === activeTabId);

  return (
    <div className="w-full space-y-5">
      <p className="font-bold text-xl">Settings</p>
      <div className="flex gap-4 items-center overflow-x-auto w-full p-4 bg-white rounded-lg">
        {settingsData.map((item) => {
          const isActive = item.id === activeTabId;
          return (
            <div key={item.id} className="">
              <button
                onClick={() => setActiveTabId(item.id)}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg hover:opacity-70 cursor-pointer transition ${
                  isActive ? "bg-c-color text-white" : ""
                }`}
              >
                <span className="">{item.name}</span>
              </button>
            </div>
          );
        })}
      </div>
      <div className="space-y-6 p-6 rounded-lg min-h-[360px] bg-white gap-5 w-full">
        <div className="">{activeTab?.component}</div>
      </div>
    </div>
  );
}
