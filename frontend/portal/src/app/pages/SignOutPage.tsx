import { useEffect } from "react";
import { Navigate } from "react-router";

import { mockAdminAuthService, mockAuthService } from "../services/mock/auth.mockService";

export function SignOutPage() {
  useEffect(() => {
    void mockAuthService.signOut();
    void mockAdminAuthService.signOut();
  }, []);

  return <Navigate to="/sign-in" replace />;
}
