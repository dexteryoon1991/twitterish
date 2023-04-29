import { Button, Typo, View } from "@/core"
import { Colors } from "@/lib"
import React, { PropsWithChildren } from "react"

export interface ModalProps {
  state: boolean
  closeFn: () => void
}

interface Props extends PropsWithChildren, ModalProps {
  title?: string
  animation?: "slide" | "fade"
}

export default function Modal({ closeFn, state, animation, title, children }: Props) {
  return (
    <View
      css={{ top: 0, left: 0, width: "100%", height: "100vh", display: "flex", alignItems: "center", position: "fixed" }}
      style={state ? {} : { opacity: 0, visibility: "hidden" }}>
      <View
        position={"relative"}
        css={{
          backgroundColor: Colors.WHITE,
          border: `1px solid ${Colors.LIGHTGRAY}`,
          borderRadius: 20,
          overflow: "hidden",
          top: "50%",
          transform: "translateY(-50%)",
          boxShadow: "0 3px 6px rgba(0,0,0, .1)",
          alignItems: "center",
        }}>
        <View
          position={"relative"}
          direction="row"
          css={{
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            borderBottom: `1px solid ${Colors.LIGHTGRAY}`,
            width: "100%",
          }}>
          <Button
            colors={"RED"}
            css={{
              padding: 0,
              width: 10,
              minHeight: 10,
              borderRadius: 15,
              position: "absolute",
              top: "50%",
              right: 10,
              transform: "translateY(-50%)",
              "&:active": {
                transform: "translateY(-50%)",
              },
              "&:hover": {
                transform: "translateY(-50%) scale(1.2)",
              },
            }}
            onClick={closeFn}
          />
          {title && <Typo weight="BOLD">{title}</Typo>}
        </View>
        {/* <View css={{ padding: 20 }}> */}
        {children ? children : "need modal content"}
        {/* </View> */}
      </View>
      <View type="shadow" onClick={closeFn} css={{ backgroundColor: "transparent" }} />
    </View>
  )
}
