"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PrimaryVertical } from "@/lib/types";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: "superadmin" | "tenant_user";
  is_superadmin?: boolean;
  company?: string;
  cnpj?: string;
  primary_vertical?: PrimaryVertical;
  plan?: "Starter" | "Pro" | "Enterprise" | null;
  billingCycle?: "monthly" | "annual";
  analysesUsed: number;
  analysesLimit: number;
}

export interface ImpersonationState {
  isImpersonating: boolean;
  originalUser: User;
  tenant: {
    id: string;
    name: string;
    email: string;
    company: string;
    primary_vertical: PrimaryVertical;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSuperAdmin: boolean;
  impersonation: ImpersonationState | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string, company?: string, primary_vertical?: PrimaryVertical) => Promise<boolean>;
  selectPlan: (plan: "Starter" | "Pro" | "Enterprise", cycle?: "monthly" | "annual") => void;
  addCredits: (amount: number) => void;
  consumeCredit: () => boolean;
  updatePrimaryVertical: (vertical: PrimaryVertical) => void;
  startImpersonation: (tenantId: string) => boolean;
  stopImpersonation: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [impersonation, setImpersonation] = useState<ImpersonationState | null>(null);
  const router = useRouter();

  const isSuperAdmin = Boolean(
    user?.role === "superadmin" ||
      user?.is_superadmin ||
      user?.email?.toLowerCase().trim() === "renan.oacruz@gmail.com" ||
      user?.email?.toLowerCase().trim() === "renanoacruz@gmail.com"
  );

