import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchSeller = async () => {
  const { data } = await axiosInstance.get("/get-seller-details");
  console.log("ahmer", data);

  return data?.seller;
};
const useSeller = () => {
  const {
    data: seller,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["seller"],
    queryFn: fetchSeller,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
  return {
    seller,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  };
};

export default useSeller;
