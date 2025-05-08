"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type Formdata = {
  email: string;
  password: string;
};

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Formdata>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const loginMutation = useMutation({
    mutationFn: async (data: Formdata) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      setServerError("");
      router.push("/");
    },
    onError: (error: any) => {
      setServerError(error.response?.data?.message || "Something went wrong");
    },
  });
  const onSubmit = async (data: Formdata) => {
    setServerError("");
    loginMutation.mutate(data);
  };
  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-4xl font-poppins font-semibold text-black text-center">
        Login
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#6B7280]">
        Home . Login
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow-md rounded-lg">
          <h3 className="text-3xl font-poppins font-semibold text-black text-center">
            Login to your account
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Dont have an account?{" "}
            <Link href="/signup" className="text-blue-500">
              Register
            </Link>
          </p>

          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <p className="mx-2">or Sign in with Email</p>
            <div className="flex-1 border-t bg-gray-300" />
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <label
              htmlFor="email"
              className="text-sm font-poppins font-semibold text-black block"
            >
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              className="border border-gray-300 px-4 py-2 rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
            <label
              htmlFor="password"
              className="text-sm font-poppins font-semibold text-black block"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="border border-gray-300 px-4 py-2 rounded-md w-full"
              />
              <span
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <Eye /> : <EyeOff />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm font-poppins font-semibold text-black"
                >
                  Remember Me
                </label>
              </div>
              <div className="text-right">
                <Link href="/forgot-password" className="text-blue-500">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-md"
              disabled={loginMutation.isPending}
            >
              Sign In
            </button>
            {serverError && (
              <p className="text-red-500 text-sm text-center">{serverError}</p>
            )}
            <p className="text-center text-sm text-gray-500">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-blue-500">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-500">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
