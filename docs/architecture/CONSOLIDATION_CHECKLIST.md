# Consolidation Checklist

## Phase 4A Foundation

- [x] Create or confirm target repository
- [x] Create Phase 4A branch
- [x] Create source manifest
- [x] Verify Phase 1 UI/UX source
- [x] Verify Phase 2 contract source paths
- [x] Verify Phase 3 backend source
- [x] Confirm `rbp_app/` source location
- [x] Confirm Frappe core exclusion
- [x] Create base repository structure
- [x] Add environment examples
- [x] Add root `.gitignore`
- [x] Add CI structure guard
- [x] Add repository strategy documentation
- [x] Add Phase 4A status documentation

## Must Not Do In Phase 4A Foundation

- [ ] Do not migrate frontend source yet
- [ ] Do not migrate contracts yet
- [ ] Do not import `rbp_app` yet
- [ ] Do not copy `frappe/`
- [ ] Do not copy `apps/frappe/`
- [ ] Do not commit secrets
- [ ] Do not commit local `.env` files
- [ ] Do not commit generated runtime output
- [ ] Do not archive source repositories yet

## Later Phase 4 Work

- [ ] Import or reference frontend source
- [ ] Import Phase 2 contracts
- [ ] Import onboarding/product specs
- [ ] Import `rbp_app` after Phase 3 acceptance gate
- [ ] Add fuller CI checks
- [ ] Add backend install smoke test
- [ ] Add frontend build check
- [ ] Add integration smoke checks
- [ ] Prepare Phase 5 integration handoff
