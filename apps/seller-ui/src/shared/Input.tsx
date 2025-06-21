import React, { forwardRef } from "react";
interface BaseProps {
  label?: string;
  type?: "text" | "number" | "password" | "email" | "textarea";
}
type InputProps = BaseProps & any;
type TextareaProps = BaseProps &
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >;

type Props = InputProps | TextareaProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({ label, type = "text", className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-semibold">{label}</label>}
      {type === "textarea" ? (
        <textarea
          {...props}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={`border bg-transparent border-slate-600 w-full rounded-md p-2 ${className}`}
        />
      ) : (
        <input
          {...props}
          ref={ref as any}
          type={type}
          className={`border border-slate-600 bg-transparent outline-none  rounded-md p-2 ${className}`}
        />
      )}
    </div>
  )
);

Input.displayName = "Input";

export default Input;
