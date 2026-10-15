export const STATUS_VIAGEM = ["PLANEJADA", "EM_VIAGEM", "ENTREGUE", "FINALIZADA"] as const;
export type StatusViagem = (typeof STATUS_VIAGEM)[number];

export const STATUS_LABEL: Record<StatusViagem, string> = {
  PLANEJADA: "Planejada",
  EM_VIAGEM: "Em viagem",
  ENTREGUE: "Entregue",
  FINALIZADA: "Finalizada",
};

export const STATUS_COR: Record<StatusViagem, string> = {
  PLANEJADA: "bg-slate-100 text-slate-700",
  EM_VIAGEM: "bg-blue-100 text-blue-800",
  ENTREGUE: "bg-amber-100 text-amber-800",
  FINALIZADA: "bg-green-100 text-green-800",
};

export const FORMAS_PAGAMENTO = ["PIX", "DINHEIRO", "TRANSFERENCIA", "BOLETO", "OUTRO"] as const;
export type FormaPagamento = (typeof FORMAS_PAGAMENTO)[number];

export const FORMA_LABEL: Record<FormaPagamento, string> = {
  PIX: "PIX",
  DINHEIRO: "Dinheiro",
  TRANSFERENCIA: "Transferência",
  BOLETO: "Boleto",
  OUTRO: "Outro",
};
