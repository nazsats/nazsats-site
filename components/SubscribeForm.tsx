"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface SubscribeData {
  email: string;
}

export default function SubscribeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SubscribeData>();

  const onSubmit = async (data: SubscribeData) => {
    setIsLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setServerError(result.error || "Failed to subscribe. Please try again.");
      } else {
        setSubscribed(true);
        reset();
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="text-center">
        <p className="text-2xl mb-2">🎉</p>
        <p className="text-white font-bold">You&apos;re in!</p>
        <p className="text-slate-500 text-sm mt-1">We&apos;ll keep you updated with the latest.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex gap-0">
        <input
          type="email"
          placeholder="Enter your email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
          className="input-dark rounded-r-none flex-1 border-r-0 rounded-l-full"
          aria-describedby={errors.email ? "subscribe-email-error" : undefined}
        />
        <button
          onClick={handleSubmit(onSubmit)}
          className="btn-primary rounded-l-none flex-shrink-0"
          disabled={isLoading}
          type="button"
        >
          {isLoading ? "..." : "Subscribe"}
        </button>
      </div>
      {errors.email && (
        <p id="subscribe-email-error" className="text-red-400 text-xs mt-2 text-left">{errors.email.message}</p>
      )}
      {serverError && (
        <p className="text-red-400 text-xs mt-2 text-left">{serverError}</p>
      )}
    </div>
  );
}