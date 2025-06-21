import { Controller } from "react-hook-form";

const defaultcolors = [
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
const ColorSelector = ({ control, errors }: any) => {
  return (
    <div className="mt-2">
      <label htmlFor="color" className="block font-semibold text-gray-400 mb-1">
        {" "}
        colors
      </label>
      <Controller
        control={control}
        name="colors"
        render={({ field }) => (
          <div className="flex flex-wrap gap-2">
            {defaultcolors.map((color: any, index: number) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => field.onChange(color)}
              />
            ))}
          </div>
        )}
      />
    </div>
  );
};
export default ColorSelector;
