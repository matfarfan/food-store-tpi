import { useForm } from "@tanstack/react-form";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";
import type { DatosCheckout, FormaPago } from "../types/pedido";

interface CheckoutFormProps {
  enviando: boolean;
  errorApi: string | null;
  onConfirmar: (datos: DatosCheckout) => void;
}

const valoresIniciales: DatosCheckout = { direccion_entrega: "", forma_pago: "EFECTIVO", notas: "" };

// Formulario con TanStack Form (como FormProduct de la A2 de la Unidad 8):
// valida y entrega los datos; la página decide qué hacer con ellos.
function CheckoutForm({ enviando, errorApi, onConfirmar }: CheckoutFormProps) {
  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) => onConfirmar(value),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {/* RN-06: dirección de 5 a 200 caracteres (igual que el schema PedidoCreate) */}
      <form.Field
        name="direccion_entrega"
        validators={{
          onChange: ({ value }) => {
            const largo = value.trim().length;
            if (largo < 5) return "La dirección debe tener al menos 5 caracteres";
            if (largo > 200) return "La dirección no puede superar los 200 caracteres";
            return undefined;
          },
        }}
      >
        {(f) => (
          <Input
            id="direccion_entrega"
            label="Dirección de entrega"
            placeholder="Calle, número, piso..."
            maxLength={200}
            value={f.state.value}
            onBlur={f.handleBlur}
            onChange={(e) => f.handleChange(e.target.value)}
            error={f.state.meta.errors[0]}
          />
        )}
      </form.Field>

      {/* RN-06: forma de pago EFECTIVO o TRANSFERENCIA */}
      <form.Field name="forma_pago">
        {(f) => (
          <fieldset>
            <legend className="mb-1 text-sm font-medium text-slate-700">Forma de pago</legend>
            <div className="flex gap-4">
              {(["EFECTIVO", "TRANSFERENCIA"] as FormaPago[]).map((opcion) => (
                <label key={opcion} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="forma_pago"
                    value={opcion}
                    checked={f.state.value === opcion}
                    onChange={() => f.handleChange(opcion)}
                  />
                  {opcion === "EFECTIVO" ? "Efectivo" : "Transferencia"}
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </form.Field>

      <form.Field name="notas">
        {(f) => (
          <div className="space-y-1">
            <label htmlFor="notas" className="block text-sm font-medium text-slate-700">
              Notas (opcional)
            </label>
            <textarea
              id="notas"
              rows={3}
              placeholder="Ej.: sin aceitunas, tocar timbre 2B"
              value={f.state.value}
              onBlur={f.handleBlur}
              onChange={(e) => f.handleChange(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        )}
      </form.Field>

      {errorApi && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errorApi}</p>}

      <Button type="submit" disabled={enviando} className="w-full">
        {enviando ? "Confirmando..." : "Confirmar pedido"}
      </Button>
    </form>
  );
}

export default CheckoutForm;
