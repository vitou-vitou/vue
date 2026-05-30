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
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              autocomplete="current-password"
              @focus="passwordFocused = true"
              @blur="passwordFocused = false"
              :class="[
                'w-full rounded-lg px-3 py-2.5 text-sm outline-none border transition-colors bg-white pr-10',
                error
                  ? 'border-2 border-[#E84569]'
                  : passwordFocused
                    ? 'border-2 border-[#E84569]'
                    : 'border border-[#E0E0E0]'
              ]"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="String(showPassword)"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#555555] select-none leading-none"
            >{{ showPassword ? '🙈' : '👁' }}</button>
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
import { ref, computed, watch, onMounted } from 'vue'

const email = ref('')
const password = ref('')
const emailFocused = ref(false)
const passwordFocused = ref(false)
const error = ref('')
const showPassword = ref(false)

const emailValid = computed(() => email.value.includes('@') && email.value.length > 3)
const passwordValid = computed(() => password.value.length >= 1)
const formReady = computed(() => emailValid.value && passwordValid.value && !error.value)

function handleSubmit() {
  if (!emailValid.value || !passwordValid.value) return
  error.value = 'Email or password is incorrect.'
}

watch([email, password], () => { error.value = '' })
</script>
