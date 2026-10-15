import { z } from "zod";
import { reaisParaCentavos } from "./dinheiro";
import { FORMAS_PAGAMENTO, STATUS_VIAGEM } from "./status";

const texto = (rotulo: string, max = 120) =>
  z
    .string()
    .trim()
    .min(1, `Informe ${rotulo}.`)
    .max(max, `${rotulo[0].toUpperCase()}${rotulo.slice(1)} está muito longo.`);

const textoOpcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Texto muito longo (máximo ${max} caracteres).`)
    .transform((v) => (v === "" ? null : v));

const data = (mensagem: string) =>
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, mensagem)
    .refine((v) => {
      const d = new Date(`${v}T00:00:00.000Z`);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
    }, mensagem);

const dinheiro = (mensagem: string) =>
  z
    .string()
    .transform((v) => reaisParaCentavos(v))
    .pipe(z.number({ error: mensagem }).int().positive("O valor deve ser maior que zero."));

export const cargaSchema = z.object({
  data: data("Informe uma data válida."),
  cliente: texto("o cliente"),
  origem: texto("a origem"),
  destino: texto("o destino"),
  produto: textoOpcional(120),
  pesoKg: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .pipe(
      z
        .string()
        .regex(/^\d+$/, "Peso deve ser um número inteiro de quilos.")
        .transform(Number)
        .pipe(z.number().int().positive("Peso deve ser maior que zero.").max(1_000_000, "Peso muito alto."))
        .nullable(),
    ),
  valorFrete: dinheiro("Informe um valor de frete válido (ex.: 3500,00)."),
  status: z.enum(STATUS_VIAGEM).default("PLANEJADA"),
  observacoes: textoOpcional(1000),
});

export const recebimentoSchema = z.object({
  data: data("Informe uma data válida."),
  valor: dinheiro("Informe um valor válido (ex.: 1500,00)."),
  formaPagamento: z.enum(FORMAS_PAGAMENTO, { error: "Escolha a forma de pagamento." }),
  observacao: textoOpcional(500),
});

export const statusSchema = z.enum(STATUS_VIAGEM, { error: "Status inválido." });

export type CargaInput = z.infer<typeof cargaSchema>;
export type RecebimentoInput = z.infer<typeof recebimentoSchema>;

/** Primeira mensagem de erro por campo. */
export function errosPorCampo(erro: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of erro.issues) {
    const campo = String(issue.path[0] ?? "_");
    out[campo] ??= issue.message;
  }
  return out;
}

/** Converte FormData em objeto de strings (ignora arquivos). */
export function formDataParaObjeto(fd: FormData): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v === "string" && !k.startsWith("$ACTION")) obj[k] = v;
  }
  return obj;
}
