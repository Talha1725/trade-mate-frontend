"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, EyeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/stores/auth-store";
import { cn } from "@/lib/utils";
import type { AuthStatus, LoginFormValues, LoginFormProps } from "@/types";

const initialValues: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: true,
};

export function LoginForm({
  onSubmit,
  redirectTo,
  className,
}: LoginFormProps) {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const [values, setValues] = React.useState<LoginFormValues>(initialValues);
  const [status, setStatus] = React.useState<AuthStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const isSubmitting = status === "submitting";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);
    setStatus("submitting");

    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        const session = await signIn({
          email: values.email,
          password: values.password,
        });
        setStatus("success");
        router.push(
          redirectTo ?? (session.user.role === "admin" ? "/admin" : "/dashboard"),
        );
        return;
      }
      setStatus("success");
      router.push(redirectTo ?? "/dashboard");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      noValidate
    >
      <div className="space-y-1.5 text-center">
        <h2 className="text-[22px] font-semibold tracking-tight text-[#1a1a1a]">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500">
          Access the internal review generation dashboard.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-sm font-semibold text-[#1a1a1a]">
            Email
          </Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="admin@trademate.local"
            value={values.email}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
            required
            disabled={isSubmitting}
            className="h-10 border-gray-200 bg-[#eff3f8] px-3 py-2 text-sm text-[#1a1a1a] shadow-none outline-none focus-visible:ring-1 focus-visible:ring-gray-300"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password" className="text-sm font-semibold text-[#1a1a1a]">
              Password
            </Label>
            <button
              type="button"
              className="text-sm font-medium text-[#1a1a1a] hover:underline"
              disabled={isSubmitting}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={values.password}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, password: event.target.value }))
              }
              required
              disabled={isSubmitting}
              className="h-10 border-gray-200 bg-[#eff3f8] px-3 py-2 pr-10 text-sm text-[#1a1a1a] shadow-none outline-none focus-visible:ring-1 focus-visible:ring-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              <EyeIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 h-10 w-full gap-2 rounded-lg bg-[#1a1a1a] text-white hover:bg-black"
      >
        {!isSubmitting ? <ArrowRightIcon className="size-4" /> : null}
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      <div className="text-center text-sm text-gray-500">
        Do not have an account?{" "}
        <button
          type="button"
          className="font-semibold text-[#1a1a1a] hover:underline"
          disabled={isSubmitting}
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
