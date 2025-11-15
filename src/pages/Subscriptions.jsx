import { ChevronRight } from "lucide-react";
import React from "react";
import { GoCheckCircleFill, GoStarFill } from "react-icons/go";

export default function Subscriptions() {
  return (
    <div className="w-full bg-white p-3 md:p-8 rounded-lg">
      <div className="flex flex-col gap-4 items-center justify-center w-full">
        <h1 className="text-2xl font-semibold mb-4">Subscriptions</h1>
        <div className="px-5 py-2 border border-gray-200 bg-gray-50 rounded-md text-xs font-medium">
          Yearly
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-6 w-full">
          <div className="space-y-0 w-sm">
            <div className="border border-black/5 p-4 rounded-2xl relative z-10 bg-white">
              <div className="w-full space-y-5">
                <div className="flex items-top justify-between gap-5">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-semibold">Startup Plan</h2>
                    <p className="text-gray-400 text-sm font-light">
                      Essential payroll features for small teams
                    </p>
                  </div>
                  <div className="flex items-center">
                    <GoStarFill className="w-5 h-5 text-c-color" />
                  </div>
                </div>
                <hr className="border-black/5" />
                <div className="space-y-2">
                  <p className="font-semibold">Includes</p>
                  <div className="flex gap-3 items-center">
                    <div className="text-c-color">
                      <GoCheckCircleFill size={20} />
                    </div>
                    <p className="text-gray-600 text-sm">Payroll Management</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="text-c-color">
                      <GoCheckCircleFill size={20} />
                    </div>
                    <p className="text-gray-600 text-sm">
                      Tax calculations and filings
                    </p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="text-c-color">
                      <GoCheckCircleFill size={20} />
                    </div>
                    <p className="text-gray-600 text-sm">
                      Employee self-service portal
                    </p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="text-c-color">
                      <GoCheckCircleFill size={20} />
                    </div>
                    <p className="text-gray-600 text-sm">
                      Add up to 20 employees
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-0">
                  <p className="font-bold text-[32px]">$179</p>
                  <p className="text-gray-400 -mt-1 text-xs font-light">
                    per year
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full px-4 pt-14 pb-4 rounded-b-3xl -mt-10 bg-c-color">
              <button className="w-full px-3 py-2 rounded-lg cursor-pointer text-white font-medium text-sm hover:text-white/70 flex items-center justify-between">
                Subscribe here
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="space-y-0 w-sm">
            <div className="border border-black/5 p-4 rounded-2xl relative z-10 bg-white">
              <div className="w-full space-y-5">
                <div className="flex items-top justify-between gap-5">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-semibold">Enterprise Plan</h2>
                    <p className="text-gray-400 text-sm font-light">
                      Basic features
                    </p>
                  </div>
                  <div className="flex items-center">
                    <GoStarFill className="w-5 h-5 text-c-color" />
                  </div>
                </div>
                <hr className="border-black/5" />
                <div className="space-y-2">
                  <p className="font-semibold">Includes</p>
                  <div className="flex gap-3 items-center">
                    <div className="text-c-color">
                      <GoCheckCircleFill size={20} />
                    </div>
                    <p className="text-gray-600 text-sm">Payroll Management</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="text-c-color">
                      <GoCheckCircleFill size={20} />
                    </div>
                    <p className="text-gray-600 text-sm">
                      Multi-state tax compliance
                    </p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="text-c-color">
                      <GoCheckCircleFill size={20} />
                    </div>
                    <p className="text-gray-600 text-sm">
                      Dedicated account manager
                    </p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="text-c-color">
                      <GoCheckCircleFill size={20} />
                    </div>
                    <p className="text-gray-600 text-sm">
                      Add unlimited employees
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-0">
                  <p className="font-bold text-[32px]">$1,049</p>
                  <p className="text-gray-400 -mt-1 text-xs font-light">
                    per year
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full px-4 pt-14 pb-4 rounded-b-3xl -mt-10 bg-c-color">
              <button className="w-full px-3 py-2 rounded-lg cursor-pointer text-white font-medium text-sm hover:text-white/70 flex items-center justify-between">
                Subscribe here
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
