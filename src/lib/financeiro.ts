export type SituacaoFinanceira = "PENDENTE" | "PARCIAL" | "QUITADO";

export function totalRecebido(recebimentos: { valor: number }[]): number {
  return recebimentos.reduce((soma, r) => soma + r.valor, 0);
}

/** Valor pendente = valor do frete - soma dos recebimentos. */
export function valorPendente(valorFrete: number, recebimentos: { valor: number }[]): number {
  return valorFrete - totalRecebido(recebimentos);
}

/** Situação financeira, derivada e independente do status da viagem. */
export function situacaoFinanceira(
  valorFrete: number,
  recebimentos: { valor: number }[],
): SituacaoFinanceira {
  const recebido = totalRecebido(recebimentos);
  if (recebido <= 0) return "PENDENTE";
  return recebido >= valorFrete ? "QUITADO" : "PARCIAL";
}

export const SITUACAO_LABEL: Record<SituacaoFinanceira, string> = {
  PENDENTE: "Pendente",
  PARCIAL: "Recebido em parte",
  QUITADO: "Quitado",
};
