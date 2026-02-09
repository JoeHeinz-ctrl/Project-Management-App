import api from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
}

// Login user
export const loginUser = (data: LoginPayload) => {
  return api.post("/auth/login", data);
};

// Register user
export const registerUser = (data: RegisterPayload) => {
  return api.post("/auth/register", data);
};

