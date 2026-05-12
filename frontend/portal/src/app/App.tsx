import { RouterProvider } from "react-router";
import { router } from "./routes";
import { RuntimeConfigProvider } from "./hooks/useRuntimeConfig";

export default function App() {
  return (
    <RuntimeConfigProvider>
      <RouterProvider router={router} />
    </RuntimeConfigProvider>
  );
}
