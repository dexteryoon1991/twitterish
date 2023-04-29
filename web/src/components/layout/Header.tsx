import { Button, View } from "@/core"
import { Colors } from "@/lib"
import { useRouter } from "next/router"
import React, { useCallback, useState } from "react"
import { FaUserCircle, FaRegUserCircle } from "react-icons/fa"
import Menubar from "./Menubar"
// import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai"

export default function Header() {
  const [isMenuActive, setIsMenuActive] = useState(false)
  const menuHandler = useCallback(() => {
    setIsMenuActive((prev) => !prev)
  }, [])

  const router = useRouter()
  const onTitle = useCallback(() => {
    setIsMenuActive(false)
    router.push({ pathname: "/" })
  }, [router])
  return (
    <>
      <View
        position={"fixed"}
        css={{ top: 0, left: 0, width: "100%", borderBottom: `1px solid ${Colors.LIGHTGRAY}`, backgroundColor: Colors.WHITE, zIndex: 10000 }}>
        <View
          position={"relative"}
          direction={"row"}
          css={{
            alignItems: "center",
            height: 60,
            margin: "0 auto",
            width: "100%",
            maxWidth: 600,
            justifyContent: "flex-end",
          }}>
          <Button
            css={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: 900,
              fontSize: 25,
              border: "none",
              "&:active": {
                transform: "translate(-50%, -50%) scale(.9)",
              },
            }}
            onClick={onTitle}>
            Wassup
          </Button>
          <Button css={{ border: "none", fontSize: 30, transition: "all .3s ease-out" }} onClick={menuHandler}>
            {isMenuActive ? <FaUserCircle /> : <FaRegUserCircle />}
          </Button>
        </View>
      </View>
      <Menubar state={isMenuActive} menuHandler={menuHandler} />
    </>
  )
}
