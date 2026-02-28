# 🍸 Contributing to BOOZER

Thank you for contributing to BOOZER.

This project combines hardware (Raspberry Pi), embedded logic, a kiosk-style frontend, backend API, and future cloud infrastructure.
Maintaining clean Git practices is critical for stability and scalability.

This document defines the Git workflow and contribution standards.

---

## 📦 Repository Structure

The project is organized as a monorepo:

- apps/ui-boozer → React + Vite frontend (kiosk interface)
- apps/api-boozer → FastAPI backend (device logic + hardware integration)

All changes must respect the separation between frontend and backend responsibilities.

---

## 🌿 Branching Strategy

### Main Branch

`main` must always remain stable.

- Code in `main` should be deployable to a device.
- Avoid direct commits to `main` once development grows.
- Use Pull Requests whenever possible.

### Feature Branches

All new work must be developed in feature branches:

```
feature/<short-description>
```

Examples:

- `feature/ui-animation-system`
- `feature/payment-flow`
- `feature/websocket-events`
- `feature/hardware-integration`

### Bug Fix Branches

```
fix/<short-description>
```

Examples:

- `fix/cors-config`
- `fix/session-timeout`
- `fix/payment-error-handling`

---

## 📝 Commit Message Convention

We follow **Conventional Commits**.

Format:

```
type(scope): short description
```

Examples specific to BOOZER:

- `feat(ui): add landing screen layout`
- `feat(api): implement session start endpoint`
- `fix(ui): correct api base url`
- `refactor(api): extract hardware service layer`
- `chore(repo): update gitignore`
- `docs(readme): improve setup instructions`

### Allowed Commit Types

- `feat` → new feature
- `fix` → bug fix
- `docs` → documentation changes
- `refactor` → internal code improvement (no behavior change)
- `chore` → tooling / configuration changes
- `style` → UI or formatting changes
- `perf` → performance improvements

---

## 🚀 Pull Request Guidelines

Before opening a Pull Request:

- Ensure the frontend builds successfully.
- Ensure the backend runs without errors.
- Verify no sensitive files are committed (`.env`, `.venv`, etc.).
- Keep PRs focused on a single logical change.
- PR titles should follow the same Conventional Commit format.

---

## 🔒 Security Rules

Never commit:

- `.env` files
- API keys
- Payment credentials
- Private certificates
- `.venv` directories

Hardware credentials and payment integration keys must always remain local or stored securely.

---

## 📈 Versioning Strategy

When deploying to real devices, use semantic versioning:

```
v0.1.0
v0.2.0
v1.0.0
```

Important rules:

- Only release from `main`
- Tag versions before deployment
- Keep a changelog for production updates
- Never deploy untagged code to production machines

>This is critical once multiple Raspberry devices are installed in venues.

---

## 🎯 Development Philosophy

BOOZER is not just a web app — it is a hardware-integrated product.

Clean Git practices ensure:

- Stability across deployed devices
- Safe payment integration
- Easier debugging in live venues
- Professional development standards
