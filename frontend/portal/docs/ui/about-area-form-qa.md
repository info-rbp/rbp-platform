# About Area Form QA Checklist

## Contact Enquiry

- [ ] Required fields validate
- [ ] Email uses `type=email`
- [ ] Phone uses `type=tel`
- [ ] Enquiry type is required
- [ ] Consent checkbox is required
- [ ] Success state is professional
- [ ] No public mock or Phase 1 wording appears
- [ ] Discovery call users are directed to `/about/discovery-call`
- [ ] Partnership users are directed to `/about/work-with-us`
- [ ] Employment users are directed to `/about/work-for-us`

## Discovery Call

- [ ] Required fields validate
- [ ] Email uses `type=email`
- [ ] Phone uses `type=tel`
- [ ] Website uses `type=url`
- [ ] Business stage is required
- [ ] Reason is required
- [ ] Consent checkbox is required
- [ ] Success state is professional
- [ ] No public mock or backend limitation wording appears

## Partnership Enquiry

- [ ] Organisation name is required
- [ ] Contact name is required
- [ ] Email uses `type=email`
- [ ] Website uses `type=url`
- [ ] Partnership type is required
- [ ] Services/products offered is required
- [ ] Consent checkbox is required
- [ ] Success state is professional
- [ ] Employment intent is redirected to `/about/work-for-us`

## Expression of Interest

- [ ] Full name is required
- [ ] Email uses `type=email`
- [ ] Area of interest is required
- [ ] Work type is required
- [ ] LinkedIn and portfolio fields use `type=url`
- [ ] Consent checkbox is required
- [ ] Success state is professional
- [ ] Partnership intent is redirected to `/about/work-with-us`

## Future Backend Readiness

- [ ] Each form has a typed payload
- [ ] Each form has a service function
- [ ] Each form has a future backend method mapped
- [ ] Each form has a future DocType mapped
- [ ] Page components can later switch to real API calls without rewriting the whole page
