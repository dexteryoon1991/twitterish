import React from "react"
import { View } from "@/core"
import { ImSpinner9 } from "react-icons/im"
import { keyframes } from "@stitches/react"
import { Colors } from "@/lib"

export default function ActivityIndicator() {
  const Animation = keyframes({
    "0%": {
      color: Colors.BLUE,
      transform: "rotate(0deg)",
    },
    "50%": {
      color: Colors.RED,
    },
    "100%": {
      transform: "rotate(360deg)",
      color: Colors.BLUE,
    },
  })
  return (
    <View css={{ width: 40, height: 40, borderRadius: 40, fontSize: 40, animation: `${Animation} 3s infinite` }}>
      <ImSpinner9 />
    </View>
  )
}
