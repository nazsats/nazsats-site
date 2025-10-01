"use client";

import { useForm } from "react-hook-form";

interface SubscribeData {
  email: string;
}

export default function SubscribeForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SubscribeData>();

  const onSubmit = (data: SubscribeData) => {
    console.log("Subscribed email:", data.email);
    alert("Subscribed! (Placeholder - Integrate with backend)");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto flex">
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
        className="flex-1 p-4 border border-purple-300 rounded-l-lg focus:outline-none focus:border-purple-500 transition text-gray-900"
        aria-describedby={errors.email ? "email-error" : undefined}
      />
      {errors.email && <p id="email-error" className="text-red-500 mt-1">{errors.email.message}</p>}
      <button type="submit" className="btn-primary rounded-l-none">Subscribe</button>
    </form>
  );
}