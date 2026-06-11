"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "trader";
}

export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    const email = localStorage.getItem("user_email");
    const role = localStorage.getItem("user_role");

    // Not logged in at all → send to login
    if (!email || !role) {
      router.replace("/");
      return;
    }

    // Wrong role → redirect to the correct home for this user
    if (requiredRole && role !== requiredRole) {
      router.replace(role === "admin" ? "/admin" : "/dashboard");
      return;
    }

    setAuthorized(true);
  }, [router, requiredRole]);

  // Render nothing while checking auth to prevent flash of protected content
  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
