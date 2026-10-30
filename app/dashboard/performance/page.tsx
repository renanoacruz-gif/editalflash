"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PerformanceRoiDashboard } from "@/components/PerformanceRoiDashboard";
import { useAuth } from "@/lib/auth-context";

export default function PerformanceRoiPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout activeTab="performance">
      <div className="max-w-6xl mx-auto space-y-6">
        <PerformanceRoiDashboard userPlan={user?.plan} />
      </div>
    </DashboardLayout>
  );
}
