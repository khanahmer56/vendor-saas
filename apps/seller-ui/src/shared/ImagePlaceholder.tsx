import { Pencil, WandSparkles, X } from "lucide-react";
import React, { useState } from "react";

const ImagePlaceholder = ({
  size,
  small,
  onImageChange,
  onRemove,
  defaultImage = null,
  index = null,
  setOpenImageModel,
}: {
  size?: string;
  small?: boolean;
  onImageChange?: Function;
  onRemove?: Function;
  defaultImage?: string | null;
  index?: number | null;
  setOpenImageModel?: Function;
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultImage || null
  );
  const [isChanged, setIsChanged] = useState(false);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onImageChange && onImageChange(file, index);
    }
  };

  return (
    <div
      className={`relative ${
        small ? "h-[180px]" : "h-[450px]"
      } cursor-pointer bg-[#1e1e1e] border border-gray-600 flex flex-col items-center justify-center rounded-lg`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        id={`image-upload-${index}`}
        className="hidden"
      />
      {imagePreview ? (
        <>
          <button
            type="button"
            onClick={() => onRemove?.(index!)}
            className="absolute top-2 right-2 z-10 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <X />
          </button>
          <button
            className="absolute top-2 left-2 z-10 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            onClick={() => setOpenImageModel && setOpenImageModel(true)}
          >
            <WandSparkles size={16} />
          </button>
        </>
      ) : (
        <label
          htmlFor={`image-upload-${index}`}
          className="absolute top-3 right-3 p-2 !rounded bg-red-500"
        >
          <Pencil size={16} />
        </label>
      )}
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="image"
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <>
          <p
            className={`text-gray-400 ${
              small ? "text-xl" : "text-4xl"
            } font-semibold`}
          ></p>
          <p
            className={`text-gray-400 ${
              small ? "text-sm" : "text-md"
            } font-semibold`}
          >
            Upload Image
          </p>
        </>
      )}
    </div>
  );
};

export default ImagePlaceholder;
