"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setServerError(result.error || "Failed to send message. Please try again.");
      } else {
        setSubmitted(true);
        reset();
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <div className="glass-card animate-glow-pulse">
          <div className="text-5xl mb-6 animate-float">✅</div>
          <h2 className="text-3xl font-black text-white mb-3">
            Message <span className="gradient-text">Sent!</span>
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Thanks for reaching out. We&apos;ll get back to you as soon as possible.
          </p>
          <button onClick={() => setSubmitted(false)} className="btn-primary">
            Send Another →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="section-badge mb-6 animate-fade-in">Get in Touch</div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 animate-fade-in-up delay-100 leading-tight">
          Let&apos;s <span className="gradient-text-animated">Talk</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed animate-fade-in-up delay-200">
          Have a project in mind? We&apos;d love to hear about it. Tell us what you&apos;re building.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
        {/* Info sidebar */}
        <div className="lg:col-span-2 space-y-6 animate-fade-in-up delay-200">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              ),
              label: "Email",
              value: "contact@nazsats.com",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              label: "Response time",
              value: "Within 24 hours",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              ),
              label: "Availability",
              value: "Global — remote-first",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card flex items-start gap-4 animate-fade-in-up"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-slate-600 text-xs uppercase tracking-wider mb-0.5">{item.label}</p>
                <p className="text-white text-sm font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-3 glass-card animate-fade-in-up delay-300">
          {serverError && (
            <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-400">
                Name
              </label>
              <input
                id="name"
                {...register("name", { required: "Name is required" })}
                placeholder="Your name"
                className="input-dark"
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
                className="input-dark"
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-slate-400">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Tell us about your project..."
                {...register("message", { required: "Message is required" })}
                className="input-dark resize-none"
                rows={5}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p id="message-error" className="text-red-400 text-xs mt-1.5">{errors.message.message}</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full justify-center" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Message →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}