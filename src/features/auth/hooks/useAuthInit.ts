// hooks/useAuthInit.ts
import { useEffect, useState } from "react";
import { authService } from "../service/auth.service";

export const useAuthInit = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await authService.getCurrentSession();
      setIsInitialized(true);
    };
    init();
  }, []);

  return isInitialized;
};