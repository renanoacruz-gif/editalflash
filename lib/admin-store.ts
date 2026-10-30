import { PrimaryVertical } from "./types";

export interface Tenant {
  id: string;
  name: string;
  cnpj: string;
  responsibleEmail: string;
  responsibleName: string;
  primary_vertical: PrimaryVertical;
  plan: "Starter" | "Pro" | "Setup";
  billingCycle: "monthly" | "annual" | "once";
  subscriptionStatus: "active" | "past_due" | "trial" | "canceled";
  creditsRemaining: number;
  setupPurchased: boolean;
  migratedToPro: boolean;
  mrrContribution: number; // 197 if Pro active, 0 otherwise
  createdAt: string; // ISO
  lastAccessAt: string; // ISO
  lastAnalysisDate: string;
  lastSemaforoStatus: "PASSA" | "RESSALVA" | "ELIMINATORIA" | "NENHUMA";
  docsInVault: number;
  onboardingStep: 1 | 2 | 3 | 4; // 1: Signup, 2: Cofre, 3: 1a Análise, 4: Ativação Pro/Crédito
  status: "active" | "blocked";
  isFounder?: boolean;
  // Campos de Governança LGPD / Aceite de Termos
  termsAccepted?: boolean;
  termsAcceptedAt?: string; // ISO ou data legível
  termsVersion?: string;
  notes?: string;
}

export interface AuditEvent {
  id: string;
  actorEmail: string;
  actorRole: "superadmin" | "tenant_user" | "system";
  action: string;
  tenantId?: string;
  tenantName?: string;
  entityAffected: string;
  payload: Record<string, any>;
  timestamp: string; // ISO formatted America/Sao_Paulo
}

export interface GlobalAnnouncement {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "critical" | "update";
  targetVertical: PrimaryVertical | "ALL";
  active: boolean;
  createdAt: string;
  createdBy: string;
}

// Founder Tenant Definition for CNPJ 51.926.034/0001-42
export const FOUNDER_TENANT: Tenant = {
  id: "tnt_founder_001",
  name: "51.926.034 RENAN OSCAR ARAUJO CRUZ",
  cnpj: "51.926.034/0001-42",
  responsibleEmail: "renanoacruz@gmail.com",
  responsibleName: "Renan Oscar Araujo Cruz",
  primary_vertical: "Serviços Contínuos (Limpeza, Segurança, Manutenção)",
  plan: "Pro",
  billingCycle: "annual",
  subscriptionStatus: "active",
  creditsRemaining: 999999,
  setupPurchased: true,
  migratedToPro: true,
  mrrContribution: 197,
  createdAt: "2026-10-25T00:00:00.000Z",
  lastAccessAt: new Date().toISOString(),
  lastAnalysisDate: "2026-10-29",
  lastSemaforoStatus: "PASSA",
  docsInVault: 4,
  onboardingStep: 4,
  status: "active",
  isFounder: true,
  termsAccepted: true,
  termsAcceptedAt: "2026-10-25T00:00:00.000Z",
  termsVersion: "2026-10-28",
  notes: "Conta Oficial do Fundador (SuperAdmin / CNAE 73.19-0-02 Promoção de Vendas & Serviços)",
};

// Initial Tenants Seed with Founder Tenant
const INITIAL_TENANTS: Tenant[] = [FOUNDER_TENANT];

const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "evt_init_001",
    actorEmail: "renanoacruz@gmail.com",
    actorRole: "superadmin",
    action: "SYSTEM_INITIALIZED",
    entityAffected: "Core Platform",
    payload: { status: "Ready", mode: "Production", version: "Lei 14.133/2021" },
    timestamp: new Date().toISOString(),
  },
];

const INITIAL_ANNOUNCEMENTS: GlobalAnnouncement[] = [];

// In-Memory store with local storage sync when in browser
class SuperAdminDataStore {
  private tenants: Tenant[] = INITIAL_TENANTS;
  private auditEvents: AuditEvent[] = INITIAL_AUDIT_EVENTS;
  private announcements: GlobalAnnouncement[] = INITIAL_ANNOUNCEMENTS;
  private initialized = false;

