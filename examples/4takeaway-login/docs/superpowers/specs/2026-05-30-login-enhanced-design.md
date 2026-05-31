# Login Page Enhanced — Design Spec

**Date:** 2026-05-30
**Scope:** Modify `src/LoginPage.vue` + `src/LoginPage.test.js`
**Reference:** Pattern A (Enhanced Card) — most-downloaded login UX pattern

---

## Overview

Add three UX improvements to the existing `LoginPage.vue` matching the 4takeaway design language. No new files. No structural changes. All additions follow existing reactive pattern (`ref` + template binding).

---

## Changes

### 1. Password Visibility Toggle

**New ref:** `const showPassword = ref(false)`

**Template change:** Password input `type` attribute becomes dynamic:
```vue
:type="showPassword ? 'text' : 'password'"
```

**Toggle button:** Icon inside the password field (right side), same position as the green ✓ checkmark (but shown when password is not yet valid or when showing). Uses `@click="showPassword = !showPassword"`.

**Icon states:**
- `showPassword = false` → eye icon (`👁` or SVG)
- `showPassword = true` → eye-slash icon (`🙈` or SVG)

**Accessibility:** Toggle button has `type="button"`, `aria-label="Show password"` / `"Hide password"` (toggled), `aria-pressed` bound to `showPassword`.

**Position:** Toggle is always visible on the right side of the password input. The green ✓ checkmark is **removed from the password field** (toggle lets the user see the password directly — ✓ is redundant). Email field keeps its green ✓ unchanged.

---

### 2. "Remember Me" Checkbox

**New ref:** `const rememberMe = ref(false)`

**Layout:** Replaces the standalone "Forgot password?" link below the password field. New row has two items:
- Left: checkbox + "Remember me" label
- Right: "Forgot password?" link

```vue
<div class="flex justify-between items-center mb-6">
  <label class="flex items-center gap-2 text-xs text-[#555] cursor-pointer">
    <input
      type="checkbox"
      v-model="rememberMe"
      class="w-3.5 h-3.5 accent-[#E84569] cursor-pointer"
    />
    Remember me
  </label>
  <a href="#" class="text-xs text-[#888888] hover:underline">Forgot password?</a>
</div>
```

**On submit:** If `rememberMe.value` is true, store email in `localStorage`:
```js
if (rememberMe.value) {
  localStorage.setItem('savedEmail', email.value)
} else {
  localStorage.removeItem('savedEmail')
}
```

**On mount:** Pre-fill email if `localStorage.getItem('savedEmail')` exists:
```js
onMounted(() => {
  const saved = localStorage.getItem('savedEmail')
  if (saved) {
    email.value = saved
    rememberMe.value = true
  }
})
```

---

### 3. Apple Sign-In Button (stub)

**Position:** Third button in social login row, after Google.

```vue
<button
  type="button"
  class="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white text-sm hover:bg-gray-900 transition-colors"
  aria-label="Sign in with Apple"
>
  
</button>
```

No click handler. Stub — same pattern as Facebook and Google buttons. Emits no events.

---

## Updated Component State

```js
import { ref, computed, watch, onMounted } from 'vue'

const email = ref('')
const password = ref('')
const emailFocused = ref(false)
const passwordFocused = ref(false)
const error = ref('')
const showPassword = ref(false)      // NEW
const rememberMe = ref(false)        // NEW

const emailValid = computed(() => email.value.includes('@') && email.value.length > 3)
const passwordValid = computed(() => password.value.length >= 1)
const formReady = computed(() => emailValid.value && passwordValid.value && !error.value)

function handleSubmit() {
  if (!emailValid.value || !passwordValid.value) return
  if (rememberMe.value) {            // NEW
    localStorage.setItem('savedEmail', email.value)
  } else {
    localStorage.removeItem('savedEmail')
  }
  error.value = 'Email or password is incorrect.'
}

watch([email, password], () => { error.value = '' })

onMounted(() => {                    // NEW
  const saved = localStorage.getItem('savedEmail')
  if (saved) {
    email.value = saved
    rememberMe.value = true
  }
})
```

---

## New Tests (add to LoginPage.test.js)

```js
it('toggles password input type when eye button clicked', async () => {
  const wrapper = mount(LoginPage)
  const toggle = wrapper.find('button[aria-label="Show password"]')
  expect(wrapper.find('#password').attributes('type')).toBe('password')
  await toggle.trigger('click')
  expect(wrapper.find('#password').attributes('type')).toBe('text')
})

it('remember me checkbox toggles rememberMe state', async () => {
  const wrapper = mount(LoginPage)
  const checkbox = wrapper.find('input[type="checkbox"]')
  expect(checkbox.element.checked).toBe(false)
  await checkbox.setValue(true)
  expect(checkbox.element.checked).toBe(true)
})

it('renders Apple sign-in button', () => {
  const wrapper = mount(LoginPage)
  expect(wrapper.find('button[aria-label="Sign in with Apple"]').exists()).toBe(true)
})
```

---

## Unchanged

- All existing 7 tests still pass
- `emailValid`, `passwordValid`, `formReady` logic unchanged
- `error` ref and `watch` unchanged
- All existing Tailwind classes and design tokens unchanged
- `#E84569` brand color, `#F0F0F0` background, card layout unchanged

---

## Out of Scope

- Actual OAuth for Apple
- Backend "remember me" token / session persistence
- Password strength meter
- Biometric / passkey login
