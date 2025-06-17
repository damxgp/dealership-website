"use client"

import { Suspense } from "react"
import { HomeLayoutWrapper } from "@/components/home-layout-wrapper"
import { useAppStore } from "@/lib/store"

export default function HomePage() {
  const { state } = useAppStore()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeLayoutWrapper />
    </Suspense>
  )
}
