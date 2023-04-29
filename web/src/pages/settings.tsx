import { PostingSection, UserInfoSection } from "@/components"
import { useAuth } from "@/context"
import { View } from "@/core"
import { selectUser, useAppSelector } from "@/redux"
import { useRouter } from "next/router"
import React from "react"

export default function Settings() {
  const { isLoggedIn } = useAuth()

  const router = useRouter()
  const user = useAppSelector(selectUser)
  return (
    <View type="page">
      {isLoggedIn && (
        <>
          <UserInfoSection {...user} />
          <PostingSection {...user} />
        </>
      )}
    </View>
  )
}
