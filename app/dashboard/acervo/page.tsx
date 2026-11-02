"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AcervoDashboard } from "@/components/AcervoDashboard";
import { useAuth } from "@/lib/auth-context";
import { getVaultDocuments } from "@/lib/vault-service";
import { CompanyDocumentVaultItem } from "@/lib/types";

export default function AcervoPage() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<CompanyDocumentVaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const fetched = await getVaultDocuments(user?.id);
        if (isMounted) {
          setDocs(fetched || []);
        }
      } catch (err) {
        console.warn("Falha ao carregar documentos de acervo:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  return (
    <DashboardLayout activeTab="cofre">
      <div className="max-w-6xl mx-auto space-y-6">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-[var(--grafite)] flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-[var(--lacre)]/30 border-t-[var(--lacre)] rounded-full animate-spin" />
            <span>Consultando Portfólio de Acervo Técnico no Supabase...</span>
          </div>
        ) : (
          <AcervoDashboard docs={docs} />
        )}
      </div>
    </DashboardLayout>
  );
}
