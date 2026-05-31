# Login Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pixel-perfect 4takeaway login page as a Vite + Vue 3 + Tailwind CSS project with four reactive UI states.

**Architecture:** Single `LoginPage.vue` component owns all state via Vue 3 `ref`/`computed`/`watch`. Tailwind utility classes are conditionally applied based on reactive state. No router, no API calls — UI-only demo with simulated auth failure.

**Tech Stack:** Vite 5, Vue 3 (Composition API, `<script setup>`), Tailwind CSS 3, Vitest + @vue/test-utils (tests), jsdom (test environment)

---

## File Map

| File | Action | Responsibility |
| --- | --- | --- |
| `package.json` | Create | Dependencies + npm scripts |
| `vite.config.js` | Create | Vite + Vue plugin + Vitest config |
| `tailwind.config.js` | Create | Content paths for purging |
| `postcss.config.js` | Create | Tailwind + autoprefixer pipeline |
| `index.html` | Create | App mount point |
| `src/style.css` | Create | Tailwind directives |
| `src/main.js` | Create | App bootstrap |
| `src/App.vue` | Create | Root — renders LoginPage |
| `src/LoginPage.vue` | Create | All login UI + state logic |
| `src/LoginPage.test.js` | Create | Vitest tests for all state behavior |

---

## Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/style.css`
- Create: `src/main.js`
- Create: `src/App.vue`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "p2",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "@vue/test-utils": "^2.4.0",
    "autoprefixer": "^10.4.0",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create `vite.config.js`**

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

- [ ] **Step 3: Create `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: { extend: {} },
  plugins: [],
}
```

- [ ] **Step 4: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>4takeaway — Login</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `src/style.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 7: Create `src/main.js`**

```js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
```

- [ ] **Step 8: Create `src/App.vue`**

```vue
<template>
  <LoginPage />
</template>

<script setup>
import LoginPage from './LoginPage.vue'
</script>
```

- [ ] **Step 9: Install dependencies**

Run from project root (`d:\test\p2`):

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 10: Commit**

```bash
git init
git add package.json vite.config.js tailwind.config.js postcss.config.js index.html src/style.css src/main.js src/App.vue
git commit -m "chore: scaffold Vite + Vue 3 + Tailwind project"
```

---

## Task 2: Write failing tests for LoginPage

**Files:**
- Create: `src/LoginPage.test.js`
- Create: `src/LoginPage.vue` (stub — just enough to mount)

- [ ] **Step 1: Create stub `src/LoginPage.vue`** (minimal — tests will fail against real behavior)

```vue
<template>
  <form @submit.prevent>
    <input id="email" type="email" />
    <input id="password" type="password" />
    <button type="submit" disabled>Continue</button>
  </form>
</template>

<script setup></script>
```

- [ ] **Step 2: Create `src/LoginPage.test.js`**

```js
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import LoginPage from './LoginPage.vue'

