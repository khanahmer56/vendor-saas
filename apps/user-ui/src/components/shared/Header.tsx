"use client";
import Link from "next/link";
import React from "react";
import { HeartIcon, Search, ShoppingCart, User } from "lucide-react";
import HeaderBottom from "./HeaderBottom";
import useUser from "@/hooks/useUser";

const Header = () => {
  const { user, isLoading } = useUser();
  return (
    <div className="w-full bg-white">
      <div className="w-[80%] py-5 m-auto flex items-center justify-between">
        <div>
          <Link href="/">
            <span className="text-2xl font-bold">E Cart</span>
          </Link>
        </div>
        <div className="w-[50%] relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="w-[60px] cursor-pointer flex items-center justify-center absolute right-0 top-0 h-full bg-blue-500 rounded-r-full">
            <Search color="#fff" />
          </div>
        </div>
        {!isLoading && user && (
          <>
            <Link
              href="/login"
              className="border-2 w-[50px] h-[50px] rounded-full border-[#e5e7eb] flex items-center justify-center"
            >
              <User />
            </Link>
            <Link href={"/login"}>
              <span className="block font-medium">Hello,</span>
              <span className="font-semibold">{user?.name}</span>
            </Link>
          </>
        )}

        <div className="flex items-center gap-5">
          <Link href="/whishlist" className="relative">
            <HeartIcon />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1">
              3
            </span>
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingCart />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1">
              3
            </span>
          </Link>
        </div>
      </div>
      <div className="border-b border-gray-300" />
      <HeaderBottom />
    </div>
  );
};

export default Header;
