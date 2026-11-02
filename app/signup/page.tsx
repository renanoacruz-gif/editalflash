"use client";

import React, { Suspense } from "react";
import { AuthSlidingCard } from "@/components/auth/AuthSlidingCard";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA] text-[#09090B] font-mono text-xs">
          Carregando ambiente seguro...
        </div>
      }
    >
      <AuthSlidingCard initialMode="signup" />
    </Suspense>
  );
}
