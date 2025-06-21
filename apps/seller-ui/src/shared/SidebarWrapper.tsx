"use client";
import useSeller from "@/hooks/useSeller";
import useSideBar from "@/hooks/useSidebar";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import Box from "./box";
import Link from "next/link";
import SideBarMenu from "./SideBarMenu";
import SideBarItem from "./SideBarItem";
import {
  BellPlusIcon,
  BellRing,
  CalendarPlus,
  Home,
  Inbox,
  ListOrdered,
  Menu,
  PackageSearch,
  PyramidIcon,
  Settings,
  SquarePlus,
  TicketPercent,
} from "lucide-react";

interface Props {
  title: string;
  children: ReactNode;
}

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSideBar();
  const pathname = usePathname();
  const { seller } = useSeller();
  console.log("Seller in sidebar wrapper", seller);
  const getIconColor = (path: string) => {
    if (activeSidebar === path) {
      return "text-white";
    }
    return "text-slate-400 hover:text-white";
  };
  useEffect(() => {
    setActiveSidebar(pathname);
  }, [pathname, setActiveSidebar]);

  return (
    <Box
      css={{
        width: "100%",
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        padding: "8px",
        top: "0",
        overflowY: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <Box>
        <Link href="/" className="flex justify-center items-center gap-2 mb-4">
          {/* logo */}
          <Box>
            <h3 className="text-xl text-slate-200">{seller?.shop?.name}</h3>
            <h5 className="text-xs text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis">
              {seller?.shop?.address}
            </h5>
          </Box>
        </Link>
      </Box>
      <div className="mt-2 block">
        <SideBarItem
          isActive={activeSidebar === "/dashboard"}
          title="Dashboard"
          href="/dashboard"
          icon={<Home className={getIconColor("/dashboard")} size={20} />}
        />
        <div className="mt-2 block">
          <SideBarMenu title="Main Menu">
            <SideBarItem
              isActive={activeSidebar === "/dashboard/order"}
              title="Orders"
              href="/order"
              icon={
                <ListOrdered
                  className={getIconColor("/dashboard/order")}
                  size={24}
                />
              }
            />
            <SideBarItem
              isActive={activeSidebar === "/dashboard/payments"}
              title="Payments"
              href="/dashboard/payments"
              icon={
                <PyramidIcon
                  className={getIconColor("/dashboard/payments")}
                  size={24}
                />
              }
            />
          </SideBarMenu>
          <SideBarMenu title="Products">
            <SideBarItem
              isActive={activeSidebar === "/dashboard/create-product"}
              title="Create Products"
              href="/dashboard/create-products"
              icon={
                <SquarePlus
                  className={getIconColor("/dashboard/create-products")}
                  size={24}
                />
              }
            />

            <SideBarItem
              isActive={activeSidebar === "/dashboard/all-products"}
              title="All Products"
              href="/dashboard/all-products"
              icon={
                <PackageSearch
                  className={getIconColor("/dashboard/all-products")}
                  size={24}
                />
              }
            />
          </SideBarMenu>
          <SideBarMenu title="Events">
            <SideBarItem
              isActive={activeSidebar === "/dashboard/events"}
              title="Create Events"
              href="/dashboard/create-event"
              icon={
                <CalendarPlus
                  className={getIconColor("/dashboard/create-events")}
                  size={24}
                />
              }
            />
            <SideBarItem
              isActive={activeSidebar === "/dashboard/all-events"}
              title="All Events"
              href="/dashboard/all-events"
              icon={
                <BellPlusIcon
                  className={getIconColor("/dashboard/all-events")}
                  size={24}
                />
              }
            />
          </SideBarMenu>
          <SideBarMenu title="Controllers">
            <SideBarItem
              isActive={activeSidebar === "/dashboard/inbox"}
              title="Inbox"
              href="/dashboard/inbox"
              icon={
                <Inbox className={getIconColor("/dashboard/inbox")} size={24} />
              }
            />
            <SideBarItem
              isActive={activeSidebar === "/dashboard/settings"}
              title="Settings"
              href="/dashboard/settings"
              icon={
                <Settings
                  className={getIconColor("/dashboard/settings")}
                  size={24}
                />
              }
            />
            <SideBarItem
              isActive={activeSidebar === "/dashboard/notifications"}
              title="Notifications"
              href="/dashboard/notifications"
              icon={
                <BellRing
                  className={getIconColor("/dashboard/notifications")}
                  size={24}
                />
              }
            />
          </SideBarMenu>
          <SideBarMenu title="Extras">
            <SideBarItem
              isActive={activeSidebar === "/dashboard/discount-codes"}
              title="Discount Codes"
              href="/dashboard/discount-codes"
              icon={
                <TicketPercent
                  className={getIconColor("/dashboard/discount-codes")}
                  size={24}
                />
              }
            />
          </SideBarMenu>
        </div>
      </div>
    </Box>
  );
};

export default SidebarWrapper;
