import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { StoreProvider } from './provider.jsx'
import store from './index.js'
import { useAppSelector, useAppDispatch } from './hooks.js'
import { addPoints } from '../features/walletSlice.js'

function PointsViewer() {
  const points = useAppSelector((s) => s.wallet.points)
  return <div data-testid="points">{points}</div>
}

function Incrementer() {
  const dispatch = useAppDispatch()
  return <button onClick={() => dispatch(addPoints(5))}>Add</button>
}

describe('custom hooks', () => {
  it('selects state and updates on dispatch', async () => {
    render(
      <StoreProvider store={store}>
        <PointsViewer />
        <Incrementer />
      </StoreProvider>
    )
    expect(screen.getByTestId('points').textContent).toBe('0')
    // trigger update
    screen.getByText('Add').click()
    expect(screen.getByTestId('points').textContent).toBe('5')
  })
})