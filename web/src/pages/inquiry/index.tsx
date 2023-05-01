import { Input, MyInquiry, SearchInquiry } from "@/components"
import { useAuth } from "@/context"
import { Button, View } from "@/core"
import { useRouter } from "next/router"
import { useCallback } from "react"
export default function Inquiry() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const onNew = useCallback(() => router.push({ pathname: "/inquiry/write" }), [router])
  return (
    <View type="page">
      {isLoggedIn ? <MyInquiry /> : <SearchInquiry />}
      <Button colors="BLUE" onClick={onNew}>
        새로운 문의하기
      </Button>
    </View>
  )
}