  private init() {
    if (this.initialized) return;
    if (typeof window !== "undefined") {
      const storedTenants = localStorage.getItem("editalflash_superadmin_tenants");
      if (storedTenants) {
        try {
          const parsed = JSON.parse(storedTenants);
          // Purge any legacy fake tenants if they contain 'tnt_001' or 'infrasul'
          if (Array.isArray(parsed) && parsed.some((t: any) => t.id === "tnt_001" || t.name?.includes("InfraSul"))) {
            localStorage.removeItem("editalflash_superadmin_tenants");
            this.tenants = [FOUNDER_TENANT];
          } else if (Array.isArray(parsed)) {
            // Garante que o Founder esteja sempre presente e atualizado
            const hasFounder = parsed.some((t: any) => t.id === "tnt_founder_001" || t.cnpj === "51.926.034/0001-42");
            this.tenants = hasFounder 
              ? parsed.map((t: any) => (t.id === "tnt_founder_001" || t.cnpj === "51.926.034/0001-42") ? FOUNDER_TENANT : t)
              : [FOUNDER_TENANT, ...parsed];
          } else {
            this.tenants = [FOUNDER_TENANT];
          }
        } catch (_) {
          this.tenants = [FOUNDER_TENANT];
        }
      } else {
        this.tenants = [FOUNDER_TENANT];
      }
      const storedEvents = localStorage.getItem("editalflash_superadmin_events");
      if (storedEvents) {
        try {
          const parsed = JSON.parse(storedEvents);
          if (Array.isArray(parsed) && parsed.some((e: any) => e.tenantId === "tnt_001")) {
            localStorage.removeItem("editalflash_superadmin_events");
            this.auditEvents = INITIAL_AUDIT_EVENTS;
          } else {
            this.auditEvents = parsed;
          }
        } catch (_) {}
      }
      const storedAnnouncements = localStorage.getItem("editalflash_superadmin_announcements");
      if (storedAnnouncements) {
        try { this.announcements = JSON.parse(storedAnnouncements); } catch (_) {}
      }
    }
    this.initialized = true;
  }

  private persist() {
    if (typeof window !== "undefined") {
      localStorage.setItem("editalflash_superadmin_tenants", JSON.stringify(this.tenants));
      localStorage.setItem("editalflash_superadmin_events", JSON.stringify(this.auditEvents));
      localStorage.setItem("editalflash_superadmin_announcements", JSON.stringify(this.announcements));
    }
  }

  public clearFakeData() {
    this.tenants = [];
    if (typeof window !== "undefined") {
      localStorage.removeItem("editalflash_superadmin_tenants");
    }
  }

  public getTenants(): Tenant[] {
    this.init();
    return [...this.tenants];
  }

  public getTenantById(id: string): Tenant | undefined {
    this.init();
    return this.tenants.find((t) => t.id === id);
  }

  public updateTenant(id: string, updates: Partial<Tenant>, actorEmail = "renanoacruz@gmail.com"): Tenant | null {
    this.init();
    const idx = this.tenants.findIndex((t) => t.id === id);
    if (idx === -1) return null;

    const previous = this.tenants[idx];
    const updated = { ...previous, ...updates };
    this.tenants[idx] = updated;

    this.addAuditEvent({
      actorEmail,
      actorRole: "superadmin",
      action: "TENANT_UPDATED",
      tenantId: id,
      tenantName: updated.name,
      entityAffected: "Tenant Record",
      payload: { previous, updated: updates },
    });

    this.persist();
    return updated;
  }

  public addAuditEvent(event: Omit<AuditEvent, "id" | "timestamp">) {
    this.init();
    const newEvent: AuditEvent = {
      id: "evt_" + Math.random().toString(36).substring(2, 9),
      ...event,
      timestamp: new Date().toISOString(),
    };
    this.auditEvents.unshift(newEvent); // Append-only (most recent first)
    this.persist();
    return newEvent;
  }

  public getAuditEvents(): AuditEvent[] {
    this.init();
    return [...this.auditEvents];
  }

  public getAnnouncements(): GlobalAnnouncement[] {
    this.init();
    return [...this.announcements];
  }

