import axiosInstance from "@/utils/axiosinstance";
import { useQuery } from "@tanstack/react-query";

const fetchUser = async () => {
  const { data } = await axiosInstance.get("/get-user");
  console.log("ahmer", data);

  return data?.user;
};
const useUser = () => {
  console.log("hii");
  const {
    data: user,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
  return {
    user,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  };
};

export default useUser;
