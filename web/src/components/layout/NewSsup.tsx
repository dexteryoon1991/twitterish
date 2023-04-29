import { Button, Typo, View } from "@/core"
import { Colors } from "@/lib"
import React, { ChangeEvent, useCallback, useRef, useState } from "react"
import { ModalProps } from "../Modal"
import UserImage from "../UserImage"

export default function NewSsup({ closeFn, state }: ModalProps) {
  const [body, setBody] = useState("")
  const bodyRef = useRef<HTMLTextAreaElement | null>(null)
  const focusOnBody = useCallback(() => {
    bodyRef.current?.focus()
  }, [])
  const onChangeBody = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
  }, [])

  const onSubmit = useCallback(() => {
    console.log(body)
  }, [body])

  return (
    <View css={{ rowGap: 10, padding: 10, minHeight: 150 }}>
      <UserImage nameOnly />
      <View>
        <View
          as="textarea"
          onChange={onChangeBody}
          value={body}
          placeholder="type here..."
          css={{ backgroundColor: "rgba(0,0,0,.05)", borderRadius: 5, resize: "none", border: `1px solid ${Colors.LIGHTGRAY}`, padding: 5, minHeight: 50 }}
        />
      </View>
      <Button colors="BLUE" onClick={onSubmit}>
        Suuuuuuup!
      </Button>
    </View>
  )
}
