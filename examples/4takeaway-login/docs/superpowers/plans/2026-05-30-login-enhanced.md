# Login Page Enhanced Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add password visibility toggle, "Remember me" checkbox with localStorage, and Apple Sign-In stub button to the existing `LoginPage.vue`.

**Architecture:** Two-file change only: `src/LoginPage.vue` gets new refs (`showPassword`, `rememberMe`), `onMounted` hook, and template additions. `src/LoginPage.test.js` gets 3 new tests, 1 updated test, and a `beforeEach` localStorage clear. No new files.

**Tech Stack:** Vue 3 Composition API (`<script setup>`), Tailwind CSS, Vitest + @vue/test-utils, jsdom

---

## File Map

| File | Action | What changes |
| --- | --- | --- |
| `src/LoginPage.vue` | Modify | `showPassword` ref, toggle button, `:type` binding, remove password ✓, `rememberMe` ref + checkbox row, `onMounted`, `handleSubmit` localStorage, Apple button |
| `src/LoginPage.test.js` | Modify | `beforeEach` localStorage.clear(), update checkmark test (2→1), add 3 new tests |

---

## Task 1: Password visibility toggle

**Files:**
- Modify: `src/LoginPage.test.js` (add 1 failing test, update 1 existing test)
- Modify: `src/LoginPage.vue` (add `showPassword` ref, `:type` binding, toggle button, remove password ✓)

- [ ] **Step 1: Add failing toggle test to `src/LoginPage.test.js`**

Add this test inside the `describe('LoginPage', () => {` block, after line 59 (after the last existing test, before the closing `})`):

```js
  it('toggles password input type when eye button clicked', async () => {
    const wrapper = mount(LoginPage)
    expect(wrapper.find('#password').attributes('type')).toBe('password')
    await wrapper.find('button[aria-label="Show password"]').trigger('click')
    expect(wrapper.find('#password').attributes('type')).toBe('text')
  })
```

- [ ] **Step 2: Run tests — confirm 1 new failure, 7 existing pass**

```bash
cd d:/test/p2 && npm test
```

Expected: 7 passed, 1 failed (`toggles password input type when eye button clicked` — no toggle button exists yet).

- [ ] **Step 3: Update existing checkmark test (green ✓ count 2 → 1)**

In `src/LoginPage.test.js`, replace lines 46–51:

```js
  it('shows green checkmarks when both fields are valid', async () => {
    const wrapper = mount(LoginPage)
    await wrapper.find('#email').setValue('test@example.com')
    await wrapper.find('#password').setValue('secret')
    expect(wrapper.findAll('.text-green-500').length).toBe(2)
  })
```

With:

```js
  it('shows green checkmark on valid email only', async () => {
    const wrapper = mount(LoginPage)
    await wrapper.find('#email').setValue('test@example.com')
    await wrapper.find('#password').setValue('secret')
    expect(wrapper.findAll('.text-green-500').length).toBe(1)
  })
```

- [ ] **Step 4: Update `src/LoginPage.vue` — script section**

Replace line 137:
```js
import { ref, computed, watch } from 'vue'
```
With:
```js
import { ref, computed, watch, onMounted } from 'vue'
```

Add after `const error = ref('')` (after line 143):
```js
const showPassword = ref(false)
```

- [ ] **Step 5: Update `src/LoginPage.vue` — password input `:type` binding**

Replace line 66 (`type="password"`) with:
```vue
              :type="showPassword ? 'text' : 'password'"
```

Also add `pr-10` to the input's class array (right padding for toggle button clearance). Replace line 71–78:
```vue
              :class="[
                'w-full rounded-lg px-3 py-2.5 text-sm outline-none border transition-colors bg-white pr-10',
                error
                  ? 'border-2 border-[#E84569]'
                  : passwordFocused
                    ? 'border-2 border-[#E84569]'
                    : 'border border-[#E0E0E0]'
              ]"
```

- [ ] **Step 6: Update `src/LoginPage.vue` — remove password ✓, add toggle button**

Replace lines 80–84 (the password green ✓ span):
```vue
            <span
              v-if="passwordValid && !error"
              class="text-green-500 absolute right-3 top-1/2 -translate-y-1/2 text-base font-bold select-none"
            >✓</span>
```

With the toggle button:
```vue
            <button
              type="button"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#555555] select-none leading-none"
            >{{ showPassword ? '🙈' : '👁' }}</button>
```

- [ ] **Step 7: Run tests — confirm all 8 pass**

```bash
npm test
```

Expected:
```
✓ button is disabled when fields are empty
✓ button is enabled when email and password are valid
✓ shows error message after submit with valid fields
✓ disables button after failed submit
✓ clears error when email changes after failed submit
✓ shows green checkmark on valid email only
✓ does not enable button for invalid email format
✓ toggles password input type when eye button clicked

Test Files  1 passed (1)
Tests       8 passed (8)
```

- [ ] **Step 8: Commit**

```bash
cd d:/test/p2 && git add src/LoginPage.vue src/LoginPage.test.js && git commit -m "feat: add password visibility toggle"
```

---

## Task 2: Remember me + localStorage

**Files:**
- Modify: `src/LoginPage.test.js` (add `beforeEach`, add 1 failing test)
- Modify: `src/LoginPage.vue` (`rememberMe` ref, checkbox row, `handleSubmit` localStorage, `onMounted`)

- [ ] **Step 1: Add `beforeEach` + failing remember me test to `src/LoginPage.test.js`**

