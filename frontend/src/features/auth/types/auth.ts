// Mismos nombres de campo que los schemas del backend (UserPublic, UserCreate)

export type Rol = "user" | "admin";

export interface Usuario {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: Rol;
  disabled: boolean;
  created_at: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  full_name: string;
  email: string;
  password: string;
}

export interface MensajeResponse {
  message: string;
}
