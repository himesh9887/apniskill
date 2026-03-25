import { useAuth } from '../context/AuthContext.jsx';

const useCustomAuth = () => {
  const auth = useAuth();
  
  const isUser = auth.user && auth.isAuthenticated;
  
  return {
    ...auth,
    isUser,
  };
};

export default useCustomAuth;

