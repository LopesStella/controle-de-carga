export function Campo({
  rotulo,
  erro,
  opcional,
  children,
}: {
  rotulo: string;
  erro?: string;
  opcional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {rotulo}
        {opcional && <span className="font-normal text-slate-500"> (opcional)</span>}
      </span>
      {children}
      {erro && (
        <span role="alert" className="mt-1 block text-sm text-red-700">
          {erro}
        </span>
      )}
    </label>
  );
}
