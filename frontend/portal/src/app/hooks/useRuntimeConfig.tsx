import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getPublicRuntimeConfig } from "../api/runtime.api";
import {
  getInitialRuntimeConfig,
  mergeRuntimeConfig,
  type PublicRuntimeConfig,
} from "../config/runtime";

interface RuntimeConfigState {
  config: PublicRuntimeConfig;
  loading: boolean;
  source: "frontend" | "backend";
  error: string | null;
}

const RuntimeConfigContext = createContext<RuntimeConfigState | null>(null);

export function RuntimeConfigProvider({ children }: { children: ReactNode }) {
  const initialConfig = useMemo(() => getInitialRuntimeConfig(), []);
  const [config, setConfig] = useState<PublicRuntimeConfig>(initialConfig);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<RuntimeConfigState["source"]>("frontend");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function loadRuntimeConfig() {
      const response = await getPublicRuntimeConfig();

      if (!alive) return;
      if (response.ok && response.data) {
        setConfig((current) => mergeRuntimeConfig(current, response.data));
        setSource("backend");
        setError(null);
      } else {
        setError(response.error ?? "Runtime configuration is using frontend defaults.");
      }
      setLoading(false);
    }

    void loadRuntimeConfig();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <RuntimeConfigContext.Provider value={{ config, loading, source, error }}>
      {children}
    </RuntimeConfigContext.Provider>
  );
}

export function useRuntimeConfig() {
  const value = useContext(RuntimeConfigContext);
  if (!value) {
    throw new Error("useRuntimeConfig must be used inside RuntimeConfigProvider");
  }
  return value;
}
