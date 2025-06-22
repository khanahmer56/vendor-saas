"use client";
import ColorSelector from "@/shared/colorselector";
import CustomProperties from "@/shared/custom-properties";
import CustomSpecification from "@/shared/custom-specification";
import ImagePlaceholder from "@/shared/ImagePlaceholder";
import Input from "@/shared/Input";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { set, useForm } from "react-hook-form";

const Dashboard = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [openImageModel, setOpenImageModel] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);
  const onSubmit = (data: any) => {};
  const handleImageChange = (file: File | null, index: number) => {
    const newImages = [...images];
    newImages[index] = file;
    if (index === images.length - 1 && images.length < 8) {
      newImages.push(null);
    }
    setImages(newImages);
    setValue(`images`, newImages);
  };
  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      if (index === -1) {
        newImages[0] = null;
      } else {
        newImages.splice(index, 1);
      }
      if (!newImages.includes(null) && newImages.length < 8) {
        newImages.push(null);
      }
      return newImages;
    });
    setValue(`images`, images);
  };
  return (
    <form
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl py-2 text-center text-white font-semibold mb-4">
        Create Product
      </h2>
      <div className="flex items-center">
        <span className="text-[#80Deea] ">Dashboard</span>
        <ChevronRight size={20} className="text-[#80Deea] mx-2 opacity-[0.8]" />
        <span className="text-white">Create Product</span>
      </div>
      <div className="py-4 w-full flex gap-6">
        <div className="md:w-[35%]">
          {images.length > 0 && (
            <ImagePlaceholder
              setOpenImageModel={setOpenImageModel}
              size="760 * 850"
              small={false}
              index={0}
              onImageChange={handleImageChange}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {images.slice(1).map((_, index) => (
            <ImagePlaceholder
              key={index}
              setOpenImageModel={setOpenImageModel}
              size="760 * 850"
              small
              index={index + 1}
              onImageChange={handleImageChange}
              onRemove={handleRemoveImage}
            />
          ))}
        </div>
        <div className="md:w-[65%]">
          <div className="mt-2">
            <Input
              label={"Product Title *"}
              placeholder="Enter Product Title"
              {...register("title", {
                required: "Product Title is required",
              })}
            />
            {errors.title && (
              <span className="text-red-500">
                {errors.title.message as string}
              </span>
            )}
          </div>

          <div className="mt-2">
            <Input
              type="textarea"
              rows={7}
              cols={10}
              label={"Description + 150 words"}
              placeholder="Enter Product Description"
              {...register("description", {
                required: "Description is required",
                validate: (value) => {
                  const wordCount = value.split(" ").length;
                  return (
                    wordCount >= 150 || "Description must be at least 150 words"
                  );
                },
              })}
            />
          </div>
          <div className="mt-2">
            <Input
              label={"Tags *"}
              placeholder="apple, samsung, iphone"
              {...register("tags", {
                required: "Separate tags by comma",
              })}
            />
            {errors.tags && (
              <span className="text-red-500">
                {errors.tags.message as string}
              </span>
            )}
          </div>
          <div className="mt-2">
            <Input
              label={"Warranty *"}
              placeholder="1 Year /No Warranty"
              {...register("warranty", {
                required: "Warranty is required",
              })}
            />
            {errors.warranty && (
              <span className="text-red-500">
                {errors.warranty.message as string}
              </span>
            )}
          </div>
          <div className="mt-2">
            <Input
              label={"Slug *"}
              placeholder="Enter Product Slug"
              {...register("slug", {
                required: "Slug is required",
              })}
            />
            {errors.slug && (
              <span className="text-red-500">
                {errors.slug.message as string}
              </span>
            )}
          </div>
          <div className="mt-2">
            <ColorSelector control={control} errors={errors} />
          </div>
          <div className="mt-2">
            <CustomSpecification control={control} errors={errors} />
          </div>
          <div className="mt-2">
            <CustomProperties control={control} errors={errors} />
          </div>
          <div className="mt-2">
            <label className="block font-semibold text-gray-300 mb-1">
              Cash On Delivery *
            </label>
            <select
              {...register("cash_on_delivery", {
                required: "Cash On Delivery is required",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-opacity-50 bg-gray-900"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {errors.cashOnDelivery && (
              <span className="text-red-500">
                {errors.cashOnDelivery.message as string}
              </span>
            )}
          </div>
        </div>
        <div>
          <label className="block font-semibold text-gray-300 mb-1">
            Category*
          </label>
        </div>
      </div>
    </form>
  );
};

export default Dashboard;
