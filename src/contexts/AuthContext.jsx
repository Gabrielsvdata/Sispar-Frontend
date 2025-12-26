import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicializa o estado do usuário a partir do localStorage
  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    const usuarioNome = localStorage.getItem('usuarioNome');
    const usuarioCargo = localStorage.getItem('usuarioCargo');
    const usuarioTipo = localStorage.getItem('usuarioTipo');
    const authToken = localStorage.getItem('authToken');

    if (usuarioId && authToken) {
      setUser({
        id: usuarioId,
        nome: usuarioNome,
        cargo: usuarioCargo,
        tipo: usuarioTipo || 'usuario',
        token: authToken,
      });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log("📝 AuthContext.login chamado com:", userData);
    
    // Salva no localStorage PRIMEIRO
    localStorage.setItem('usuarioId', userData.id);
    localStorage.setItem('usuarioNome', userData.nome);
    localStorage.setItem('usuarioCargo', userData.cargo);
    localStorage.setItem('usuarioTipo', userData.tipo || 'usuario');
    localStorage.setItem('authToken', userData.token);

    console.log("💾 Dados salvos no localStorage");

    // Atualiza o estado
    setUser({
      id: userData.id,
      nome: userData.nome,
      cargo: userData.cargo,
      tipo: userData.tipo || 'usuario',
      token: userData.token,
    });

    console.log("✅ State atualizado");
    
    // Dispara evento customizado para compatibilidade com código existente
    window.dispatchEvent(new Event('userChanged'));
    
    // Retorna uma Promise que resolve após o state ser atualizado
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("⏰ Timeout concluído, login finalizado");
        resolve();
      }, 0);
    });
  };

  const logout = () => {
    // Remove do localStorage
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNome');
    localStorage.removeItem('usuarioCargo');
    localStorage.removeItem('usuarioTipo');
    localStorage.removeItem('authToken');

    // Limpa o estado
    setUser(null);

    // Dispara evento customizado
    window.dispatchEvent(new Event('userChanged'));
  };

  const updateUser = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      
      // Sincroniza com localStorage
      if (updates.nome) localStorage.setItem('usuarioNome', updates.nome);
      if (updates.cargo) localStorage.setItem('usuarioCargo', updates.cargo);
      if (updates.tipo) localStorage.setItem('usuarioTipo', updates.tipo);
      
      return updated;
    });
  };

  const isAuthenticated = () => {
    // Verifica TANTO o state quanto o localStorage para maior confiabilidade
    const hasUserInState = user !== null && user.token !== null;
    const hasUserInStorage = !!localStorage.getItem('usuarioId') && !!localStorage.getItem('authToken');
    return hasUserInState || hasUserInStorage;
  };

  const isAdmin = () => {
    // Verifica o state primeiro, se não tiver, verifica o localStorage
    const tipo = user?.tipo || localStorage.getItem('usuarioTipo');
    return tipo === 'admin';
  };

  const isUsuario = () => {
    // Verifica o state primeiro, se não tiver, verifica o localStorage
    const tipo = user?.tipo || localStorage.getItem('usuarioTipo');
    return tipo === 'usuario';
  };

  const value = {
    user,
    userId: user?.id || parseInt(localStorage.getItem('usuarioId')),
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    isAdmin,
    isUsuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
