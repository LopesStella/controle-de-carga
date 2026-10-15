import { describe, expect, it } from "vitest";
import { centavosParaCampo, reaisParaCentavos } from "./dinheiro";

describe("reaisParaCentavos", () => {
  it.each([
    ["3500", 350000],
    ["3500,00", 350000],
    ["3.500,00", 350000],
    ["1234,5", 123450],
    ["1234.56", 123456],
    ["3.500", 350000],
    ["R$ 50", 5000],
    ["0,01", 1],
  ])("converte %s", (entrada, esperado) => {
    expect(reaisParaCentavos(entrada)).toBe(esperado);
  });

  it.each(["", "abc", "12,345", "-5", "1,2,3", "10 20"])("rejeita '%s'", (entrada) => {
    expect(reaisParaCentavos(entrada)).toBeNull();
  });

  it("volta ao texto de campo", () => {
    expect(centavosParaCampo(123456)).toBe("1234,56");
  });
});
