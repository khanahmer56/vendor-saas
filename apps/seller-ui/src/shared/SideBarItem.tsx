import Link from "next/link";
import React from "react";

interface Props {
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
  href: string;
}
const SideBarItem = ({ icon, title, isActive, href }: Props) => {
  return (
    <Link href={href} className="my-2 block">
      <div
        className={`flex items-center gap-2 min-h-12 h-full px-[13px] rounded-lg cursor-pointer transition hover:bg-[#2b2f31] ${
          isActive && "scale-[0.98] bg-[#0f3158] fill-white hover:bg-[#0f3158]"
        }`}
      >
        {icon}
        <h5 className="text-lg text-slate-200">{title}</h5>
      </div>
    </Link>
  );
};

export default SideBarItem;
