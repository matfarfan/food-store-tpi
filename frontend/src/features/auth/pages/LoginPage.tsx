import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { handleApiError } from "../../../shared/api/handleApiError";
import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";
import Input from "../../../shared/ui/Input";
import { useAuthStore } from "../../../store/authStore";
import type { LoginData } from "../types/auth";

const valoresIniciales: LoginData = { username: "", password: "" };

interface EstadoNavegacion {
  desde?: string; // ruta protegida a la que se quería entrar (la manda ProtectedRoute)
  mensaje?: string; // aviso que manda el registro
}

function LoginPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const estado = (useLocation().state ?? {}) as EstadoNavegacion;
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: async ({ value }) => {
      setErrorApi(null);
      try {
        await login(value.username.trim(), value.password);
        navigate(estado.desde ?? "/", { replace: true });
      } catch (error) {
        setErrorApi(handleApiError(error)); // se muestra sin recargar la página
      }
    },
  });

  if (usuario) return <Navigate to="/" replace />; // ya tiene sesión

  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Iniciar sesión</h1>
        {estado.mensaje && (
          <p className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{estado.mensaje}</p>
        )}
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
              onChange: ({ value }) => (!value.trim() ? "Ingresá tu usuario" : undefined),
            }}
          >
            {(f) => (
              <Input
                id="username"
                label="Usuario"
                autoComplete="username"
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
              onChange: ({ value }) => (!value ? "Ingresá tu contraseña" : undefined),
            }}
          >
            {(f) => (
              <Input
                id="password"
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                value={f.state.value}
                onBlur={f.handleBlur}
                onChange={(e) => f.handleChange(e.target.value)}
                error={f.state.meta.errors[0]}
              />
            )}
          </form.Field>

          {errorApi && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errorApi}</p>}

          <form.Subscribe selector={(s) => s.isSubmitting}>
            {(enviando) => (
              <Button type="submit" disabled={enviando} className="w-full">
                {enviando ? "Ingresando..." : "Ingresar"}
              </Button>
            )}
          </form.Subscribe>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Registrate
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default LoginPage;
