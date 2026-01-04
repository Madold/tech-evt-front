import { LoginResponse } from "@/responses/login.response";
import { Result } from "@/types/result.type";
import Cookies from "js-cookie";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<Result<void>>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user: User | null) => set({ user }),
      setToken: (token: string | null) => set({ token }),
      login: async (email: string, password: string) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            }
          );

          if (!response.ok) {
            return { success: false, errorMessage: "Login failed" };
          }

          const data = (await response.json()) as LoginResponse;

          Cookies.set("token", data.token, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          set({
            token: data.token,
            user: {
              id: data.id,
              username: data.username,
              email: data.email,
              roles: data.roles,
            },
          });

          return { success: true };
        } catch (error: any) {
          console.error("login failed", error);
          return { success: false, errorMessage: error.message };
        }
      },
      logout: () => {
        Cookies.remove("token");
        set({ token: null, user: null });
        localStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
