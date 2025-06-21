import { shopCategories } from "@/app/utils/categories";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";

const CreateShop = ({
  sellerId,
  setActiveStep,
}: {
  sellerId: string;
  setActiveStep: (step: number) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const shopCreateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/create-shop`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      setActiveStep(3);
    },
  });
  const onSubmit = async (data: any) => {
    const shopData = {
      ...data,
      sellerId: sellerId,
    };
    shopCreateMutation.mutate(shopData);
  };
  const countWords = (text: string) => text.trim().split(/\s+/).length;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-2xl font-semibold text-center mb-4">
          SetUp new Shop
        </h3>
        <label className="block text-gray-700 mb-1">Name *</label>
        <input
          type="text"
          {...register("name", {
            required: "Name is required",
          })}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
        )}
        <label className="block text-gray-700 mb-1">Bio *</label>
        <input
          type="text"
          {...register("bio", {
            required: "Bio is required",
            validate: (value) =>
              countWords(value) <= 100 || "Bio must be less than 100 words",
          })}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        {errors.bio && (
          <p className="text-red-500 text-sm">{String(errors.bio.message)}</p>
        )}
        <label className="block text-gray-700 mb-1">Opening Hours</label>
        <input
          type="text"
          {...register("opening_hours")}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label className="block text-gray-700 mb-1">Address *</label>
        <input
          type="text"
          {...register("address", {
            required: "Address is required",
          })}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        {errors.address && (
          <p className="text-red-500 text-sm">
            {String(errors.address.message)}
          </p>
        )}
        <label className="block text-gray-700 mb-1">Website</label>
        <input
          type="text"
          {...register("website")}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        {errors.website && (
          <p className="text-red-500 text-sm">
            {String(errors.website.message)}
          </p>
        )}
        <label className="block text-gray-700 mb-1">Categories *</label>
        <select
          className="w-full p-2 border border-gray-300 rounded mb-4"
          {...register("category")}
        >
          <option value="">Select a category</option>
          {shopCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.value}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm">
            {String(errors.category.message)}
          </p>
        )}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Create Shop
        </button>
      </form>
    </div>
  );
};

export default CreateShop;
