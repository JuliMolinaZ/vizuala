import { renderHook } from '@testing-library/react'
import React from 'react'
import { AppProvider, useApp } from '@/context/AppContext'
import { Report } from '@/types'

describe('AppContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const reports: Report[] = [
      { id: '1', name: 'Report 1', icon: null as any, date: '2024-01-01', chat: [] },
    ]
    return <AppProvider initialReports={reports}>{children}</AppProvider>
  }

  it('provides initial state', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    expect(result.current.state.reports).toHaveLength(1)
    expect(result.current.state.selectedReportId).toBe('1')
  })

  it('throws when used outside provider', () => {
    const { result } = renderHook(() => {
      try {
        return useApp()
      } catch (e) {
        return e
      }
    })
    expect(result.current).toBeInstanceOf(Error)
  })
})
