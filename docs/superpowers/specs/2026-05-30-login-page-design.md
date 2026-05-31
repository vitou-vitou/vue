# Login Page — Design Spec

**Date:** 2026-05-30
**Stack:** Vue 3 + Tailwind CSS (Vite scaffold)
**Language:** English
**Reference:** 4takeaway mobile app UI

---

## Overview

Single-page login form matching the 4takeaway mobile app design. One component (`LoginPage.vue`) handles all state reactively. No router, no backend integration — UI only.

---

## Project Structure

```text
p2/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.js
    ├── App.vue
    └── LoginPage.vue
```

---

## Design Tokens

| Token | Value |
| --- | --- |
| Brand primary | `#E84569` |
| Background | `#F0F0F0` |
| Card | `#FFFFFF` |
| Text primary | `#1A1A1A` |
| Text muted | `#888888` |
| Success | `#22C55E` (Tailwind `green-500`) |
| Error | `#E84569` (same as brand) |
| Disabled button | `#CCCCCC` |
| Input border default | `#E0E0E0` |
| Input border focus/error | `#E84569` |

---

## Layout

Mobile-first card centered on `#F0F0F0` background.
Card: white, rounded-2xl, padding 32px, max-width ~390px.

**Card sections (top to bottom):**

1. Logo row — rocket emoji icon (pink bg, rounded) + "4takeaway" bold text
2. Headline — "Nice to have you here!" (bold, ~28px)
3. Subtitle — "Log in and discover the galactically good possibilities" (muted, ~14px)
4. Email field (label + input)
5. Password field (label + input + "Forgot password?" link below)
6. Submit button — "Continue →" full width
7. Divider — "Or sign in with"
8. Social buttons row — Facebook (f) + Google (G), icon-only, bordered squares
9. Sign-up link — "Don't have an account? **Create one here!**" (last part in brand color)

---

## UI States

### 1. Default (empty)

- Inputs: white bg, border `#E0E0E0`, placeholder text gray
- Button: bg `#CCCCCC`, text white, disabled (not clickable)
- No error messages

### 2. Typing / Active

- Focused input: border `#E84569` (2px)
- When both fields have content: button activates — bg `#E84569`, clickable
- Button state driven by `formReady` computed (both fields valid, no error)

### 3. Error

- Triggered on submit when credentials invalid
- Email input: border `#E84569`
- Error message below email input: "Email or password is incorrect." in `#E84569`
- Password input: border `#E84569`
- Button resets to disabled (`#CCCCCC`) after failed submit until user edits either field

### 4. Success / Valid

- Both fields pass client-side format check (email contains `@` + length > 3, password length ≥ 1)
- Green checkmark icon (`✓`) inside right side of each input
- Button: bg `#E84569`, active

---

## Component State (LoginPage.vue)

```js
// Reactive data
const email = ref('')
const password = ref('')
const emailFocused = ref(false)
const passwordFocused = ref(false)
const error = ref('')

// Computed
const emailValid = computed(() => email.value.includes('@') && email.value.length > 3)
const passwordValid = computed(() => password.value.length >= 1)
const formReady = computed(() => emailValid.value && passwordValid.value && !error.value)

// Submit handler
function handleSubmit() {
  if (!emailValid.value || !passwordValid.value) return
  // Simulate failed auth — in real app: call API here
  error.value = 'Email or password is incorrect.'
}

// Clear error when user edits either field
watch([email, password], () => { error.value = '' })
```

---

## Interactions

| Trigger | Behavior |
| --- | --- |
| Focus input | Border turns `#E84569` |
| Blur input | Border reverts to `#E0E0E0` |
| Type in both fields | Button activates (pink) |
| Click "Continue →" (active) | Runs `handleSubmit()`, shows error |
| Click "Forgot password?" | No-op link (`href="#"`) |
| Click Facebook/Google | No-op buttons (emit event for future) |
| Click "Create one here!" | No-op link (`href="#"`) |

---

## Accessibility

- Labels explicitly associated with inputs via `for`/`id`
- Error message has `role="alert"` for screen readers
- Button `disabled` attribute set when `formReady` is false
- Password input `type="password"`

---

## Out of Scope

- Actual API authentication
- Vue Router navigation after login
- i18n
- Remember me / persistent session
- Password visibility toggle
