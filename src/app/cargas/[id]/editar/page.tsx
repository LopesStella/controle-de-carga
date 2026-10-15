import { notFound } from "next/navigation";
import { atualizarCarga } from "@/app/actions";
import { CargaForm } from "@/components/CargaForm";
import { cartao } from "@/components/ui";
import { dataParaCampo } from "@/lib/datas";
import { prisma } from "@/lib/db";
import { centavosParaCampo } from "@/lib/dinheiro";

export const dynamic = "force-dynamic";

export default async function EditarCarga({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const carga = await prisma.carga.findUnique({ where: { id } });
  if (!carga) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Editar Carga nº {carga.numero}</h1>
      <div className={cartao}>
        <CargaForm
          action={atualizarCarga.bind(null, id)}
          cancelarHref={`/cargas/${id}`}
          rotuloEnviar="Salvar alterações"
          inicial={{
            data: dataParaCampo(carga.data),
            cliente: carga.cliente,
            origem: carga.origem,
            destino: carga.destino,
            produto: carga.produto ?? "",
            pesoKg: carga.pesoKg?.toString() ?? "",
            valorFrete: centavosParaCampo(carga.valorFrete),
            status: carga.status,
            observacoes: carga.observacoes ?? "",
          }}
        />
      </div>
    </div>
  );
}
