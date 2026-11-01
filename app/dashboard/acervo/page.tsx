"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AcervoDashboard } from "@/components/AcervoDashboard";
import { Award, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AcervoPage() {
  return (
    <DashboardLayout activeTab="cofre">
      <div className="max-w-6xl mx-auto space-y-6">
        

        <AcervoDashboard />
      </div>
    </DashboardLayout>
  );
}
