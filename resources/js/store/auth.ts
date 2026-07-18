import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/lib/permissions";
import axios from "axios";

export interface SessionUser {
  id: string | number;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthState {
  user: SessionUser | null;
  token: string | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: async (email, password = "password") => {
        try {
          const res = await axios.post("/api/v1/auth/login", { email, password });
          const { token, user } = res.data.data;
          
          // Save token to localStorage for axios interceptor
          localStorage.setItem("auth_token", token);
          
          set({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            token,
          });
        } catch (error) {
          console.error("Login failed", error);
          throw error;
        }
      },
      logout: () => {
        localStorage.removeItem("auth_token");
        set({ user: null, token: null });
      },
      isAuthenticated: () => !!get().token,
    }),
    { name: "knower-auth" },
  ),
);
