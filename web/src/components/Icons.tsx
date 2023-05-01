import React, { PropsWithChildren } from "react"
import { IconType } from "react-icons"
import { CSSProperties } from "@stitches/react"
import { Button, View, Typo } from "@/core"

type Props = {
  icon?: IconType
  hoverIcon?: IconType
  activeIcon?: IconType
  style?: CSSProperties
  hoverStyle?: CSSProperties
  activeStyle?: CSSProperties
} & PropsWithChildren
export default function Icons({ children }: Props) {
  return <Button>Icons</Button>
}
