import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PropTypes from 'prop-types';

/**
 * Componente de proteção de rotas
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente filho a ser renderizado se autorizado
 * @param {boolean} props.adminOnly - Se true, apenas admins podem acessar
 * @param {string} props.redirectTo - Rota de redirecionamento customizada
 */
export function ProtectedRoute({ children, adminOnly = false, redirectTo = '/' }) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  // Verifica se há dados no localStorage mesmo durante loading
  const hasStorageData = !!localStorage.getItem('usuarioId') && !!localStorage.getItem('authToken');

  console.log("🛡️ ProtectedRoute - Estado:", { 
    user, 
    loading, 
    hasStorageData,
    isAuthenticated: isAuthenticated(),
    adminOnly 
  });

  // Aguarda carregar informações do usuário APENAS se não tiver dados no localStorage
  if (loading && !hasStorageData) {
    console.log("⏳ ProtectedRoute - Carregando...");
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#001a3d'
      }}>
        Carregando...
      </div>
    );
  }

  // Não autenticado - redireciona para login
  if (!isAuthenticated()) {
    console.log("❌ ProtectedRoute - Não autenticado, redirecionando para:", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  // Rota apenas para admin mas usuário é comum
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/reembolsos" replace />;
  }

  // Autorizado - renderiza o componente
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
  redirectTo: PropTypes.string,
};
