import { LoginForm } from "@/features/auth/login-form";
import { BrandMark } from "@/components/brand-mark";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 font-sans text-[#1a1a1a]">
      <div className="mb-8">
        <BrandMark />
      </div>
      <div className="w-full max-w-[420px] rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
        <LoginForm />
      </div>
    </main>
  );
}
