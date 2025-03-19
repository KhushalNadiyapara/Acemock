"use client"
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const Header = () => {
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, []);

  return (
    <div className="flex items-center justify-between bg-secondary shadow-md rounded-full px-6 py-3 max-w-6xl mx-auto mt-4">
      {/* Logo on the Left */}
      <Image src="/logo.svg" width={140} height={80} alt="logo" />

      {/* Navigation Centered */}
      <ul className="hidden md:flex gap-8">
        <li
          className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer ${
            path === "/dashboard" ? "text-purple-500 font-bold" : "text-gray-800 dark:text-gray-200"
          }`}
        >
          Dashboard
        </li>
        <li
          className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer ${
            path === "/dashboard/how" ? "text-purple-500 font-bold" : "text-gray-800 dark:text-gray-200"
          }`}
        >
          How it works?
        </li>
      </ul>

      {/* User Button on the Right */}
      <UserButton />
    </div>
  );
};

export default Header;
