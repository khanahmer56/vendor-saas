import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import Input from "../Input";
import { Plus, PlusCircle, Trash, X } from "lucide-react";

const CustomProperties = ({ control, errors }: any) => {
  const [properties, setProperties] = useState<
    {
      label: string;
      value: string[];
    }[]
  >([]);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");

  return (
    <div>
      <div className="flex flex-col gap-3">
        <Controller
          control={control}
          name={"customProperties"}
          render={({ field }) => {
            useEffect(() => {
              field.onChange(properties);
            }, [properties]);
            const addProperty = () => {
              if (!newLabel.trim()) return;
              setProperties([...properties, { label: newLabel, value: [] }]);
              setNewLabel("");
            };
            const addNewValue = (index: number) => {
              if (!newValue.trim()) return;
              const newProperties = [...properties];
              newProperties[index].value.push(newValue);
              setProperties(newProperties);
              setNewLabel("");
              setNewValue("");
            };
            const removeProperty = (index: number) => {
              setProperties(properties.filter((_, i) => i !== index));
            };
            return (
              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Custom Properties
                </label>
                <div className="flex flex-col gap-3">
                  {properties.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-700 p-3 rounded-lg bg-gray-900 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">
                          {item.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeProperty(index)}
                        >
                          <X size={18} className="text-red-500" />
                        </button>
                      </div>
                      <div className="flex items-center mt-2 gap-2">
                        <input
                          type="text"
                          className="border outline-none border-gray-600 rounded-md p-2 w-full bg-gray-800"
                          placeholder="Enter Value"
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => addNewValue(index)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.value.map((value, valueIndex) => (
                          <span
                            key={valueIndex}
                            className="px-2 py-1 bg-gray-600 text-white rounded"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="text"
                      placeholder="Enter property Label (e.g., Material, Warranty)"
                      value={newLabel}
                      onChange={(e: any) => setNewLabel(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={addProperty}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                {errors.customProperties && (
                  <span className="text-red-500 text-sm">
                    {errors.customProperties.message}
                  </span>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default CustomProperties;
