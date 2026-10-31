"use client";

import React, { Suspense } from "react";
import { AuthSlidingCard } from "@/components/auth/AuthSlidingCard";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0E1626] text-white font-mono text-xs">
          Carregando ambiente seguro...
        </div>
      }
    >
      <AuthSlidingCard initialMode="login" />
    </Suspense>
  );
}
