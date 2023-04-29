import { useAuth } from "@/context"
import { View, Button } from "@/core"
import React, { useCallback } from "react"

type Props = { closeFn: () => void }
export default function Logout({ closeFn }: Props) {
  const { signOut } = useAuth()
  const onSignout = useCallback(() => {
    closeFn()
    signOut()
  }, [signOut])

  return (
    <View css={{ padding: 20, rowGap: 10 }}>
      로그아웃 하시겠습니까?
      <View direction="row" css={{ columnGap: 10 }}>
        <Button onClick={() => closeFn()} css={{ flex: 1 }}>
          취소
        </Button>
        <Button onClick={onSignout} colors="RED" css={{ flex: 2 }}>
          로그아웃
        </Button>
      </View>
    </View>
  )
}
