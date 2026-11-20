import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { handleApiError } from "../../../shared/api/handleApiError";
import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";
import Input from "../../../shared/ui/Input";
import { registrar } from "../api/auth";
import type { RegisterData } from "../types/auth";

const valoresIniciales: RegisterData = { username: "", full_name: "", email: "", password: "" };

// Mismas reglas que UserCreate en el backend
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterPage() {
  const navigate = useNavigate();

  const registrarMutation = useMutation({
    mutationFn: registrar,
    onSuccess: () => {
      navigate("/login", { state: { mensaje: "Cuenta creada. Ya podés iniciar sesión." } });
    },
  });

  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) => {
      registrarMutation.mutate({
        ...value,
        username: value.username.trim(),
        full_name: value.full_name.trim(),
        email: value.email.trim(),
      });
    },
  });

  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Crear cuenta</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) =>
                value.trim().length < 3 ? "Mínimo 3 caracteres" : undefined,
            }}
          >
            {(f) => (
              <Input
                id="username"
                label="Usuario"
                autoComplete="username"
                maxLength={50}
                value={f.state.value}
                onBlur={f.handleBlur}
                onChange={(e) => f.handleChange(e.target.value)}
                error={f.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="full_name"
            validators={{
              onChange: ({ value }) => (!value.trim() ? "Ingresá tu nombre" : undefined),
            }}
          >
            {(f) => (
              <Input
                id="full_name"
                label="Nombre completo"
                autoComplete="name"
                maxLength={100}
                value={f.state.value}
                onBlur={f.handleBlur}
                onChange={(e) => f.handleChange(e.target.value)}
                error={f.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                !EMAIL_VALIDO.test(value.trim()) ? "Ingresá un email válido" : undefined,
            }}
          >
            {(f) => (
              <Input
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                value={f.state.value}
                onBlur={f.handleBlur}
                onChange={(e) => f.handleChange(e.target.value)}
                error={f.state.meta.errors[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => (value.length < 8 ? "Mínimo 8 caracteres" : undefined),
            }}
          >
            {(f) => (
              <Input
                id="password"
                label="Contraseña"
                type="password"
                autoComplete="new-password"
                maxLength={72}
                value={f.state.value}
                onBlur={f.handleBlur}
                onChange={(e) => f.handleChange(e.target.value)}
                error={f.state.meta.errors[0]}
              />
            )}
          </form.Field>

          {registrarMutation.isError && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {handleApiError(registrarMutation.error)}
            </p>
          )}

          <Button type="submit" disabled={registrarMutation.isPending} className="w-full">
            {registrarMutation.isPending ? "Creando cuenta..." : "Registrarme"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default RegisterPage;
