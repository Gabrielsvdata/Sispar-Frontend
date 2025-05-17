/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Api from "../Services/Api";

export const AuthContext = createContext({
  user: null,
  setUser: () => {}
});

// 2) Exportamos só o componente Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data } = await Api.get("/colaborador/me");
        setUser(data);
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3) Validação de props para 'children' e evitar ESLint/prop-types
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
