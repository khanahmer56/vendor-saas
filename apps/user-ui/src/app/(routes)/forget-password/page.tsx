"use client";
import GoogleButton from "@/components/GoogleButton";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type Formdata = {
  email: string;
  password: string;
};

const ForgetPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userEmail, setUserEmail] = useState("");
  const [canResend, setCanResend] = useState(true);
  const inputRef = useRef<HTMLInputElement | any>([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [password, setPassword] = useState("");
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

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRef.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const requestOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/forget-password`,
        { email }
      );
      return res.data;
    },
    onSuccess: (_, email: any) => {
      console.log("email", email);
      setUserEmail(email);
      setStep("otp");
      setServerError("");
      setCanResend(false);
      setTimeout(() => {
        setCanResend(true);
      }, 60000);
    },
    onError: (error: any) => {
      setServerError(error.response?.data?.message || "Something went wrong");
    },
  });
  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/verify-forget-password`,
        {
          email: data.email,
          otp: data.otp,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      setStep("reset");
      setServerError("");
    },
    onError: (error: any) => {
      setServerError(error.response?.data?.message || "Something went wrong");
    },
  });
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { password: string }) => {
      if (!data?.password) return;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
        {
          email: userEmail,
          newPassword: password,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      setStep("email");
      toast.success("Password reset successfully");
      setServerError("");
      router.push("/login");
    },
    onError: (error: any) => {
      setServerError(error.response?.data?.message || "Something went wrong");
    },
  });
  const onSubmitEmail = async ({ email }: { email: string }) => {
    setServerError("");
    requestOtpMutation.mutate(email);
  };
  const onSubmitOtp = async ({ password }: { password: string }) => {
    setServerError("");
    resetPasswordMutation.mutate({ password });
  };
  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-4xl font-poppins font-semibold text-black text-center">
        Forget Password
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#6B7280]">
        Home . Forget Password
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow-md rounded-lg">
          {step === "email" && (
            <>
              <form
                onSubmit={handleSubmit(onSubmitEmail)}
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

                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md"
                  disabled={requestOtpMutation.isPending}
                >
                  Sign In
                </button>
                {serverError && (
                  <p className="text-red-500 text-sm text-center">
                    {serverError}
                  </p>
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
            </>
          )}
          {step === "otp" && (
            <>
              <div>
                <h3 className="text-3xl font-poppins font-semibold text-black text-center">
                  Enter OTP
                </h3>
                <div className="flex justify-center gap-6 mt-4">
                  {otp.map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      ref={(el) => {
                        inputRef.current[index] = el;
                      }}
                      className="border border-gray-300 px-2 py-2 rounded-md w-10 text-center"
                      value={item}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                  ))}
                  <button
                    className="bg-black text-white px-4 py-2 rounded-md"
                    onClick={() => {
                      verifyOtpMutation.mutate({
                        email: userEmail,
                        otp: otp.join(""),
                      });
                    }}
                    disabled={verifyOtpMutation.isPending}
                  >
                    {verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
                  </button>
                </div>

                {verifyOtpMutation?.isError &&
                  verifyOtpMutation?.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm text-center">
                      {verifyOtpMutation?.error?.response?.data.message ||
                        verifyOtpMutation.error.message}
                    </p>
                  )}
              </div>
            </>
          )}
          {step === "reset" && (
            <>
              <div>
                <h3 className="text-3xl font-poppins font-semibold text-black text-center">
                  Reset Password
                </h3>
                <div className="flex justify-center gap-6 mt-4">
                  <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="border border-gray-300 px-4 py-2 rounded-md w-full"
                  />
                  <button
                    className="bg-black text-white px-4 py-2 rounded-md"
                    onClick={() => {
                      onSubmitOtp({ password });
                    }}
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending
                      ? "Resetting..."
                      : "Reset Password"}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