Add `beforeEach` import — replace line 2:
```js
import { describe, it, expect, beforeEach } from 'vitest'
```

Add `beforeEach` block inside `describe`, before the first `it` (after line 5 `describe('LoginPage', () => {`):
```js
  beforeEach(() => {
    localStorage.clear()
  })
```

Add this new failing test after all existing tests (before closing `})`):
```js
  it('remember me checkbox toggles', async () => {
    const wrapper = mount(LoginPage)
    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.element.checked).toBe(false)
    await checkbox.setValue(true)
    expect(checkbox.element.checked).toBe(true)
  })
```

- [ ] **Step 2: Run tests — confirm 1 new failure, 8 existing pass**

```bash
npm test
```

Expected: 8 passed, 1 failed (`remember me checkbox toggles` — no checkbox exists yet).

- [ ] **Step 3: Update `src/LoginPage.vue` — add `rememberMe` ref**

Add after `const showPassword = ref(false)`:
```js
const rememberMe = ref(false)
```

- [ ] **Step 4: Update `src/LoginPage.vue` — update `handleSubmit` with localStorage**

Replace the existing `handleSubmit` function:
```js
function handleSubmit() {
  if (!emailValid.value || !passwordValid.value) return
  error.value = 'Email or password is incorrect.'
}
```

With:
```js
function handleSubmit() {
  if (!emailValid.value || !passwordValid.value) return
  if (rememberMe.value) {
    localStorage.setItem('savedEmail', email.value)
  } else {
    localStorage.removeItem('savedEmail')
  }
  error.value = 'Email or password is incorrect.'
}
```

- [ ] **Step 5: Update `src/LoginPage.vue` — add `onMounted` hook**

Add after the `watch([email, password], ...)` line:
```js
onMounted(() => {
  const saved = localStorage.getItem('savedEmail')
  if (saved) {
    email.value = saved
    rememberMe.value = true
  }
})
```

- [ ] **Step 6: Update `src/LoginPage.vue` — replace standalone "Forgot password?" with checkbox row**

Replace lines 87–89:
```vue
        <a href="#" class="block text-xs text-[#888888] mb-6 hover:underline">
          Forgot password?
        </a>
```

With:
```vue
        <!-- Remember me + forgot password row -->
        <div class="flex justify-between items-center mb-6">
          <label class="flex items-center gap-2 text-xs text-[#555555] cursor-pointer">
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

- [ ] **Step 7: Run tests — confirm all 9 pass**

```bash
npm test
```

Expected:
```
✓ (all 8 previous)
✓ remember me checkbox toggles

Tests  9 passed (9)
```

- [ ] **Step 8: Commit**

```bash
git add src/LoginPage.vue src/LoginPage.test.js && git commit -m "feat: add remember me checkbox with localStorage"
```

---

## Task 3: Apple Sign-In button

**Files:**
- Modify: `src/LoginPage.test.js` (add 1 failing test)
- Modify: `src/LoginPage.vue` (add Apple button)

- [ ] **Step 1: Add failing Apple button test to `src/LoginPage.test.js`**

Add after all existing tests (before closing `})`):
```js
  it('renders Apple sign-in button', () => {
    const wrapper = mount(LoginPage)
    expect(wrapper.find('button[aria-label="Sign in with Apple"]').exists()).toBe(true)
  })
```

- [ ] **Step 2: Run tests — confirm 1 new failure, 9 existing pass**

```bash
npm test
```

Expected: 9 passed, 1 failed (`renders Apple sign-in button`).

- [ ] **Step 3: Add Apple button to `src/LoginPage.vue`**

In the social login section, after the Google button (after line 123 `</button>`), add:
```vue
        <button
          type="button"
          class="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white text-sm hover:bg-gray-900 transition-colors"
          aria-label="Sign in with Apple"
        >
          
        </button>
```

- [ ] **Step 4: Run tests — confirm all 10 pass**

```bash
npm test
```

Expected:
```
✓ button is disabled when fields are empty
✓ button is enabled when email and password are valid
✓ shows error message after submit with valid fields
✓ disables button after failed submit
✓ clears error when email changes after failed submit
✓ shows green checkmark on valid email only
✓ does not enable button for invalid email format
✓ toggles password input type when eye button clicked
✓ remember me checkbox toggles
✓ renders Apple sign-in button

Test Files  1 passed (1)
Tests       10 passed (10)
```

- [ ] **Step 5: Commit**

```bash
git add src/LoginPage.vue src/LoginPage.test.js && git commit -m "feat: add Apple Sign-In stub button"
```

---

## Final State Reference

After all 3 tasks, `src/LoginPage.vue` script section:

```js
import { ref, computed, watch, onMounted } from 'vue'

const email = ref('')
const password = ref('')
const emailFocused = ref(false)
const passwordFocused = ref(false)
const error = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const emailValid = computed(() => email.value.includes('@') && email.value.length > 3)
const passwordValid = computed(() => password.value.length >= 1)
const formReady = computed(() => emailValid.value && passwordValid.value && !error.value)

function handleSubmit() {
  if (!emailValid.value || !passwordValid.value) return
  if (rememberMe.value) {
    localStorage.setItem('savedEmail', email.value)
  } else {
    localStorage.removeItem('savedEmail')
  }
  error.value = 'Email or password is incorrect.'
}

watch([email, password], () => { error.value = '' })

onMounted(() => {
  const saved = localStorage.getItem('savedEmail')
  if (saved) {
    email.value = saved
    rememberMe.value = true
  }
})
```
