# Appwrite Source Of Truth

## Rule

Appwrite runtime state for the RBP QA release path must be defined from this repository.

## Repository-Owned State

- databases and collections
- indexes and permissions
- storage buckets
- function source and deployment configuration
- QA seed data
- validation scripts
- deployment workflows and runbooks

## Forbidden Operating Pattern

Undocumented manual clicking in Appwrite must not be the only source of runtime truth.

If a manual action is temporarily required, it must be captured in deployment documentation and converted into repository-owned automation as soon as possible.
