const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata centavos como "R$ 1.234,56". */
export function formatarReais(centavos: number): string {
  return brl.format(centavos / 100);
}

/** Centavos como texto editável ("1234,56"), para preencher campos. */
export function centavosParaCampo(centavos: number): string {
  return (centavos / 100).toFixed(2).replace(".", ",");
}

/**
 * Converte texto digitado ("1.234,56", "1234,5", "1234.56", "R$ 50") em centavos.
 * Retorna null se o texto não for um valor monetário válido.
 */
export function reaisParaCentavos(texto: string): number | null {
  let s = texto.replace(/^\s*R\$/, "").trim();
  if (!s) return null;

  if (s.includes(",")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, "");
  }

  const m = /^(\d+)(?:\.(\d{1,2}))?$/.exec(s);
  if (!m) return null;

  const centavos = Number(m[1]) * 100 + Number((m[2] ?? "").padEnd(2, "0") || 0);
  return Number.isSafeInteger(centavos) && centavos <= 2_000_000_000 ? centavos : null;
}
