import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import Input from "../Input";
import { PlusCircle, Trash } from "lucide-react";

const CustomSpecification = ({ control, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "custom_specification",
  });
  return (
    <div>
      <label className="block font-semibold text-gray-300 mb-1">
        Custom Specification
      </label>
      <div className="flex flex-col gap-3">
        {fields?.map((item, index) => (
          <div key={index} className="flex gap-3 items-center">
            <Controller
              control={control}
              name={`custom_specifications.${index}.name`}
              rules={{ required: "Specification name is required" }}
              render={({ field }) => (
                <Input
                  label="Specification Name"
                  placeholder="e.g., Battery Life, Weight, Material                          "
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name={`custom_specifications.${index}.value`}
              rules={{ required: "value is required" }}
              render={({ field }) => (
                <Input
                  label="Value"
                  placeholder="e.g., 4000mAh , 1,5kg, Plastic                          "
                  {...field}
                />
              )}
            />
            <button
              type="button"
              className="text-red-500 hover:text-red-700"
              onClick={() => remove(index)}
            >
              <Trash />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-gray-400 hover:text-gray-600 flex justify-start items-center gap-2"
          onClick={() => append({ name: "", value: "" })}
        >
          <PlusCircle size={20} /> Add Specification
        </button>
      </div>
      {errors.custom_specification && (
        <span className="text-red-500 text-sm">
          {errors.custom_specification.message}
        </span>
      )}
    </div>
  );
};

export default CustomSpecification;
