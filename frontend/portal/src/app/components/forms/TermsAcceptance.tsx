import { Link } from "react-router";

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
      label="I understand the RBP Premium Membership inclusions and terms."
      description={
        <>
          Review the <Link to="/membership/terms" className="font-semibold text-blue-700 hover:text-blue-800 hover:underline">Membership Terms</Link>. This frontend preview does not process a real payment or create a live account.
        </>
      }
    />
  );
}
