import { useEffect, useState } from "react";

import type { PublicResource } from "../data/resources";
import type { HelpArticle } from "../data/helpCenter";
import {
  isFirebaseConfigured,
  listHelpArticleRecords,
  listResourceRecords,
} from "../services/publicContentBackend";

export function usePublicBackendContent() {
  const [resources, setResources] = useState<PublicResource[]>([]);
  const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [resourceRecords, helpRecords] = await Promise.all([
          listResourceRecords({ publicOnly: true }),
          listHelpArticleRecords({ publicOnly: true }),
        ]);

        if (!cancelled) {
          setResources(resourceRecords);
          setHelpArticles(helpRecords);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load backend content."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    resources,
    helpArticles,
    isLoading,
    errorMessage,
    backendEnabled: isFirebaseConfigured,
  };
}
