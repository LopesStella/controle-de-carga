import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { btnPrimario, cartao } from "@/components/ui";
import { formatarData } from "@/lib/datas";
import { prisma } from "@/lib/db";
import { formatarReais } from "@/lib/dinheiro";
import { SITUACAO_LABEL, situacaoFinanceira, totalRecebido, valorPendente } from "@/lib/financeiro";

export const dynamic = "force-dynamic";

const COR_SITUACAO = {
  PENDENTE: "text-red-700",
  PARCIAL: "text-amber-700",
  QUITADO: "text-green-700",
} as const;

export default async function MinhasCargas() {
  const cargas = await prisma.carga.findMany({
    orderBy: [{ data: "desc" }, { numero: "desc" }],
    include: { recebimentos: { select: { valor: true } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Minhas Cargas</h1>
        <Link href="/cargas/nova" className={`${btnPrimario} !w-auto`}>
          + Nova Carga
        </Link>
      </div>

      {cargas.length === 0 ? (
        <div className={`${cartao} text-center text-slate-600`}>
          <p>Nenhuma carga cadastrada ainda.</p>
          <p className="mt-1 text-sm">Toque em &ldquo;Nova Carga&rdquo; para começar.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {cargas.map((c) => {
            const situacao = situacaoFinanceira(c.valorFrete, c.recebimentos);
            return (
              <li key={c.id}>
                <Link href={`/cargas/${c.id}`} className={`${cartao} block active:bg-slate-50`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm text-slate-500">
                      Carga nº {c.numero} · {formatarData(c.data)}
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="mt-1 font-semibold">{c.cliente}</div>
                  <div className="text-slate-700">
                    {c.origem} → {c.destino}
                  </div>
                  <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <dt className="text-slate-500">Frete</dt>
                      <dd className="font-semibold">{formatarReais(c.valorFrete)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Recebido</dt>
                      <dd className="font-semibold">{formatarReais(totalRecebido(c.recebimentos))}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Falta</dt>
                      <dd className={`font-semibold ${COR_SITUACAO[situacao]}`}>
                        {situacao === "QUITADO" ? SITUACAO_LABEL.QUITADO : formatarReais(valorPendente(c.valorFrete, c.recebimentos))}
                      </dd>
                    </div>
                  </dl>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
