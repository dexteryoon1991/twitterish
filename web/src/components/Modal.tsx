import { Button, Typo, View } from "@/core"
import { Colors } from "@/lib"
import React, { PropsWithChildren, useCallback, useState } from "react"

export interface ModalProps {
  state: boolean
  closeFn: () => void
}

interface Props extends PropsWithChildren, ModalProps {
  title?: string
  animation?: "slide" | "fade"
}

export default function Modal({ closeFn, state, animation, title, children }: Props) {
  const [isHovering, setIsHovering] = useState(false)
  const onHover = useCallback(() => setIsHovering(true), [])
  const onLeave = useCallback(() => setIsHovering(false), [])
  return (
    <View
      css={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100000000,
      }}
      style={
        state
          ? {}
          : {
              opacity: 0,
              visibility: "hidden",
            }
      }>
      <View
        css={{
          backgroundColor: Colors.WHITE,
          border: `1px solid ${Colors.LIGHTGRAY}`,
          boxShadow: "0 3px 6px rgba(0,0,0,.2)",
          borderRadius: 20,
          overflow: "hidden",
          minWidth: 160,
        }}
        position="relative">
        <View css={{ position: "relative", backgroundColor: "gainsboro", alignItems: "center", height: 40, justifyContent: "center" }}>
          {title ?? "title"}
          <Button
            css={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: isHovering ? "translateY(-50%) scale(1.5)" : "translateY(-50%)",
              padding: 0,
              width: 10,
              minHeight: 10,
              borderRadius: 10,
              backgroundColor: Colors.RED,
              border: "none",
              "&:active": {
                transform: "translateY(-50%) scale(.9)",
              },
            }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
          />
        </View>
        <View>{children}</View>
      </View>
      <View type="shadow" onClick={closeFn} />
    </View>
  )
}
