import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import LoginPage from './LoginPage.vue'

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

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

  it('shows green checkmark on valid email only', async () => {
    const wrapper = mount(LoginPage)
    await wrapper.find('#email').setValue('test@example.com')
    await wrapper.find('#password').setValue('secret')
    expect(wrapper.findAll('.text-green-500').length).toBe(1)
  })

  it('does not enable button for invalid email format', async () => {
    const wrapper = mount(LoginPage)
    await wrapper.find('#email').setValue('notanemail')
    await wrapper.find('#password').setValue('secret')
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('toggles password input type when eye button clicked', async () => {
    const wrapper = mount(LoginPage)
    expect(wrapper.find('#password').attributes('type')).toBe('password')
    await wrapper.find('button[aria-label="Show password"]').trigger('click')
    expect(wrapper.find('#password').attributes('type')).toBe('text')
    await wrapper.find('button[aria-label="Hide password"]').trigger('click')
    expect(wrapper.find('#password').attributes('type')).toBe('password')
  })

  it('remember me checkbox toggles', async () => {
    const wrapper = mount(LoginPage)
    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.element.checked).toBe(false)
    await checkbox.setValue(true)
    expect(checkbox.element.checked).toBe(true)
  })

  it('saves email to localStorage on submit when remember me checked', async () => {
    const wrapper = mount(LoginPage)
    await wrapper.find('#email').setValue('test@example.com')
    await wrapper.find('#password').setValue('secret')
    await wrapper.find('input[type="checkbox"]').setValue(true)
    await wrapper.find('form').trigger('submit')
    expect(localStorage.getItem('savedEmail')).toBe('test@example.com')
  })

  it('removes email from localStorage on submit when remember me unchecked', async () => {
    localStorage.setItem('savedEmail', 'test@example.com')
    const wrapper = mount(LoginPage)
    await wrapper.vm.$nextTick()
    await wrapper.find('input[type="checkbox"]').setValue(false)
    await wrapper.find('#email').setValue('test@example.com')
    await wrapper.find('#password').setValue('secret')
    await wrapper.find('form').trigger('submit')
    expect(localStorage.getItem('savedEmail')).toBeNull()
  })

  it('pre-fills email and checks remember me when savedEmail in localStorage', async () => {
    localStorage.setItem('savedEmail', 'saved@example.com')
    const wrapper = mount(LoginPage)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('#email').element.value).toBe('saved@example.com')
    expect(wrapper.find('input[type="checkbox"]').element.checked).toBe(true)
  })
})
