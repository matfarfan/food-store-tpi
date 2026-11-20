import { api } from "../../../shared/api/axiosInstance";
import type { LoginData, MensajeResponse, RegisterData, Usuario } from "../types/auth";

/** POST /auth/token: el backend espera un formulario OAuth2, no JSON. */
export async function login(datos: LoginData): Promise<MensajeResponse> {
  const formulario = new URLSearchParams();
  formulario.append("username", datos.username);
  formulario.append("password", datos.password);
  // La respuesta trae la cookie HttpOnly: el navegador la guarda solo
  const { data } = await api.post<MensajeResponse>("/auth/token", formulario);
  return data;
}

export async function registrar(datos: RegisterData): Promise<Usuario> {
  const { data } = await api.post<Usuario>("/auth/register", datos);
  return data;
}

export async function logout(): Promise<MensajeResponse> {
  const { data } = await api.post<MensajeResponse>("/auth/logout");
  return data;
}

export async function obtenerPerfil(): Promise<Usuario> {
  const { data } = await api.get<Usuario>("/auth/me");
  return data;
}
