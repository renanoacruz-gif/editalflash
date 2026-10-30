/**
 * lib/business-days.ts
 * 
 * Cálculo rigoroso de dias úteis entre datas no Brasil.
 * Exclui finais de semana (sábado/domingo) e feriados nacionais brasileiros.
 */

// Feriados nacionais fixos e móveis de referência (2026/2027)
const FERIADOS_NACIONAIS = new Set([
  // 2026
  "2026-01-01", // Confraternização Universal
  "2026-02-17", // Carnaval
  "2026-04-03", // Sexta-feira Santa
  "2026-04-21", // Tiradentes
  "2026-05-01", // Dia do Trabalho
  "2026-06-04", // Corpus Christi
  "2026-09-07", // Independência do Brasil
  "2026-10-12", // Nossa Senhora Aparecida
  "2026-11-02", // Finados
  "2026-11-15", // Proclamação da República
  "2026-11-20", // Dia da Consciência Negra
  "2026-12-25", // Natal
  // 2027
  "2027-01-01",
  "2027-02-09",
  "2027-03-26",
  "2027-04-21",
  "2027-05-01",
  "2027-05-27",
  "2027-09-07",
  "2027-10-12",
  "2027-11-02",
  "2027-11-15",
  "2027-11-20",
  "2027-12-25",
]);

/**
 * Converte string DD/MM/YYYY ou YYYY-MM-DD em objeto Date no fuso local
 */
export function parseDateFlexible(dateStr: string): Date | null {
  if (!dateStr) return null;
  const clean = dateStr.trim();

  // Match DD/MM/YYYY
  const brMatch = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (brMatch) {
    const day = parseInt(brMatch[1], 10);
    const month = parseInt(brMatch[2], 10) - 1;
    const year = parseInt(brMatch[3], 10);
    return new Date(year, month, day, 23, 59, 59);
  }

  // Match YYYY-MM-DD
  const isoMatch = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    return new Date(year, month, day, 23, 59, 59);
  }

  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Retorna os dias úteis restantes entre hoje e a data limite de impugnação
 */
export function calculateRemainingBusinessDays(targetDateStr: string): {
  days: number;
  isExpired: boolean;
  isUrgent: boolean; // <= 2 dias úteis
  label: string;
} {
  const target = parseDateFlexible(targetDateStr);
  if (!target) {
    return { days: 0, isExpired: false, isUrgent: false, label: "Data não definida" };
  }

  const now = new Date();
  // Se já passou
  if (now > target) {
    return { days: 0, isExpired: true, isUrgent: false, label: "PRAZO EXPIRADO" };
  }

  let businessDays = 0;
  const current = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  while (current < end) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Domingo = 0, Sábado = 6
    
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, "0");
    const d = String(current.getDate()).padStart(2, "0");
    const dateKey = `${y}-${m}-${d}`;

    const isHoliday = FERIADOS_NACIONAIS.has(dateKey);

    if (!isWeekend && !isHoliday) {
      businessDays++;
    }
  }

  const isExpired = businessDays === 0 && now.getTime() > target.getTime();
  const isUrgent = businessDays <= 2 && !isExpired;

  return {
    days: businessDays,
    isExpired,
    isUrgent,
    label: isExpired
      ? "PRAZO EXPIRADO"
      : businessDays === 1
      ? "Restam 1 dia útil"
      : `Restam ${businessDays} dias úteis`,
  };
}
