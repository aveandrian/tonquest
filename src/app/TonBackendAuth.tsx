'use client'

import { type ReactNode } from 'react'
import { useBackendAuth } from '@/lib/useBackendAuth';


export function TonBackendAuthProvider(props: { children: ReactNode }) {
  useBackendAuth()
  return props.children
}