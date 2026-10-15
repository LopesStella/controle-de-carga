"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/app/actions";
import { FORMAS_PAGAMENTO, FORMA_LABEL } from "@/lib/status";
import { Campo } from "./Campo";
import { btnPrimario, btnSecundario, inputCls } from "./ui";

export type RecebimentoValores = {
  data: string;
  valor: string;
  formaPagamento: string;
  observacao: string;
};

export function RecebimentoForm({
  action,
  inicial,
  rotuloEnviar,
  cancelarHref,
}: {
  action: (state: FormState, fd: FormData) => Promise<FormState>;
  inicial: RecebimentoValores;
  rotuloEnviar: string;
  cancelarHref?: string;
}) {
  const [state, formAction, pendente] = useActionState(action, {} as FormState);
  const e = state.erros ?? {};
  const v = (campo: keyof RecebimentoValores) => state.valores?.[campo] ?? inicial[campo];
  const chave = state.valores ? JSON.stringify(state.valores) : "inicial";

  return (
    <form key={chave} action={formAction} className="space-y-4">
      {e._ && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {e._}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Data" erro={e.data}>
          <input type="date" name="data" required defaultValue={v("data")} className={inputCls} />
        </Campo>
        <Campo rotulo="Valor (R$)" erro={e.valor}>
          <input name="valor" required inputMode="decimal" defaultValue={v("valor")} className={inputCls} placeholder="1500,00" />
        </Campo>
      </div>

      <Campo rotulo="Forma de pagamento" erro={e.formaPagamento}>
        <select name="formaPagamento" required defaultValue={v("formaPagamento")} className={inputCls}>
          <option value="" disabled>
            Escolha...
          </option>
          {FORMAS_PAGAMENTO.map((f) => (
            <option key={f} value={f}>
              {FORMA_LABEL[f]}
            </option>
          ))}
        </select>
      </Campo>

      <Campo rotulo="Observação" opcional erro={e.observacao}>
        <input name="observacao" maxLength={500} defaultValue={v("observacao")} className={inputCls} />
      </Campo>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={pendente} className={btnPrimario}>
          {pendente ? "Salvando..." : rotuloEnviar}
        </button>
        {cancelarHref && (
          <Link href={cancelarHref} className={btnSecundario}>
            Cancelar
          </Link>
        )}
      </div>
    </form>
  );
}
