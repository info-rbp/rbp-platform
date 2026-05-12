import { useEffect } from "react";
import { Navigate } from "react-router";

import { mockAuthService } from "../services/mock/auth.mockService";

export function SignOutPage() {
  useEffect(() => {
    void mockAuthService.signOut();
  }, []);

  return <Navigate to="/signin" replace />;
}
