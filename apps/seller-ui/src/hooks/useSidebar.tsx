import { activeSidebarItem } from "@/config/constants";
import { useAtom } from "jotai";
const useSideBar = () => {
  const [activeSidebar, setActiveSidebar] = useAtom(activeSidebarItem);
  return {
    activeSidebar,
    setActiveSidebar,
  };
};

export default useSideBar;
