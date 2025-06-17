"use client"

import { HomeLayout } from "@/components/home-layouts"
import { useAppStore } from "@/lib/store"

export function HomeLayoutWrapper() {
  const { state } = useAppStore()

  return <HomeLayout layout={state.settings.homeLayout} />
}
