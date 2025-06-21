"use client";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { countries } from "@/app/utils/countries";
import CreateShop from "@/shared/modules/auth/create-shop";

type Formdata = {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  country: string;
};

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(0);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [seller, setSeller] = useState<Formdata | null>(null);
  const [showotp, setShowOtp] = useState(false);
  const inputref = useRef<HTMLInputElement | any>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [sellerid, setSellerId] = useState("");

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
        `${process.env.NEXT_PUBLIC_API_URL}/seller-registration`,
        data
      );
      return response.data;
    },
    onSuccess: (_, data) => {
      setSeller(data);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
  });
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!seller) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/verify-seller`,
        {
          name: seller?.name,
          email: seller?.email,
          password: seller?.password,
          phone_number: seller?.phone_number,
          country: seller?.country,
          otp: otp.join(""),
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setSellerId(data?.seller?.id);
      setActiveStep(2);
    },
  });
  const onSubmit = async (data: any) => {
    // console.log(data);
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
  const connectStripeFunc = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/create-stripe-link`,
        {
          sellerId: sellerid,
        }
      );
      if (res.data?.url) {
        window.location.href = res.data?.url;
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="w-full flex flex-col items-center pt-10 min-h-screen">
      {/* Stepper */}
      <div className="relative flex flex-col md:w-[50%] mb-8 mx-auto">
        {/* Progress Bar */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-300 -z-10" />

        {/* Steps */}
        <div className="flex justify-between w-full">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${
                  activeStep >= step ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                {step}
              </div>
              <span className="mt-2 text-sm text-center w-24">
                {step === 1
                  ? "Create Account"
                  : step === 2
                  ? "Setup Shop"
                  : "Connect Bank"}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
        {activeStep === 1 && (
          <>
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
                  htmlFor="country"
                  className="text-sm font-poppins font-semibold text-black block"
                >
                  Country
                </label>
                <select
                  {...register("country", {
                    required: "Country is required",
                  })}
                  className="border border-gray-300 px-4 py-2 rounded-md"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-500 text-sm">
                    {errors.country.message}
                  </p>
                )}
                <label
                  htmlFor="phoneNumber"
                  className="text-sm font-poppins font-semibold text-black block"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="1234567890"
                  {...register("phone_number", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Invalid phone number",
                    },
                  })}
                  className="border border-gray-300 px-4 py-2 rounded-md"
                />

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

                <Link href="/login">
                  <p className="text-sm font-poppins font-semibold text-black block">
                    {" "}
                    Already have an account? Login
                  </p>
                </Link>
                {signupMutation?.isError &&
                  signupMutation?.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm text-center">
                      {signupMutation?.error?.response?.data.message ||
                        signupMutation.error.message}
                    </p>
                  )}
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
          </>
        )}
        {activeStep === 2 && (
          <>
            <CreateShop sellerId={sellerid} setActiveStep={setActiveStep} />
          </>
        )}
        {activeStep === 3 && (
          <div className="text-center">
            <h3 className="text-3xl font-poppins font-semibold text-black text-center">
              Withdraw Method
            </h3>
            <button
              className="w-full m-auto flex items-center justify-center gap-3 text-lg bg-black text-white px-4 py-2 rounded-md mt-4"
              onClick={connectStripeFunc}
            >
              Connect Stripe
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
