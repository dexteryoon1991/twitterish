import { useAuth } from "@/context"
import { View, Button } from "@/core"
import React, { useCallback } from "react"

type ButtonProps = { name?: string; onPress?: () => void; colors?: "BLUE" | "BLACK" | "RED" | "GRAY" | "LIGHTGRAY" }
type Props = { closeFn: () => void; message: string; cancelBtn?: ButtonProps; okBtn?: ButtonProps }
export default function Logout({ closeFn, message, cancelBtn, okBtn }: Props) {
  const { signOut } = useAuth()
  const onSignout = useCallback(() => {
    closeFn()
    signOut()
  }, [signOut, closeFn])

  const onCancel = useCallback(() => {
    closeFn()
    cancelBtn?.onPress && cancelBtn.onPress()
  }, [closeFn, cancelBtn])

  const onOk = useCallback(() => {
    closeFn()
    okBtn?.onPress && okBtn.onPress()
  }, [okBtn, closeFn])
  return (
    <View css={{ padding: "20px 20px 30px", rowGap: 10 }}>
      {message}
      <View direction="row" css={{ columnGap: 10 }}>
        <Button onClick={onCancel} css={{ flex: 1 }} colors={cancelBtn?.colors ?? undefined}>
          {cancelBtn?.name ?? "취소"}
        </Button>
        <Button onClick={onOk} colors={okBtn?.colors ?? "RED"} css={{ flex: 2 }}>
          {okBtn?.name ?? "확인"}
        </Button>
      </View>
    </View>
  )
}
