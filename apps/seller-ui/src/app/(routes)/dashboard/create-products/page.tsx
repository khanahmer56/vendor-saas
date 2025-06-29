"use client";
import ColorSelector from "@/shared/colorselector";
import CustomProperties from "@/shared/custom-properties";
import CustomSpecification from "@/shared/custom-specification";
import ImagePlaceholder from "@/shared/ImagePlaceholder";
import Input from "@/shared/Input";
import RichTextEditor from "@/shared/rich-text-editor";
import SizeSelector from "@/shared/size-selector";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Circle } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";

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
  const [isChanged, setIsChanged] = useState(true);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/product/api/get-product");
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
  console.log("dataa", data);
  const categories = data?.categories || [];
  const subCategories = data?.subCategories || [];
  const selectedCategory = watch("category");
  const regularPrice = watch("regular_price");
  const subcategoriesData = useMemo(() => {
    if (selectedCategory) {
      return subCategories[selectedCategory] || [];
    }
    return [];
  }, [selectedCategory, subCategories]);
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
  const { data: discountCodes = [] as any, isLoading: isDiscountLoading } =
    useQuery({
      queryKey: ["shop-discount"],
      queryFn: async () => {
        const res = await axiosInstance.get("/product/api/get-discount-code");
        return res?.data?.discountCodes || [];
      },
    });
  console.log("discountCodes", discountCodes);
  const handleSavedDraft = () => {};
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
        <div className="md:w-[35%]">
          <label className="block font-semibold text-gray-300 mb-1">
            Category*
          </label>
          {isLoading ? (
            <Circle className="animate-spin" />
          ) : isError ? (
            <p className="text-red-500">Failed to fetch categories</p>
          ) : (
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none bg-gray-900"
                >
                  <option value="" className="bg-black">
                    Select Category
                  </option>
                  {categories.map((category: string) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-black"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              )}
            />
          )}
          {errors.category && (
            <span className="text-red-500">
              {errors.category.message as string}
            </span>
          )}
          <div className="mt-2">
            <label className="block font-semibold text-gray-300 mb-1">
              SubCategory*
            </label>
            <Controller
              name="subCategory"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none bg-gray-900"
                >
                  <option value="" className="bg-black">
                    Select Category
                  </option>
                  {subcategoriesData.map((category: string) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-black"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.subCategory && (
              <span className="text-red-500">
                {errors.subCategory.message as string}
              </span>
            )}
            <div className="mt-2">
              <label>Detailed Description* (Min 100 words)</label>
              <Controller
                name="detailed_description"
                control={control}
                rules={{
                  required: "Description is required",
                  validate: (value) => {
                    const wordCount = value.split(" ").length;
                    return (
                      wordCount >= 100 ||
                      "Description must be at least 100 words"
                    );
                  },
                }}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.detailed_description && (
                <span className="text-red-500">
                  {errors.detailed_description.message as string}
                </span>
              )}
            </div>
            <div className="mt-2">
              <Input
                label="Video Url"
                type="text"
                {...register("video_url")}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              />
              {errors.video_url && (
                <span className="text-red-500">
                  {errors.video_url.message as string}
                </span>
              )}
              <div className="mt-2">
                <Input
                  label="Regular Price*"
                  placeholder="0.00$"
                  {...register("regular_price", {
                    min: {
                      value: 1,
                      message: "Regular Price must be at least 1.00$",
                    },
                    validate: (value) => {
                      const regex = /^[0-9]+(\.[0-9]{1,2})?$/;
                      return (
                        regex.test(value) ||
                        "Regular Price must be a valid number"
                      );
                    },
                  })}
                />
                {errors.regular_price && (
                  <span className="text-red-500">
                    {errors.regular_price.message as string}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Sales Price"
                  placeholder="0.00$"
                  {...register("sales_price", {
                    validate: (value) => {
                      const regex = /^[0-9]+(\.[0-9]{1,2})?$/;
                      return (
                        regex.test(value) ||
                        "Sales Price must be a valid number"
                      );
                    },
                  })}
                />
                {errors.sales_price && (
                  <span className="text-red-500">
                    {errors.sales_price.message as string}
                  </span>
                )}
                <div></div>
              </div>
              <div className="mt-2">
                <Input
                  label="Stock Price"
                  placeholder="0.00$"
                  {...register("stock_price", {
                    min: {
                      value: 1,
                      message: "Stock Price must be at least 1.00$",
                    },
                    max: {
                      value: 1000,
                      message: "Stock Price must be at most 1000.00$",
                    },
                  })}
                />
                {errors.stock_price && (
                  <span className="text-red-500">
                    {errors.stock_price.message as string}
                  </span>
                )}
                <div className="mt-2">
                  <SizeSelector control={control} errors={errors} />
                </div>
                <div className="mt-3">
                  <label className="block font-semibold text-gray-300 mb-1">
                    Select Discount Codes (optional)
                  </label>
                  {isDiscountLoading ? (
                    <p className="text-gray-400">Loading discount codes...</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {discountCodes?.map(
                        (
                          code: { id: string; discountCode: string },
                          index: number
                        ) => {
                          const selected = (
                            watch("discountCodes") || []
                          ).includes(code.id);

                          return (
                            <button
                              key={code.id}
                              type="button"
                              className={`px-4 py-2 rounded-md transition-colors ${
                                selected
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-800 text-white hover:bg-gray-700"
                              }`}
                              onClick={() => {
                                const currentSelection: string[] =
                                  watch("discountCodes") || [];
                                const updatedSelection = selected
                                  ? currentSelection.filter(
                                      (id) => id !== code.id
                                    )
                                  : [...currentSelection, code.id];

                                setValue("discountCodes", updatedSelection);
                              }}
                            >
                              {code.discountCode}
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              {isChanged && (
                <button
                  type="submit"
                  onClick={handleSavedDraft}
                  className="bg-green-600 px-4 py-2 rounded-md"
                >
                  Save Draft
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-600 px-4 py-2 rounded-md"
              >
                {loading ? "Creating" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Dashboard;
