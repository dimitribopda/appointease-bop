import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "client" | "provider";

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  toggle: () => void;
};

const RoleContext = createContext<Ctx | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("client");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("ae-role") : null;
    if (stored === "client" || stored === "provider") setRoleState(stored);
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    if (typeof window !== "undefined") window.localStorage.setItem("ae-role", r);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, toggle: () => setRole(role === "client" ? "provider" : "client") }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
