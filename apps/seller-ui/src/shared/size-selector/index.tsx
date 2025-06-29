import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";

const defaultSizes = ["XS", "S", "M", "L", "XL"];

interface SizeSelectorProps {
  control: Control<any>;
  errors?: FieldErrors<any>;
}

const SizeSelector = ({ control, errors }: SizeSelectorProps) => {
  return (
    <div>
      <label className="block font-semibold text-gray-300 mb-1">Size</label>
      <Controller
        control={control}
        name="sizes"
        rules={{ required: "Size is required" }}
        defaultValue={[]} // Add default value to prevent undefined errors
        render={({ field, fieldState }) => (
          <div>
            <div className="flex flex-wrap gap-2">
              {defaultSizes.map((size) => {
                const isSelected = field.value?.includes(size) || false;
                return (
                  <button
                    key={size}
                    type="button" // Prevent form submission
                    onClick={() => {
                      const currentValue = field.value || [];
                      if (isSelected) {
                        field.onChange(
                          currentValue.filter((s: string) => s !== size)
                        );
                      } else {
                        field.onChange([...currentValue, size]);
                      }
                    }}
                    className={`
                      px-4 py-2 rounded-md border transition-all duration-200
                      ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                          : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                      }
                    `}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {/* Display validation error */}
            {fieldState.error && (
              <p className="text-red-400 text-sm mt-1">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default SizeSelector;
