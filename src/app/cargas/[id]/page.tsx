import Link from "next/link";
import { notFound } from "next/navigation";
import { alterarStatus, excluirCarga, excluirRecebimento, registrarRecebimento } from "@/app/actions";
import { BotaoExcluir } from "@/components/BotaoExcluir";
import { RecebimentoForm } from "@/components/RecebimentoForm";
import { StatusBadge } from "@/components/StatusBadge";
import { btnSecundario, cartao, inputCls } from "@/components/ui";
import { formatarData, hojeCampo } from "@/lib/datas";
import { prisma } from "@/lib/db";
import { centavosParaCampo, formatarReais } from "@/lib/dinheiro";
import { SITUACAO_LABEL, situacaoFinanceira, totalRecebido, valorPendente } from "@/lib/financeiro";
import { FORMA_LABEL, STATUS_LABEL, STATUS_VIAGEM } from "@/lib/status";

export const dynamic = "force-dynamic";

const COR_SITUACAO = {
  PENDENTE: "bg-red-100 text-red-800",
  PARCIAL: "bg-amber-100 text-amber-800",
  QUITADO: "bg-green-100 text-green-800",
} as const;

function Dado({ rotulo, valor }: { rotulo: string; valor: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-slate-500">{rotulo}</dt>
      <dd className="font-medium break-words">{valor}</dd>
    </div>
  );
}

export default async function DetalhesCarga({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const carga = await prisma.carga.findUnique({
    where: { id },
    include: { recebimentos: { orderBy: [{ data: "asc" }, { criadoEm: "asc" }] } },
  });
  if (!carga) notFound();

  const recebido = totalRecebido(carga.recebimentos);
  const pendente = valorPendente(carga.valorFrete, carga.recebimentos);
  const situacao = situacaoFinanceira(carga.valorFrete, carga.recebimentos);

  return (
    <div className="space-y-5">
      <Link href="/" className="text-sm font-medium text-blue-700">
        ← Minhas Cargas
      </Link>

      <div className="flex items-start justify-between gap-2">
        <h1 className="text-xl font-bold">Carga nº {carga.numero}</h1>
        <StatusBadge status={carga.status} />
      </div>

      <section className={cartao}>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Dado rotulo="Data" valor={formatarData(carga.data)} />
          <Dado rotulo="Cliente" valor={carga.cliente} />
          <Dado rotulo="Origem" valor={carga.origem} />
          <Dado rotulo="Destino" valor={carga.destino} />
          <Dado rotulo="Produto" valor={carga.produto ?? "—"} />
          <Dado
            rotulo="Peso"
            valor={carga.pesoKg != null ? `${carga.pesoKg.toLocaleString("pt-BR")} kg` : "—"}
          />
        </dl>
        {carga.observacoes && (
          <div className="mt-3 border-t border-slate-100 pt-3">
            <div className="text-sm text-slate-500">Observações</div>
            <p className="whitespace-pre-wrap break-words">{carga.observacoes}</p>
          </div>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link href={`/cargas/${id}/editar`} className={btnSecundario}>
            Editar carga
          </Link>
          <BotaoExcluir
            action={excluirCarga.bind(null, id)}
            rotulo="Excluir carga"
            mensagem={`Excluir a carga nº ${carga.numero}${
              carga.recebimentos.length ? ` e seus ${carga.recebimentos.length} recebimento(s)` : ""
            }? Esta ação não pode ser desfeita.`}
          />
        </div>
      </section>

      <section className={cartao}>
        <h2 className="mb-2 font-bold">Status da viagem</h2>
        <form action={alterarStatus.bind(null, id)} className="flex flex-col gap-3 sm:flex-row">
          <select name="status" defaultValue={carga.status} className={inputCls} aria-label="Status da viagem">
            {STATUS_VIAGEM.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <button type="submit" className={`${btnSecundario} sm:whitespace-nowrap`}>
            Atualizar status
          </button>
        </form>
      </section>

      <section className={cartao}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-bold">Financeiro</h2>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${COR_SITUACAO[situacao]}`}>
            {SITUACAO_LABEL[situacao]}
          </span>
        </div>
        <dl className="grid grid-cols-3 gap-2">
          <div>
            <dt className="text-sm text-slate-500">Frete</dt>
            <dd className="font-bold">{formatarReais(carga.valorFrete)}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Recebido</dt>
            <dd className="font-bold text-green-700">{formatarReais(recebido)}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Falta receber</dt>
            <dd className={`font-bold ${pendente > 0 ? "text-red-700" : "text-green-700"}`}>
              {formatarReais(pendente)}
            </dd>
          </div>
        </dl>
      </section>

      <section className={cartao}>
        <h2 className="mb-3 font-bold">Recebimentos</h2>
        {carga.recebimentos.length === 0 ? (
          <p className="text-slate-600">Nenhum recebimento registrado.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {carga.recebimentos.map((r) => (
              <li key={r.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold">{formatarReais(r.valor)}</span>
                  <span className="text-sm text-slate-500">
                    {formatarData(r.data)} · {FORMA_LABEL[r.formaPagamento]}
                  </span>
                </div>
                {r.observacao && <p className="text-sm break-words text-slate-600">{r.observacao}</p>}
                <div className="mt-2 flex gap-2">
                  <Link
                    href={`/cargas/${id}/recebimentos/${r.id}/editar`}
                    className={`${btnSecundario} !min-h-10 !w-auto !py-1.5 !text-sm`}
                  >
                    Editar
                  </Link>
                  <BotaoExcluir
                    action={excluirRecebimento.bind(null, id, r.id)}
                    mensagem={`Excluir o recebimento de ${formatarReais(r.valor)}? Esta ação não pode ser desfeita.`}
                    className="inline-flex min-h-10 items-center rounded-lg border border-red-300 bg-white px-4 py-1.5 text-sm font-semibold text-red-700 active:bg-red-50"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={cartao}>
        <h2 className="mb-3 font-bold">Registrar recebimento</h2>
        {pendente > 0 ? (
          <RecebimentoForm
            action={registrarRecebimento.bind(null, id)}
            rotuloEnviar="Registrar recebimento"
            inicial={{
              data: hojeCampo(),
              valor: centavosParaCampo(pendente),
              formaPagamento: "",
              observacao: "",
            }}
          />
        ) : (
          <p className="text-slate-600">Esta carga já foi totalmente recebida.</p>
        )}
      </section>
    </div>
  );
}
