import { CheckboxField } from "./CheckboxField";

export interface TermsAcceptanceProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function TermsAcceptance({ checked = false, onChange }: TermsAcceptanceProps) {
  return (
    <CheckboxField
      checked={checked}
      onChange={(event) => onChange?.(event.currentTarget.checked)}
      label="I accept the mock Phase 1 terms"
      description="This is a frontend-only acceptance state. No real agreement or payment is processed in Phase 1."
    />
  );
}
