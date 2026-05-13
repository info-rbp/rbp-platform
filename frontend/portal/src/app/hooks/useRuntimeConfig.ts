import { createContext, createElement, type ReactNode, useContext, useMemo } from "react";

import { getRuntimeConfig, type RuntimeConfig } from "../config/runtime";

interface RuntimeConfigContextValue {
  config: RuntimeConfig;
}

const RuntimeConfigContext = createContext<RuntimeConfigContextValue | null>(null);

export function RuntimeConfigProvider({ children }: { children: ReactNode }) {
  const value = useMemo<RuntimeConfigContextValue>(
    () => ({
      config: getRuntimeConfig(),
    }),
    []
  );

  return createElement(RuntimeConfigContext.Provider, { value }, children);
}

export function useRuntimeConfig() {
  const context = useContext(RuntimeConfigContext);

  if (context) {
    return context;
  }

  return {
    config: getRuntimeConfig(),
  };
}