  public addAnnouncement(ann: Omit<GlobalAnnouncement, "id" | "createdAt">, actorEmail = "renanoacruz@gmail.com") {
    this.init();
    const newAnn: GlobalAnnouncement = {
      id: "ann_" + Math.random().toString(36).substring(2, 9),
      ...ann,
      createdAt: new Date().toISOString(),
    };
    this.announcements.unshift(newAnn);

    this.addAuditEvent({
      actorEmail,
      actorRole: "superadmin",
      action: "ANNOUNCEMENT_CREATED",
      entityAffected: "Global Notifications",
      payload: { title: newAnn.title, targetVertical: newAnn.targetVertical },
    });

    this.persist();
    return newAnn;
  }

  public toggleAnnouncement(id: string, actorEmail = "renanoacruz@gmail.com") {
    this.init();
    const ann = this.announcements.find((a) => a.id === id);
    if (!ann) return null;
    ann.active = !ann.active;
    this.addAuditEvent({
      actorEmail,
      actorRole: "superadmin",
      action: "ANNOUNCEMENT_TOGGLED",
      entityAffected: "Global Notifications",
      payload: { id, active: ann.active },
    });
    this.persist();
    return ann;
  }

  public deleteAnnouncement(id: string) {
    this.init();
    this.announcements = this.announcements.filter((a) => a.id !== id);
    this.persist();
  }

  // Calculated SaaS Metrics
  public getSaaSMetrics() {
    this.init();
    const tenants = this.tenants;

    // 1. MRR: Active Pro plans
    const mrr = tenants
      .filter((t) => t.plan === "Pro" && t.subscriptionStatus === "active")
      .reduce((acc, t) => acc + 197, 0);

    // 2. Receita de Créditos Avulsos e Setups
    const setupsCount = tenants.filter((t) => t.setupPurchased).length;
    const setupsRevenue = setupsCount * 497;
    // Estimativa de créditos avulsos consumidos/comprados
    const starterTenants = tenants.filter((t) => t.plan === "Starter" || t.plan === "Setup").length;
    const creditsSoldRevenue = starterTenants * 145; // Lote médio de R$ 145 (5 análises)
    const totalAdHocRevenue = setupsRevenue + creditsSoldRevenue;

    // 3. Status breakdown
    const activeSubs = tenants.filter((t) => t.subscriptionStatus === "active").length;
    const pastDueSubs = tenants.filter((t) => t.subscriptionStatus === "past_due").length;
    const trialSubs = tenants.filter((t) => t.subscriptionStatus === "trial").length;
    const canceledSubs = tenants.filter((t) => t.subscriptionStatus === "canceled").length;

    // 4. Taxa de conversão de setup
    const convertedFromSetup = tenants.filter((t) => t.setupPurchased && t.migratedToPro).length;
    const setupConversionRate = setupsCount > 0 ? (convertedFromSetup / setupsCount) * 100 : 0;

    // 5. Comparativo com consultoria tradicional (R$ 4.666/mês)
    const consultingBenchmark = 4666;
    const mrrVsConsultingPct = ((mrr / consultingBenchmark) * 100).toFixed(1);

    // Funil de adoção (Passo 1 a 4)
    const step1 = tenants.length; // todos fizeram signup
    const step2 = tenants.filter((t) => t.onboardingStep >= 2).length;
    const step3 = tenants.filter((t) => t.onboardingStep >= 3).length;
    const step4 = tenants.filter((t) => t.onboardingStep === 4).length;

    // Tenants em risco de abandono (pararam no passo 1 ou 2)
    const atRiskTenants = tenants.filter((t) => t.onboardingStep < 3 && t.subscriptionStatus !== "canceled");

    return {
      mrr,
      setupsCount,
      setupsRevenue,
      totalAdHocRevenue,
      activeSubs,
      pastDueSubs,
      trialSubs,
      canceledSubs,
      setupConversionRate: setupConversionRate.toFixed(1),
      convertedFromSetup,
      consultingBenchmark,
      mrrVsConsultingPct,
      funnel: {
        step1,
        step2,
        step3,
        step4,
      },
      atRiskTenantsCount: atRiskTenants.length,
      totalTenants: tenants.length,
    };
  }
}

export const adminStore = new SuperAdminDataStore();
