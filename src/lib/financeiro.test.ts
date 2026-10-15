import { describe, expect, it } from "vitest";
import { situacaoFinanceira, totalRecebido, valorPendente } from "./financeiro";

describe("financeiro", () => {
  const recs = [{ valor: 100000 }, { valor: 50000 }];

  it("soma os recebimentos", () => {
    expect(totalRecebido(recs)).toBe(150000);
    expect(totalRecebido([])).toBe(0);
  });

  it("pendente = frete - recebido", () => {
    expect(valorPendente(350000, recs)).toBe(200000);
    expect(valorPendente(350000, [])).toBe(350000);
    expect(valorPendente(150000, recs)).toBe(0);
  });

  it("situação é independente do status da viagem", () => {
    expect(situacaoFinanceira(350000, [])).toBe("PENDENTE");
    expect(situacaoFinanceira(350000, recs)).toBe("PARCIAL");
    expect(situacaoFinanceira(150000, recs)).toBe("QUITADO");
  });
});
