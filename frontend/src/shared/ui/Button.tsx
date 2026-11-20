import type { ButtonHTMLAttributes } from "react";

type Variante = "primario" | "secundario" | "peligro" | "contorno";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

const estilos: Record<Variante, string> = {
  primario: "bg-blue-600 text-white hover:bg-blue-700",
  secundario: "bg-slate-200 text-slate-800 hover:bg-slate-300",
  peligro: "bg-red-600 text-white hover:bg-red-700",
  contorno: "border border-blue-600 text-blue-600 hover:bg-blue-50",
};

function Button({ variante = "primario", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-md px-3 py-2 text-sm font-medium transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${estilos[variante]} ${className}`}
      {...props}
    />
  );
}

export default Button;
