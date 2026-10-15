"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatarReais } from "@/lib/dinheiro";
import { paraData } from "@/lib/datas";
import {
  cargaSchema,
  errosPorCampo,
  formDataParaObjeto,
  recebimentoSchema,
  statusSchema,
} from "@/lib/validacao";

export type FormState = {
  erros?: Record<string, string>;
  /** Valores digitados, para reexibir o formulário após um erro. */
  valores?: Record<string, string>;
};

function falha(fd: FormData, erros: Record<string, string>): FormState {
  return { erros, valores: formDataParaObjeto(fd) };
}

const ERRO_GERAL = "Não foi possível salvar. Tente novamente.";

/* ---------- Cargas ---------- */

export async function criarCarga(_: FormState, fd: FormData): Promise<FormState> {
  const r = cargaSchema.safeParse(formDataParaObjeto(fd));
  if (!r.success) return falha(fd, errosPorCampo(r.error));

  let id: string;
  try {
    const carga = await prisma.carga.create({ data: { ...r.data, data: paraData(r.data.data) } });
    id = carga.id;
  } catch {
    return falha(fd, { _: ERRO_GERAL });
  }
  revalidatePath("/");
  redirect(`/cargas/${id}`);
}

export async function atualizarCarga(id: string, _: FormState, fd: FormData): Promise<FormState> {
  const r = cargaSchema.safeParse(formDataParaObjeto(fd));
  if (!r.success) return falha(fd, errosPorCampo(r.error));

  try {
    const resultado = await prisma.$transaction(async (tx) => {
      const soma = await tx.recebimento.aggregate({ where: { cargaId: id }, _sum: { valor: true } });
      const recebido = soma._sum.valor ?? 0;
      if (r.data.valorFrete < recebido) return { recebido };
      await tx.carga.update({ where: { id }, data: { ...r.data, data: paraData(r.data.data) } });
      return null;
    });
    if (resultado) {
      return falha(fd, {
        valorFrete: `O frete não pode ser menor que o total já recebido (${formatarReais(resultado.recebido)}).`,
      });
    }
  } catch {
    return falha(fd, { _: ERRO_GERAL });
  }
  revalidatePath("/");
  revalidatePath(`/cargas/${id}`);
  redirect(`/cargas/${id}`);
}

export async function alterarStatus(id: string, fd: FormData): Promise<void> {
  const r = statusSchema.safeParse(fd.get("status"));
  if (!r.success) return;
  await prisma.carga.update({ where: { id }, data: { status: r.data } });
  revalidatePath("/");
  revalidatePath(`/cargas/${id}`);
}

export async function excluirCarga(id: string): Promise<void> {
  await prisma.carga.deleteMany({ where: { id } });
  revalidatePath("/");
  redirect("/");
}

/* ---------- Recebimentos ---------- */

function msgExcedeFrete(pendente: number) {
  return pendente > 0
    ? `O valor ultrapassa o frete. Ainda faltam ${formatarReais(pendente)} a receber.`
    : "Esta carga já está totalmente recebida.";
}

export async function registrarRecebimento(cargaId: string, _: FormState, fd: FormData): Promise<FormState> {
  const r = recebimentoSchema.safeParse(formDataParaObjeto(fd));
  if (!r.success) return falha(fd, errosPorCampo(r.error));

  try {
    const excedeu = await prisma.$transaction(async (tx) => {
      const carga = await tx.carga.findUnique({
        where: { id: cargaId },
        select: { valorFrete: true, recebimentos: { select: { valor: true } } },
      });
      if (!carga) return { pendente: 0 };
      const pendente = carga.valorFrete - carga.recebimentos.reduce((s, x) => s + x.valor, 0);
      if (r.data.valor > pendente) return { pendente };
      await tx.recebimento.create({ data: { ...r.data, data: paraData(r.data.data), cargaId } });
      return null;
    });
    if (excedeu) return falha(fd, { valor: msgExcedeFrete(excedeu.pendente) });
  } catch {
    return falha(fd, { _: ERRO_GERAL });
  }
  revalidatePath("/");
  revalidatePath(`/cargas/${cargaId}`);
  // Limpa o formulário: novo estado sem erros nem valores.
  return {};
}

export async function atualizarRecebimento(
  cargaId: string,
  recebimentoId: string,
  _: FormState,
  fd: FormData,
): Promise<FormState> {
  const r = recebimentoSchema.safeParse(formDataParaObjeto(fd));
  if (!r.success) return falha(fd, errosPorCampo(r.error));

  try {
    const excedeu = await prisma.$transaction(async (tx) => {
      const carga = await tx.carga.findUnique({
        where: { id: cargaId },
        select: { valorFrete: true, recebimentos: { select: { id: true, valor: true } } },
      });
      if (!carga) return { pendente: 0 };
      const outros = carga.recebimentos.filter((x) => x.id !== recebimentoId).reduce((s, x) => s + x.valor, 0);
      const pendente = carga.valorFrete - outros;
      if (r.data.valor > pendente) return { pendente };
      await tx.recebimento.update({
        where: { id: recebimentoId, cargaId },
        data: { ...r.data, data: paraData(r.data.data) },
      });
      return null;
    });
    if (excedeu) return falha(fd, { valor: msgExcedeFrete(excedeu.pendente) });
  } catch {
    return falha(fd, { _: ERRO_GERAL });
  }
  revalidatePath("/");
  revalidatePath(`/cargas/${cargaId}`);
  redirect(`/cargas/${cargaId}`);
}

export async function excluirRecebimento(cargaId: string, recebimentoId: string): Promise<void> {
  await prisma.recebimento.deleteMany({ where: { id: recebimentoId, cargaId } });
  revalidatePath("/");
  revalidatePath(`/cargas/${cargaId}`);
}
