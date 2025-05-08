"use client";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";

type Formdata = {
  name: string;
  email: string;
  password: string;
};

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(0);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userData, setUserData] = useState<Formdata | null>(null);
  const [showotp, setShowOtp] = useState(false);
  const inputref = useRef<HTMLInputElement | any>([]);
  const [activeStep, setActiveStep] = useState(0);

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
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputref.current[index - 1]?.focus();
    }
  };
  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputref.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputref.current[index - 1]?.focus();
    }
  };
  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
        }
        return prev - 1;
      });
    }, 1000);
  };
  const signupMutation = useMutation({
    mutationFn: async (data: Formdata) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user-registration`,
        data
      );
      return response.data;
    },
    onSuccess: (_, data) => {
      setUserData(data);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
  });
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/verify-otp`,
        {
          name: userData?.name,
          email: userData?.email,
          password: userData?.password,
          otp: otp.join(""),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
  });
  const onSubmit = async (data: Formdata) => {
    signupMutation.mutate(data);
  };
  const resendOtp = () => {
    setCanResend(false);
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCanResend(true);
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="w-full flex flex-col items-center pt-10 min-h-screen">
      {/* Stepper */}
      <div className="relative flex items-center justify-between md:w-[50%] mb-8">
        <div className="absolute top-[50%] left-0 w-[80%] md:w-[90%] h-1 bg-gray-300 -z-10 flex justify-between items-center">
          {[1, 2, 3].map((step) => {
            return (
              <div key={step}>
                <div
                  className={`w-10 h-10 mt-4 items-center justify-center rounded-full  text-white flex ${
                    activeStep >= step ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  {step}
                </div>
                <span className="ml-[-15px]">
                  {step === 1
                    ? "Enter your details"
                    : step === 2
                    ? "Verify OTP"
                    : "Complete"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
        <h1 className="text-4xl font-poppins font-semibold text-black text-center">
          Signup
        </h1>
        <p className="text-center text-lg font-medium py-3 text-[#6B7280]">
          Home . Signup
        </p>
        <div className="w-full flex justify-center">
          <div className="md:w-[480px] p-8 bg-white shadow-md rounded-lg">
            <h3 className="text-3xl font-poppins font-semibold text-black text-center">
              Signup to your account
            </h3>
            <p className="text-center text-gray-500 mb-4">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500">
                Login
              </Link>
            </p>

            <div className="flex items-center my-5 text-gray-400 text-sm">
              <div className="flex-1 border-t border-gray-300" />
              <p className="mx-2">or Sign in with Email</p>
              <div className="flex-1 border-t bg-gray-300" />
            </div>
            {!showotp ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <label
                  htmlFor="email"
                  className="text-sm font-poppins font-semibold text-black block"
                >
                  Name
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Email is required",
                  })}
                  className="border border-gray-300 px-4 py-2 rounded-md"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
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
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}

                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md"
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPaused ? "Signing up..." : "Sign up"}
                </button>

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
            ) : (
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
                        inputref.current[index] = el;
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
                      verifyOtpMutation.mutate();
                    }}
                    disabled={verifyOtpMutation.isPending}
                  >
                    {verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
                  </button>
                </div>
                {canResend ? (
                  <button
                    className=" text-[#3B82F6] px-4 py-2 rounded-md mt-4 mx-auto w-full"
                    onClick={resendOtp}
                  >
                    Resend
                  </button>
                ) : (
                  <p className="text-center text-sm mt-4">{`Resend Otp in ${timer} seconds`}</p>
                )}
                {verifyOtpMutation?.isError &&
                  verifyOtpMutation?.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm text-center">
                      {verifyOtpMutation?.error?.response?.data.message ||
                        verifyOtpMutation.error.message}
                    </p>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
