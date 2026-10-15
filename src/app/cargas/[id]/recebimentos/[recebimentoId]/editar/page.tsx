import { notFound } from "next/navigation";
import { atualizarRecebimento } from "@/app/actions";
import { RecebimentoForm } from "@/components/RecebimentoForm";
import { cartao } from "@/components/ui";
import { dataParaCampo } from "@/lib/datas";
import { prisma } from "@/lib/db";
import { centavosParaCampo } from "@/lib/dinheiro";

export const dynamic = "force-dynamic";

export default async function EditarRecebimento({
  params,
}: {
  params: Promise<{ id: string; recebimentoId: string }>;
}) {
  const { id, recebimentoId } = await params;
  const recebimento = await prisma.recebimento.findFirst({
    where: { id: recebimentoId, cargaId: id },
    include: { carga: { select: { numero: true } } },
  });
  if (!recebimento) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Editar recebimento · Carga nº {recebimento.carga.numero}</h1>
      <div className={cartao}>
        <RecebimentoForm
          action={atualizarRecebimento.bind(null, id, recebimentoId)}
          cancelarHref={`/cargas/${id}`}
          rotuloEnviar="Salvar alterações"
          inicial={{
            data: dataParaCampo(recebimento.data),
            valor: centavosParaCampo(recebimento.valor),
            formaPagamento: recebimento.formaPagamento,
            observacao: recebimento.observacao ?? "",
          }}
        />
      </div>
    </div>
  );
}
