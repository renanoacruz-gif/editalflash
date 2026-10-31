"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PrimaryVertical } from "@/lib/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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
  selectPlan: (plan: "Starter" | "Pro" | "Enterprise", cycle?: "monthly" | "annual") => Promise<void>;
  addCredits: (amount: number) => Promise<void>;
  consumeCredit: () => Promise<boolean>;
  updatePrimaryVertical: (vertical: PrimaryVertical) => Promise<void>;
  startImpersonation: (tenantId: string) => boolean;
  stopImpersonation: () => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
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

  // Carrega e sincroniza o perfil do Supabase dado o Auth User
  const loadProfileFromSupabase = async (authUserId: string, authEmail: string, userMeta?: any): Promise<User> => {
    const cleanEmail = (authEmail || "").toLowerCase().trim();
    const isAdmin = cleanEmail === "renan.oacruz@gmail.com" || cleanEmail === "renanoacruz@gmail.com";

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUserId)
        .single();

      if (profile && !error) {
        const mappedUser: User = {
          id: profile.id,
          name: profile.full_name || userMeta?.name || splitEmail(cleanEmail),
          email: profile.email || cleanEmail,
          role: (profile.role === "superadmin" || isAdmin) ? "superadmin" : "tenant_user",
          is_superadmin: Boolean(profile.role === "superadmin" || isAdmin),
          company: profile.company_name || (isAdmin ? "51.926.034 RENAN OSCAR ARAUJO CRUZ" : "Empresa Licitante"),
          cnpj: profile.cnpj || (isAdmin ? "51.926.034/0001-42" : undefined),
          primary_vertical: (profile.primary_vertical as PrimaryVertical) || "Obras Públicas e Engenharia",
          plan: (profile.plan as any) || (isAdmin ? "Pro" : "Starter"),
          billingCycle: (profile.billing_cycle as any) || (isAdmin ? "annual" : "monthly"),
          analysesUsed: profile.analyses_used || 0,
          analysesLimit: isAdmin ? 999999 : (profile.analyses_limit || 1),
        };

        if (isAdmin && typeof document !== "undefined") {
          document.cookie = `editalflash_admin_session=${cleanEmail}; path=/; max-age=86400; SameSite=Lax`;
        }
        return mappedUser;
      }
    } catch (err) {
      console.warn("[AUTH] Falha ao carregar perfil de profiles, usando metadados:", err);
    }

    // Fallback estruturado a partir dos metadados da sessão Auth
    const fallbackUser: User = {
      id: authUserId,
      name: userMeta?.name || userMeta?.full_name || splitEmail(cleanEmail),
      email: cleanEmail,
      role: isAdmin ? "superadmin" : "tenant_user",
      is_superadmin: isAdmin,
      company: isAdmin ? "51.926.034 RENAN OSCAR ARAUJO CRUZ" : (userMeta?.company || "Empresa Licitante"),
      cnpj: isAdmin ? "51.926.034/0001-42" : undefined,
      primary_vertical: userMeta?.primary_vertical || "Obras Públicas e Engenharia",
      plan: isAdmin ? "Pro" : "Starter",
      billingCycle: isAdmin ? "annual" : "monthly",
      analysesUsed: 0,
      analysesLimit: isAdmin ? 999999 : 1,
    };

    if (isAdmin && typeof document !== "undefined") {
      document.cookie = `editalflash_admin_session=${cleanEmail}; path=/; max-age=86400; SameSite=Lax`;
    }
    return fallbackUser;
  };

  function splitEmail(em: string): string {
    return em.split("@")[0].toUpperCase();
  }

  // Inicializa sessão via Supabase Auth
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        if (!isSupabaseConfigured) {
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const profile = await loadProfileFromSupabase(session.user.id, session.user.email || "", session.user.user_metadata);
          setUser(profile);
        }
      } catch (err) {
        console.error("[AUTH] Erro ao obter sessão inicial:", err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initSession();

    // Listener para mudanças de estado de autenticação (login, logout, refresh de token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" && session?.user) {
        const profile = await loadProfileFromSupabase(session.user.id, session.user.email || "", session.user.user_metadata);
        setUser(profile);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        if (typeof document !== "undefined") {
          document.cookie = "editalflash_admin_session=; path=/; max-age=0";
        }
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (!user?.id) return;
    const refreshed = await loadProfileFromSupabase(user.id, user.email);
    setUser(refreshed);
  };

  // Login Real via Supabase Auth
  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        throw new Error(error.message === "Invalid login credentials" ? "Credenciais inválidas. Verifique seu e-mail e senha." : error.message);
      }

      if (!data.user) {
        throw new Error("Usuário não encontrado no banco de dados.");
      }

      const profile = await loadProfileFromSupabase(data.user.id, data.user.email || cleanEmail, data.user.user_metadata);
      setUser(profile);
      setIsLoading(false);

      if (profile.is_superadmin || profile.plan) {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
      return true;
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  };

  // Cadastro Real via Supabase Auth
  const signup = async (
    name: string,
    email: string,
    pass: string,
    company?: string,
    primary_vertical: PrimaryVertical = "Obras Públicas e Engenharia"
  ): Promise<boolean> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            full_name: name,
            name: name,
            company_name: company || "Minha Empresa Licitante",
            primary_vertical: primary_vertical,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Não foi possível registrar o usuário no Supabase.");
      }

      const profile = await loadProfileFromSupabase(data.user.id, data.user.email || cleanEmail, data.user.user_metadata);
      setUser(profile);
      setIsLoading(false);

      router.push("/dashboard");
      return true;
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  };

  const updatePrimaryVertical = async (vertical: PrimaryVertical) => {
    if (!user) return;
    try {
      await supabase
        .from("profiles")
        .update({ primary_vertical: vertical, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      setUser({ ...user, primary_vertical: vertical });
    } catch (err) {
      console.error("[AUTH] Erro ao atualizar vertical:", err);
    }
  };

  const addCredits = async (amount: number) => {
    if (!user) return;
    try {
      const newLimit = (user.analysesLimit || 0) + amount;
      await supabase
        .from("profiles")
        .update({ analyses_limit: newLimit, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      setUser({ ...user, analysesLimit: newLimit });
    } catch (err) {
      console.error("[AUTH] Erro ao adicionar créditos:", err);
    }
  };

  const consumeCredit = async (): Promise<boolean> => {
    if (!user) return false;
    if (isSuperAdmin || user.is_superadmin) return true;

    const currentUsed = user.analysesUsed || 0;
    const limit = user.analysesLimit || 1;

    if (currentUsed >= limit) {
      return false;
    }

    try {
      await supabase
        .from("profiles")
        .update({ analyses_used: currentUsed + 1, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      setUser({ ...user, analysesUsed: currentUsed + 1 });
      return true;
    } catch (err) {
      console.error("[AUTH] Erro ao debitar crédito:", err);
      return false;
    }
  };

  const selectPlan = async (plan: "Starter" | "Pro" | "Enterprise", cycle: "monthly" | "annual" = "monthly") => {
    if (!user) {
      router.push("/signup");
      return;
    }

    const newLimit = plan === "Starter" ? 5 : plan === "Pro" ? 15 : 99999;
    try {
      await supabase
        .from("profiles")
        .update({
          plan,
          billing_cycle: cycle,
          analyses_limit: newLimit,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      setUser({
        ...user,
        plan,
        billingCycle: cycle,
        analysesLimit: newLimit,
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("[AUTH] Erro ao atualizar plano:", err);
    }
  };

  const startImpersonation = (_tenantId: string): boolean => {
    return false;
  };

  const stopImpersonation = () => {
    setImpersonation(null);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    setUser(null);
    setImpersonation(null);
    if (typeof document !== "undefined") {
      document.cookie = "editalflash_admin_session=; path=/; max-age=0";
    }
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
        refreshProfile,
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