  useEffect(() => {
    // Carrega sessão salva no localStorage
    const storedUser = localStorage.getItem("editalflash_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const cleanEmail = (parsed.email || "").toLowerCase().trim();
        const isAdmin = cleanEmail === "renan.oacruz@gmail.com" || cleanEmail === "renanoacruz@gmail.com";
        if (isAdmin) {
          parsed.role = "superadmin";
          parsed.is_superadmin = true;
          parsed.company = "51.926.034 RENAN OSCAR ARAUJO CRUZ";
          parsed.cnpj = "51.926.034/0001-42";
          parsed.primary_vertical = "Serviços Contínuos (Limpeza, Segurança, Manutenção)";
          parsed.plan = "Pro";
          parsed.analysesLimit = 999999;
          // Assegura cookie de admin sincronizado sem precisar relogar
          if (typeof document !== "undefined") {
            document.cookie = `editalflash_admin_session=${cleanEmail}; path=/; max-age=86400; SameSite=Lax`;
          }
        } else {
          parsed.role = parsed.role || "tenant_user";
          parsed.is_superadmin = false;
        }
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem("editalflash_user");
      }
    }

    const storedImp = localStorage.getItem("editalflash_impersonation");
    if (storedImp) {
      try {
        setImpersonation(JSON.parse(storedImp));
      } catch (_) {
        localStorage.removeItem("editalflash_impersonation");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const isAdminUser = cleanEmail === "renan.oacruz@gmail.com" || cleanEmail === "renanoacruz@gmail.com";

    // Simulação de login autêntico com concessão de privilégios para admin
    const loggedUser: User = {
      id: isAdminUser ? "usr_founder_renan" : "usr_" + Math.random().toString(36).substring(2, 9),
      name: isAdminUser ? "Renan Oscar Araujo Cruz (Founder & SuperAdmin)" : cleanEmail.split("@")[0].toUpperCase(),
      email: cleanEmail,
      role: isAdminUser ? "superadmin" : "tenant_user",
      is_superadmin: isAdminUser,
      company: isAdminUser ? "51.926.034 RENAN OSCAR ARAUJO CRUZ" : "Empresa Licitante B2B",
      cnpj: isAdminUser ? "51.926.034/0001-42" : undefined,
      primary_vertical: isAdminUser ? "Serviços Contínuos (Limpeza, Segurança, Manutenção)" : "Todos / Não tenho preferência definida",
      plan: isAdminUser ? "Pro" : null,
      billingCycle: "annual",
      analysesUsed: 0,
      analysesLimit: isAdminUser ? 999999 : 15,
    };

    // Auto-set admin session cookie se for o admin para acesso unificado sem novo login
    if (isAdminUser) {
      document.cookie = `editalflash_admin_session=${cleanEmail}; path=/; max-age=86400; SameSite=Lax`;
    }

    // Se já havia plano salvo previamente, recupera
    const prev = localStorage.getItem("editalflash_user");
    if (prev) {
      try {
        const parsed = JSON.parse(prev);
        if (parsed.email === cleanEmail && parsed.plan && !isAdminUser) {
          loggedUser.plan = parsed.plan;
          loggedUser.primary_vertical = parsed.primary_vertical || "Todos / Não tenho preferência definida";
          loggedUser.analysesUsed = parsed.analysesUsed || 0;
          loggedUser.analysesLimit = parsed.analysesLimit || 15;
        }
      } catch (_) {}
    }

    setUser(loggedUser);
    localStorage.setItem("editalflash_user", JSON.stringify(loggedUser));
    setIsLoading(false);

    if (isAdminUser || loggedUser.plan) {
      router.push("/dashboard");
    } else {
      router.push("/pricing");
    }
    return true;
  };

  const signup = async (
    name: string,
    email: string,
    _pass: string,
    company?: string,
    primary_vertical: PrimaryVertical = "Obras Públicas e Engenharia"
  ): Promise<boolean> => {
    setIsLoading(true);
    const newUser: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: name || "Gestor de Licitações",
      email: email,
      role: "tenant_user",
      is_superadmin: false,
      company: company || "Minha Empresa Licitante",
      primary_vertical: primary_vertical,
      plan: null,
      analysesUsed: 0,
      analysesLimit: 15,
    };

    setUser(newUser);
    localStorage.setItem("editalflash_user", JSON.stringify(newUser));
    setIsLoading(false);

    router.push("/pricing");
    return true;
  };

  const updatePrimaryVertical = (vertical: PrimaryVertical) => {
    if (!user) return;
    const updated = { ...user, primary_vertical: vertical };
    setUser(updated);
    localStorage.setItem("editalflash_user", JSON.stringify(updated));
  };

  const addCredits = (amount: number) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      analysesLimit: (user.analysesLimit || 0) + amount,
    };
    setUser(updatedUser);
    localStorage.setItem("editalflash_user", JSON.stringify(updatedUser));
  };

  const consumeCredit = (): boolean => {
    if (!user) return false;
    // Admins have unlimited credits
    if (isSuperAdmin || user.is_superadmin) return true;
    
    const currentUsed = user.analysesUsed || 0;
    const limit = user.analysesLimit || 15;
    
    const updatedUser: User = {
      ...user,
      analysesUsed: currentUsed + 1,
    };
    setUser(updatedUser);
    localStorage.setItem("editalflash_user", JSON.stringify(updatedUser));
    return true;
  };

  const selectPlan = (plan: "Starter" | "Pro" | "Enterprise", cycle: "monthly" | "annual" = "monthly") => {
    if (!user) {
      router.push("/signup");
      return;
    }

    const updatedUser: User = {
      ...user,
      plan,
      billingCycle: cycle,
      analysesLimit: plan === "Starter" ? 5 : plan === "Pro" ? 15 : 99999,
    };

    setUser(updatedUser);
    localStorage.setItem("editalflash_user", JSON.stringify(updatedUser));

    router.push("/dashboard");
  };

  // Impersonation for Founder Support Mode
  const startImpersonation = (tenantId: string): boolean => {
    if (!user || (!isSuperAdmin && !user.is_superadmin)) {
      return false;
    }

    // Dynamic import avoidance; load from stored tenants if available
    let tenantData: any = null;
    try {
      const stored = localStorage.getItem("editalflash_superadmin_tenants");
      if (stored) {
        const tenants = JSON.parse(stored);
        tenantData = tenants.find((t: any) => t.id === tenantId);
      }
    } catch (_) {}

    if (!tenantData) {
      tenantData = {
        id: tenantId,
        name: "Licitante em Auditoria",
        responsibleEmail: "cliente@licitante.com.br",
        primary_vertical: "Obras Públicas e Engenharia",
      };
    }

    const newImpersonation: ImpersonationState = {
      isImpersonating: true,
      originalUser: { ...user },
      tenant: {
        id: tenantData.id,
        name: tenantData.name,
        email: tenantData.responsibleEmail,
        company: tenantData.name,
        primary_vertical: tenantData.primary_vertical || "Obras Públicas e Engenharia",
      },
    };

    setImpersonation(newImpersonation);
    localStorage.setItem("editalflash_impersonation", JSON.stringify(newImpersonation));

    // Audit event log in local store
    try {
      const rawEvents = localStorage.getItem("editalflash_superadmin_events") || "[]";
      const events = JSON.parse(rawEvents);
      events.unshift({
        id: "evt_" + Math.random().toString(36).substring(2, 9),
        actorEmail: user.email,
        actorRole: "superadmin",
        action: "SUPPORT_IMPERSONATION_STARTED",
        tenantId: tenantData.id,
        tenantName: tenantData.name,
        entityAffected: "Impersonation Session",
        payload: { simulatedVertical: tenantData.primary_vertical, timestamp: new Date().toISOString() },
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("editalflash_superadmin_events", JSON.stringify(events));
    } catch (_) {}

    // Switch context
    const impersonatedUser: User = {
      id: tenantData.id,
      name: `${tenantData.name} (Modo Suporte)`,
      email: tenantData.responsibleEmail,
      company: tenantData.name,
      primary_vertical: tenantData.primary_vertical,
      plan: tenantData.plan || "Pro",
      role: "tenant_user",
      is_superadmin: false,
      analysesUsed: 2,
      analysesLimit: 15,
    };
    setUser(impersonatedUser);
    localStorage.setItem("editalflash_user", JSON.stringify(impersonatedUser));

    router.push("/dashboard");
    return true;
  };

  const stopImpersonation = () => {
    if (!impersonation) return;

    // Audit event log
    try {
      const rawEvents = localStorage.getItem("editalflash_superadmin_events") || "[]";
      const events = JSON.parse(rawEvents);
      events.unshift({
        id: "evt_" + Math.random().toString(36).substring(2, 9),
        actorEmail: impersonation.originalUser.email,
        actorRole: "superadmin",
        action: "SUPPORT_IMPERSONATION_ENDED",
        tenantId: impersonation.tenant.id,
        tenantName: impersonation.tenant.name,
        entityAffected: "Impersonation Session",
        payload: { revertedAt: new Date().toISOString() },
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("editalflash_superadmin_events", JSON.stringify(events));
    } catch (_) {}

    setUser(impersonation.originalUser);
    localStorage.setItem("editalflash_user", JSON.stringify(impersonation.originalUser));
    setImpersonation(null);
    localStorage.removeItem("editalflash_impersonation");

    router.push("/admin/users");
  };

  const logout = () => {
    setUser(null);
    setImpersonation(null);
    localStorage.removeItem("editalflash_user");
    localStorage.removeItem("editalflash_impersonation");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSuperAdmin,
        impersonation,
        login,
        signup,
        selectPlan,
        addCredits,
        consumeCredit,
        updatePrimaryVertical,
        startImpersonation,
        stopImpersonation,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
};
