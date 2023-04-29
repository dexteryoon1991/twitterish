import React from "react"
import { View } from "@/core"
import { CSSProperties } from "@stitches/react"

type Props = {
  props?: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
  style?: CSSProperties
}
export default function TextArea({ props, style }: Props) {
  return (
    <View css={{ border: "1px solid", ...style }}>
      <textarea {...props} style={{ backgroundColor: "transparent", resize: "none", border: "none", width: "100%", height: "100%", ...props?.style }} />
    </View>
  )
}
