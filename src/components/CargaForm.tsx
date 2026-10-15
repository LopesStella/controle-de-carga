"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/app/actions";
import { STATUS_LABEL, STATUS_VIAGEM } from "@/lib/status";
import { Campo } from "./Campo";
import { btnPrimario, btnSecundario, inputCls } from "./ui";

export type CargaValores = {
  data: string;
  cliente: string;
  origem: string;
  destino: string;
  produto: string;
  pesoKg: string;
  valorFrete: string;
  status: string;
  observacoes: string;
};

export function CargaForm({
  action,
  inicial,
  cancelarHref,
  rotuloEnviar,
}: {
  action: (state: FormState, fd: FormData) => Promise<FormState>;
  inicial: CargaValores;
  cancelarHref: string;
  rotuloEnviar: string;
}) {
  const [state, formAction, pendente] = useActionState(action, {} as FormState);
  const e = state.erros ?? {};
  const v = (campo: keyof CargaValores) => state.valores?.[campo] ?? inicial[campo];
  // Nova chave após um envio com erro, para reaplicar os valores digitados.
  const chave = state.valores ? JSON.stringify(state.valores) : "inicial";

  return (
    <form key={chave} action={formAction} className="space-y-4">
      {e._ && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {e._}
        </p>
      )}

      <Campo rotulo="Data" erro={e.data}>
        <input type="date" name="data" required defaultValue={v("data")} className={inputCls} />
      </Campo>

      <Campo rotulo="Cliente ou contratante" erro={e.cliente}>
        <input name="cliente" required maxLength={120} defaultValue={v("cliente")} className={inputCls} />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Origem" erro={e.origem}>
          <input name="origem" required maxLength={120} defaultValue={v("origem")} className={inputCls} placeholder="Cidade/UF" />
        </Campo>
        <Campo rotulo="Destino" erro={e.destino}>
          <input name="destino" required maxLength={120} defaultValue={v("destino")} className={inputCls} placeholder="Cidade/UF" />
        </Campo>
      </div>

      <Campo rotulo="Tipo/produto da carga" opcional erro={e.produto}>
        <input name="produto" maxLength={120} defaultValue={v("produto")} className={inputCls} />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Peso (kg)" opcional erro={e.pesoKg}>
          <input name="pesoKg" inputMode="numeric" defaultValue={v("pesoKg")} className={inputCls} placeholder="27500" />
        </Campo>
        <Campo rotulo="Valor do frete (R$)" erro={e.valorFrete}>
          <input name="valorFrete" required inputMode="decimal" defaultValue={v("valorFrete")} className={inputCls} placeholder="3500,00" />
        </Campo>
      </div>

      <Campo rotulo="Status da viagem" erro={e.status}>
        <select name="status" defaultValue={v("status")} className={inputCls}>
          {STATUS_VIAGEM.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </Campo>

      <Campo rotulo="Observações" opcional erro={e.observacoes}>
        <textarea name="observacoes" rows={3} maxLength={1000} defaultValue={v("observacoes")} className={inputCls} />
      </Campo>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button type="submit" disabled={pendente} className={btnPrimario}>
          {pendente ? "Salvando..." : rotuloEnviar}
        </button>
        <Link href={cancelarHref} className={btnSecundario}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
