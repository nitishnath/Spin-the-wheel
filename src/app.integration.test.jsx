import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import App from './App.jsx'
import { StoreProvider } from './store/provider.jsx'
import store from './store/index.js'

describe('game flow integration', () => {
  it('logs in, verifies OTP, spins, and shows reward', async () => {
    render(
      <StoreProvider store={store}>
        <App />
      </StoreProvider>
    )

    // Login
    const mobileInput = await screen.findByLabelText('Mobile Number')
    await userEvent.type(mobileInput, '9876543210')
    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    // OTP
    const otpInput = await screen.findByLabelText('One-Time Password')
    await userEvent.type(otpInput, '123456')
    await userEvent.click(screen.getByRole('button', { name: /verify/i }))

    // Dashboard
    await screen.findByText(/wallet points/i)
    await userEvent.click(screen.getByRole('link', { name: /spin the wheel/i }))

    // Play and spin
    const spinButton = await screen.findByRole('button', { name: /spin the wheel/i })
    await userEvent.click(spinButton)

    // Toast with reward appears
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/you got:/i)
    })
  })
})