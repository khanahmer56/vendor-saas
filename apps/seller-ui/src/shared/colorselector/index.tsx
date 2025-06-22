import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";

const defaultColors = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#00ffff",
  "#ff00ff",
  "#c0c0c0",
  "#808080",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#008080",
  "#800080",
];

interface ColorSelectorProps {
  control: Control<any>;
  errors?: FieldErrors;
}

const ColorSelector = ({ control, errors }: ColorSelectorProps) => {
  const [newColor, setNewColor] = useState("#ffffff");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>([]);

  return (
    <div className="mt-2">
      <label htmlFor="color" className="block font-semibold text-gray-400 mb-1">
        Colors
      </label>

      <Controller
        control={control}
        name="colors"
        render={({ field }) => {
          const selectedColors: string[] = field.value || [];

          const toggleColor = (color: string) => {
            if (selectedColors.includes(color)) {
              field.onChange(selectedColors.filter((c) => c !== color));
            } else {
              field.onChange([...selectedColors, color]);
            }
          };

          return (
            <div className="flex flex-wrap gap-2">
              {[...defaultColors, ...customColors].map((color, index) => {
                const isSelected = selectedColors.includes(color);
                const isLightColor = color === "#ffffff" || color === "#000000";

                return (
                  <button
                    key={`${color}-${index}`}
                    type="button"
                    className={`w-8 h-8 rounded-md my-1 flex items-center justify-center cursor-pointer border-2 transition-all ${
                      isSelected
                        ? "scale-[0.98] border-white"
                        : "border-transparent"
                    } ${isLightColor ? "border-gray-600" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => toggleColor(color)}
                  />
                );
              })}

              <button
                type="button"
                className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-500 flex items-center justify-center bg-gray-800 hover:bg-gray-700"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <Plus size={16} color="white" />
              </button>

              {showColorPicker && (
                <div className="relative flex items-center gap-2">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-10 h-10 p-0 border-none cursor-pointer"
                  />
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-500 text-xs text-white bg-gray-800 hover:bg-gray-700"
                    onClick={() => {
                      if (!customColors.includes(newColor)) {
                        setCustomColors((prev) => [...prev, newColor]);
                      }
                      setShowColorPicker(false);
                    }}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default ColorSelector;
