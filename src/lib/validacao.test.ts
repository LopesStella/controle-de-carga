import { describe, expect, it } from "vitest";
import { cargaSchema, errosPorCampo, recebimentoSchema } from "./validacao";

const base = {
  data: "2026-10-15",
  cliente: " Transportes Silva ",
  origem: "Campinas/SP",
  destino: "Curitiba/PR",
  produto: "",
  pesoKg: "",
  valorFrete: "3.500,00",
  status: "PLANEJADA",
  observacoes: "",
};

describe("cargaSchema", () => {
  it("aceita só os campos obrigatórios e normaliza opcionais", () => {
    const r = cargaSchema.parse(base);
    expect(r).toMatchObject({
      cliente: "Transportes Silva",
      produto: null,
      pesoKg: null,
      valorFrete: 350000,
      observacoes: null,
    });
  });

  it("aceita peso em kg", () => {
    expect(cargaSchema.parse({ ...base, pesoKg: "27500" }).pesoKg).toBe(27500);
  });

  it("reporta erros dos obrigatórios", () => {
    const r = cargaSchema.safeParse({ ...base, cliente: "", origem: "", destino: " ", valorFrete: "", data: "" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(Object.keys(errosPorCampo(r.error)).sort()).toEqual(["cliente", "data", "destino", "origem", "valorFrete"]);
    }
  });

  it("rejeita frete zero, peso inválido e data inexistente", () => {
    expect(cargaSchema.safeParse({ ...base, valorFrete: "0" }).success).toBe(false);
    expect(cargaSchema.safeParse({ ...base, pesoKg: "12,5" }).success).toBe(false);
    expect(cargaSchema.safeParse({ ...base, data: "2026-02-30" }).success).toBe(false);
  });
});

describe("recebimentoSchema", () => {
  it("aceita um recebimento válido", () => {
    const r = recebimentoSchema.parse({ data: "2026-10-20", valor: "1500", formaPagamento: "PIX", observacao: "" });
    expect(r).toMatchObject({ valor: 150000, formaPagamento: "PIX", observacao: null });
  });

  it("rejeita forma de pagamento fora da lista e valor zero", () => {
    expect(recebimentoSchema.safeParse({ data: "2026-10-20", valor: "10", formaPagamento: "CHEQUE" }).success).toBe(false);
    expect(recebimentoSchema.safeParse({ data: "2026-10-20", valor: "0", formaPagamento: "PIX" }).success).toBe(false);
  });
});
