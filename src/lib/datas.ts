/** Datas são guardadas como dia (sem hora), em UTC meia-noite. */
export function paraData(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

/** "2026-10-15" para preencher <input type="date">. */
export function dataParaCampo(data: Date): string {
  return data.toISOString().slice(0, 10);
}

/** "15/10/2026" */
export function formatarData(data: Date): string {
  const [a, m, d] = dataParaCampo(data).split("-");
  return `${d}/${m}/${a}`;
}

/** Data de hoje (fuso de Brasília) para valor inicial de formulário. */
export function hojeCampo(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" }).format(new Date());
}
