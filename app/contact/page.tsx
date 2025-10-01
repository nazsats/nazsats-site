"use client";

import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    alert("Message sent! (Placeholder - Integrate with your backend)");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-purple-800">Contact Us</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block mb-2 font-medium text-purple-800">Name</label>
          <input
            id="name"
            {...register("name", { required: "Name is required" })}
            className="w-full p-4 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 transition text-gray-900"
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && <p id="name-error" className="text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 font-medium text-purple-800">Email</label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            className="w-full p-4 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 transition text-gray-900"
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && <p id="email-error" className="text-red-500 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="message" className="block mb-2 font-medium text-purple-800">Message</label>
          <textarea
            id="message"
            {...register("message", { required: "Message is required" })}
            className="w-full p-4 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 transition text-gray-900"
            rows={5}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && <p id="message-error" className="text-red-500 mt-1">{errors.message.message}</p>}
        </div>
        <button type="submit" className="btn-primary">Send Message</button>
      </form>
    </div>
  );
}