import { frontendDiagnostics } from "../../../config/environment";
import { describeAppwriteErrorWithDiagnostics } from "../../../config/frontendDiagnostics";

export function describeAppwriteError(error: unknown, operation: string) {
  return describeAppwriteErrorWithDiagnostics(error, operation, frontendDiagnostics);
}