describe('LoginPage', () => {
  it('button is disabled when fields are empty', async () => {
    const wrapper = mount(LoginPage)
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('button is enabled when email and password are valid', async () => {
    const wrapper = mount(LoginPage)
    await wrapper.find('#email').setValue('test@example.com')
    await wrapper.find('#password').setValue('secret')
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('shows error message after submit with valid fields', async () => {
    const wrapper = mount(LoginPage)
    await wrapper.find('#email').setValue('test@example.com')
    await wrapper.find('#password').setValue('secret')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('[role="alert"]').text()).toBe('Email or password is incorrect.')
  })

  it('disables button after failed submit', async () => {
    const wrapper = mount(LoginPage)
    await wrapper.find('#email').setValue('test@example.com')
    await wrapper.find('#password').setValue('secret')
    await wrapper.find('form').trigger('submit')
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('clears error when email changes after failed submit', async () => {
    const wrapper = mount(LoginPage)
    await wrapper.find('#email').setValue('test@example.com')
    await wrapper.find('#password').setValue('secret')
    await wrapper.find('form').trigger('submit')
    await wrapper.find('#email').setValue('other@example.com')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('shows green checkmarks when both fields are valid', async () => {
    const wrapper = mount(LoginPage)
    await wrapper.find('#email').setValue('test@example.com')
    await wrapper.find('#password').setValue('secret')
    expect(wrapper.findAll('.text-green-500').length).toBe(2)
  })

  it('does not enable button for invalid email format', async () => {
    const wrapper = mount(LoginPage)
    await wrapper.find('#email').setValue('notanemail')
    await wrapper.find('#password').setValue('secret')
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
  })
})
```

- [ ] **Step 3: Run tests — confirm failures**

```bash
npm test
```

Expected: 6 of 7 tests FAIL (only "button is disabled when fields are empty" may pass on stub). Output should show failures for enabled-button, error message, checkmarks, etc.

- [ ] **Step 4: Commit stub + tests**

```bash
git add src/LoginPage.vue src/LoginPage.test.js
git commit -m "test: add failing tests for LoginPage state behavior"
```

---

## Task 3: Implement LoginPage.vue

**Files:**
- Modify: `src/LoginPage.vue` (replace stub with full implementation)

- [ ] **Step 1: Replace `src/LoginPage.vue` with full implementation**

```vue
<template>
  <div class="min-h-screen bg-[#F0F0F0] flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-8 w-full max-w-sm shadow-sm">

      <!-- Logo -->
      <div class="flex items-center gap-2 mb-6">
        <div class="w-8 h-8 bg-[#E84569] rounded-lg flex items-center justify-center text-white text-sm">
          🚀
        </div>
        <span class="font-bold text-sm tracking-tight">4takeaway</span>
      </div>

      <!-- Headline -->
      <h1 class="text-2xl font-extrabold text-[#1A1A1A] leading-tight mb-2">
        Nice to have you here!
      </h1>
      <p class="text-sm text-[#888888] mb-7 leading-snug">
        Log in and discover the galactically good possibilities
      </p>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">

        <!-- Email field -->
        <div class="mb-4">
          <label for="email" class="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
            Email
          </label>
          <div class="relative">
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="johndoe@gmail.com"
              autocomplete="email"
              @focus="emailFocused = true"
              @blur="emailFocused = false"
              :class="[
                'w-full rounded-lg px-3 py-2.5 text-sm outline-none border transition-colors bg-white',
                error
                  ? 'border-2 border-[#E84569]'
                  : emailFocused
                    ? 'border-2 border-[#E84569]'
                    : 'border border-[#E0E0E0]'
              ]"
            />
            <span
              v-if="emailValid && !error"
              class="text-green-500 absolute right-3 top-1/2 -translate-y-1/2 text-base font-bold select-none"
            >✓</span>
          </div>
          <p v-if="error" role="alert" class="text-xs text-[#E84569] mt-1">
            {{ error }}
          </p>
        </div>

        <!-- Password field -->
        <div class="mb-1.5">
          <label for="password" class="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Password"
              autocomplete="current-password"
              @focus="passwordFocused = true"
              @blur="passwordFocused = false"
              :class="[
                'w-full rounded-lg px-3 py-2.5 text-sm outline-none border transition-colors bg-white',
                error
                  ? 'border-2 border-[#E84569]'
                  : passwordFocused
                    ? 'border-2 border-[#E84569]'
                    : 'border border-[#E0E0E0]'
              ]"
            />
            <span
              v-if="passwordValid && !error"
              class="text-green-500 absolute right-3 top-1/2 -translate-y-1/2 text-base font-bold select-none"
            >✓</span>
          </div>
        </div>

        <a href="#" class="block text-xs text-[#888888] mb-6 hover:underline">
          Forgot password?
        </a>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="!formReady"
          :class="[
            'w-full rounded-lg py-3 text-sm font-bold text-white transition-colors mb-4',
            formReady
              ? 'bg-[#E84569] hover:bg-[#d03a5e] cursor-pointer'
              : 'bg-[#CCCCCC] cursor-not-allowed'
          ]"
        >
          Continue →
        </button>

      </form>

      <!-- Social login -->
      <p class="text-center text-xs text-[#888888] mb-3">Or sign in with</p>
      <div class="flex gap-3 justify-center mb-6">
        <button
          type="button"
          class="w-10 h-10 border border-[#E0E0E0] rounded-lg flex items-center justify-center font-bold text-sm hover:bg-gray-50 transition-colors"
          aria-label="Sign in with Facebook"
        >
          f
        </button>
        <button
          type="button"
          class="w-10 h-10 border border-[#E0E0E0] rounded-lg flex items-center justify-center font-bold text-sm text-[#E84569] hover:bg-gray-50 transition-colors"
          aria-label="Sign in with Google"
        >
          G
        </button>
      </div>

      <!-- Sign up link -->
      <p class="text-center text-xs text-[#888888]">
        Don't have an account?
        <a href="#" class="text-[#E84569] font-bold hover:underline">Create one here!</a>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const email = ref('')
const password = ref('')
const emailFocused = ref(false)
const passwordFocused = ref(false)
const error = ref('')

const emailValid = computed(() => email.value.includes('@') && email.value.length > 3)
const passwordValid = computed(() => password.value.length >= 1)
const formReady = computed(() => emailValid.value && passwordValid.value && !error.value)

function handleSubmit() {
  if (!emailValid.value || !passwordValid.value) return
  error.value = 'Email or password is incorrect.'
}

watch([email, password], () => { error.value = '' })
</script>
```

- [ ] **Step 2: Run tests — confirm all pass**

```bash
npm test
```

Expected output:
```
✓ src/LoginPage.test.js (7)
  ✓ button is disabled when fields are empty
  ✓ button is enabled when email and password are valid
  ✓ shows error message after submit with valid fields
  ✓ disables button after failed submit
  ✓ clears error when email changes after failed submit
  ✓ shows green checkmarks when both fields are valid
  ✓ does not enable button for invalid email format

Test Files  1 passed (1)
Tests       7 passed (7)
```

If any test fails, check:
- `emailValid` uses `.includes('@') && .length > 3` — `notanemail` has no `@`, so it's invalid ✓
- `formReady` includes `&& !error.value` — button disables after submit ✓
- `watch([email, password], ...)` — clears error on any field change ✓

- [ ] **Step 3: Commit**

```bash
git add src/LoginPage.vue
git commit -m "feat: implement LoginPage with all 4 UI states"
```

---

## Task 4: Browser verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Expected: `http://localhost:5173` (or next available port). Open in browser.

- [ ] **Step 2: Verify all 4 states manually**

| State | How to trigger | What to check |
| --- | --- | --- |
| Default | Page load | Gray button, no borders, no checkmarks |
| Active | Type in both fields | Pink borders on focused field, pink button when both filled, green ✓ in each field |
| Error | Fill both fields, click Continue | Error text appears below email, both borders pink, button goes gray |
| Recovery | Edit either field after error | Error disappears, button re-activates if fields still valid |

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: verify login page browser smoke test"
```

---

## Design Token Reference

| Token | Tailwind class | Hex |
| --- | --- | --- |
| Brand primary | `bg-[#E84569]` / `text-[#E84569]` / `border-[#E84569]` | `#E84569` |
| Background | `bg-[#F0F0F0]` | `#F0F0F0` |
| Text muted | `text-[#888888]` | `#888888` |
| Success checkmark | `text-green-500` | `#22C55E` |
| Disabled button | `bg-[#CCCCCC]` | `#CCCCCC` |
| Input border default | `border-[#E0E0E0]` | `#E0E0E0` |
