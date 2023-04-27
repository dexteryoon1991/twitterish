import { View } from "@/core"
import { globalCss } from "@stitches/react"
import React, { PropsWithChildren } from "react"
import Header from "./layout/Header"

export default function Layout({ children }: PropsWithChildren) {
  const globalStyle = globalCss({
    "*": {
      padding: 0,
      margin: 0,
    },
    button: {
      cursor: "pointer",
      transition: "all .2s ease-out",
      "&:hover": {
        opacity: 0.9,
      },
    },
  })

  globalStyle()
  return (
    <>
      <Header />
      <View as="main" css={{ padding: "60px 0" }}>
        {children}
      </View>
    </>
  )
}
