import React from "react"
import { Button, View } from "@/core"
import { Colors } from "@/lib"
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi"
import { AiOutlineIdcard } from "react-icons/ai"
import { CSSProperties } from "@stitches/react"

type Props = {
  props?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  onPressIcon?: () => void
  inputType?: "password" | "email" | "name"
  style?: CSSProperties
}

export default function Input({ props, inputType, onPressIcon, style }: Props) {
  return (
    <View
      css={{
        height: 40,
        border: `1px solid ${Colors.LIGHTGRAY}`,
        borderRadius: 5,
        alignItems: "center",
        ...style,
      }}
      direction="row">
      {inputType && (
        <Button css={{ fontSize: 30, padding: 5, border: "none", color: Colors.GRAY }} type="button" onClick={onPressIcon}>
          {inputType === "email" ? (
            <HiOutlineMail />
          ) : inputType === "password" ? (
            <HiOutlineLockClosed />
          ) : inputType === "name" ? (
            <AiOutlineIdcard />
          ) : undefined}
        </Button>
      )}
      <input type="text" {...props} style={{ border: "none", backgroundColor: "transparent", padding: 10, width: "100%", ...props?.style }} />
    </View>
  )
}
