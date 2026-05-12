from pathlib import Path
import os
import unittest


ROOT = Path(__file__).resolve().parents[3]
SCRIPT = ROOT / "scripts" / "confirm_backend_baseline.sh"


class BackendBaselineScriptTest(unittest.TestCase):
    def test_backend_baseline_script_contract(self):
        self.assertTrue(SCRIPT.exists())
        self.assertTrue(os.access(SCRIPT, os.X_OK))

        text = SCRIPT.read_text(encoding="utf-8")
        required_fragments = [
            "set -euo pipefail",
            "RBP_BENCH_ROOT",
            "RBP_BASELINE_SITE",
            "RBP_APP_NAME",
            "reports/backend-baseline",
            "git status --short",
            "compileall",
            "migrate",
            "clear-cache",
            "run-tests",
        ]
        for fragment in required_fragments:
            self.assertIn(fragment, text)


if __name__ == "__main__":
    unittest.main()
