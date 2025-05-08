"use client";
import { navItems } from "@/configs/constants";
import { AlignLeft, ChevronDown, HeartIcon, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  console.log("isSticky", isSticky);
  return (
    <div
      className={`w-full transition-all duration-300  ${
        isSticky ? "fixed top-0 left-0 z-50 shadow-lg bg-white" : "relative"
      }`}
    >
      <div
        className={`w-[80%] relative m-auto flex items-center justify-between ${
          isSticky ? "py-3" : "py-5"
        }`}
      >
        <div
          className={`w-[260px] ${
            isSticky && "-mb-2"
          } cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#3489fa] rounded-full`}
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-2">
            <AlignLeft color="#fff" />
            <span className="text-white font-medium">All Department</span>
          </div>
          <ChevronDown
            color="#fff"
            className={
              show
                ? "rotate-180 transition-all duration-300"
                : "rotate-0 transition-all duration-300"
            }
          />
        </div>
        {show && (
          <div
            className={`w-[260px] absolute ${
              isSticky ? "top-[76px]" : "top-0"
            } top-full left-0 mt-1 bg-white rounded-md shadow-md`}
          >
            <ul>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Electronics
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Fashion
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Home & Kitchen
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Sports & Outdoors
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Beauty & Personal Care
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Books
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Toys & Games
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Automotive
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Health & Wellness
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Grocery & Gourmet Food{" "}
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Pet Supplies
              </li>
            </ul>
          </div>
        )}
        <div className="flex items-center gap-5">
          {navItems.map((item: NavItemsType, index) => (
            <Link
              key={index}
              href={item.href}
              className="px-5 font-medium text-lg"
            >
              <span className="text-gray-600 font-medium hover:text-blue-500">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
        {isSticky && (
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
        )}
      </div>
    </div>
  );
};

export default HeaderBottom;
