"use client";

import { btnPerigo } from "./ui";

/** Botão de exclusão que pede confirmação antes de enviar. */
export function BotaoExcluir({
  action,
  mensagem,
  rotulo = "Excluir",
  className = btnPerigo,
}: {
  action: () => Promise<void>;
  mensagem: string;
  rotulo?: string;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(mensagem)) e.preventDefault();
      }}
    >
      <button type="submit" className={className}>
        {rotulo}
      </button>
    </form>
  );
}
