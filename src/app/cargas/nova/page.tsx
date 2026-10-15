import { criarCarga } from "@/app/actions";
import { CargaForm } from "@/components/CargaForm";
import { cartao } from "@/components/ui";
import { hojeCampo } from "@/lib/datas";

export const dynamic = "force-dynamic";

export default function NovaCarga() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Nova Carga</h1>
      <div className={cartao}>
        <CargaForm
          action={criarCarga}
          cancelarHref="/"
          rotuloEnviar="Salvar carga"
          inicial={{
            data: hojeCampo(),
            cliente: "",
            origem: "",
            destino: "",
            produto: "",
            pesoKg: "",
            valorFrete: "",
            status: "PLANEJADA",
            observacoes: "",
          }}
        />
      </div>
    </div>
  );
}
