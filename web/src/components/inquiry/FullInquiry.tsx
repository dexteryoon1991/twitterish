import { Typo, View } from "@/core"
import { Inquiry } from "@/types"
import React from "react"

export default function FullInquiry({ body, title }: Inquiry) {
  return (
    <View css={{ padding: 20, minWidth: 160, maxWidth: 260 }}>
      <Typo css={{ width: "100%", whiteSpace: "pre-wrap" }}>{body}</Typo>
    </View>
  )
}
