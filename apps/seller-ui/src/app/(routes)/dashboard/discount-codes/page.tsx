"use client";
import Input from "@/shared/Input";
import axiosInstance from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Plus, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

const DiscountCodes = () => {
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      public_name: "",
      discountType: "percentage",
      discountValue: "",
      discountCode: "",
    },
  });
  const queryClient = useQueryClient();
  const { data: discountCodes = [] as any, isLoading } = useQuery({
    queryKey: ["shop-discount"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-discount-code");
      return res?.data?.discountCodes || [];
    },
  });
  const createDiscount = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post(
        "/product/api/create-discount-code",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-discount"] });
      reset();
      setShowModal(false);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: any) => {
      const res = await axiosInstance.delete(
        `/product/api/delete-discount-code/${id}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-discount"] });
    },
  });
  const handleDelete = async (id: any) => {
    deleteMutation.mutate(id);
    console.log("id", id);
  };
  const onSubmit = async (data: any) => {
    if (discountCodes.length >= 8) {
      toast.error("You can't create more than 8 discount codes");
      return;
    }
    createDiscount.mutate(data);
  };
  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-2xl text-white font-semibold">Discount Codes</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Create Discount
        </button>
      </div>
      <div className="flex items-center text-white">
        <Link href="/dashboard" className="text-[#80Deea] cursor-pointer">
          Dashboard
        </Link>
        <ChevronRight size={20} className="opacity-[0.8]" />
        <span>Create Product</span>
      </div>
      <div className="mt-8 bg-gray-900 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold text-white mb-6">
          Your Discount Codes
        </h3>

        {isLoading ? (
          <p className="text-gray-400 text-center py-8">Loading discounts...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="min-w-full divide-y divide-gray-800 text-sm">
              <thead className="bg-gray-800 text-gray-300 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Value</th>
                  <th className="px-6 py-3 text-left">Code</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-white">
                {discountCodes.map((discountCode: any) => (
                  <tr
                    key={discountCode.id}
                    className="hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4">{discountCode?.public_name}</td>
                    <td className="px-6 py-4 capitalize">
                      {discountCode.discountType === "percentage"
                        ? "Percentage"
                        : "Fixed"}
                    </td>
                    <td className="px-6 py-4">
                      {discountCode.discountType === "percentage"
                        ? `${discountCode?.discountValue}%`
                        : `₹${discountCode?.discountValue}`}
                    </td>
                    <td className="px-6 py-4">{discountCode?.discountCode}</td>

                    <td className="px-6 py-4">
                      <button
                        disabled={deleteMutation.isPending}
                        className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-md text-sm"
                        onClick={() => handleDelete(discountCode.id)}
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}

                {discountCodes.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-gray-400 py-6 italic"
                    >
                      No discount codes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-[450px] shadow-lg">
            <div className="flex justify-between items-center border-b border-gray-600 pb-3">
              <h3 className="text-gray-400 hover:text-white">
                Create Discount Code
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400"
              >
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 text-white">
              <Input
                label="Title (Public Name)"
                {...register("public_name", { required: "Title is required" })}
              />
              {errors.public_name && (
                <p className="text-red-500 text-sm">
                  {errors.public_name.message}
                </p>
              )}
              <div className="mt-4">
                <label className="block font-semibold text-gray-300 mb-1">
                  Discount Type
                </label>
                <Controller
                  control={control}
                  name="discountType"
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full p-2 borer outline-none rounded-md bg-transparent border border-gray-600  text-white"
                    >
                      <option value="percentage" className="text-black">
                        Percentage (%)
                      </option>
                      <option value="flat" className="text-black">
                        Flat Amount ($)
                      </option>
                    </select>
                  )}
                />
              </div>
              <div className="mt-4">
                <Input
                  label="Discount Value"
                  {...register("discountValue", {
                    required: "Discount value is required",
                  })}
                  type="text"
                  className="w-full p-2 borer outline-none rounded-md bg-transparent border border-gray-600  text-white"
                />
                {errors.discountValue && (
                  <p className="text-red-500 text-sm">
                    {errors.discountValue.message}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Discount Code"
                  {...register("discountCode", {
                    required: "Discount code is required",
                  })}
                />
                {errors.discountCode && (
                  <p className="text-red-500 text-sm">
                    {errors.discountCode.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={createDiscount.isPending}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 w-full rounded-md mt-4"
              >
                {createDiscount.isPending ? "Creating..." : "Create"}{" "}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCodes;
