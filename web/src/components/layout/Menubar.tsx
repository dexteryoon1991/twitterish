import { useAuth } from "@/context"
import { View, Button } from "@/core"
import { Colors } from "@/lib"
import { Menu } from "@/types"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useState } from "react"
import { FiUser, FiUserX, FiUserPlus } from "react-icons/fi"
import { IoChatbubbleEllipsesOutline, IoExitOutline } from "react-icons/io5"
import { BsHeadset } from "react-icons/bs"
import Modal from "../Modal"
import NewSsup from "./NewSsup"

interface Props {
  state: boolean
  menuHandler: () => void
}
export default function Menubar({ state, menuHandler }: Props) {
  const { isLoggedIn } = useAuth()
  const [menus, setMenus] = useState<Menu[]>([])
  useEffect(() => {
    setMenus(
      isLoggedIn
        ? [
            {
              name: "new ssup",
              icon: <IoChatbubbleEllipsesOutline />,
            },
            {
              name: "문의하기",
              pathname: "/inquiry",
              icon: <BsHeadset />,
            },
            {
              name: "로그아웃",
              icon: <IoExitOutline />,
            },
          ]
        : [
            {
              name: "로그인",
              pathname: "/signin",
              icon: <FiUser />,
            },
            {
              name: "회원가입",
              pathname: "/signup",
              icon: <FiUserPlus />,
            },
            {
              name: "계정분실",
              pathname: "/lost&found",
              icon: <FiUserX />,
            },
          ]
    )
  }, [isLoggedIn])

  const router = useRouter()

  const [newSsup, setNewSsup] = useState(false)
  const newSsupHandler = useCallback(() => {
    setNewSsup((prev) => !prev)
  }, [])
  const onMenu = useCallback(
    (name: string, pathname?: string) => {
      menuHandler()
      if (pathname) {
        return router.push({ pathname })
      }
      if (name === "new ssup") {
        newSsupHandler()
      }
    },
    [router, menuHandler]
  )

  return (
    <>
      {state && <View position={"fixed"} css={{ width: "100%", height: "100vh", top: 60, left: 0 }} onClick={menuHandler} />}
      <View
        position={"fixed"}
        css={{
          transition: "all .5s ease-out",
          zIndex: 100,
          bottom: 0,
          justifyContent: "space-around",
          width: "100%",
          left: 0,
          borderTop: `1px solid ${Colors.LIGHTGRAY}`,
          backgroundColor: Colors.WHITE,
          padding: "10px 0",
        }}
        style={state ? {} : { opacity: 0, visibility: "hidden", bottom: "-100%" }}
        direction="row">
        {menus.map(({ name, pathname, icon }) => (
          <Button
            key={name}
            onClick={() => onMenu(name, pathname)}
            css={{
              width: 80,
              border: "none",
              rowGap: 10,
              color: router.pathname === pathname ? Colors.BLUE : undefined,
              "&:hover": {
                backgroundColor: "rgba(0,0,0,.03)",
              },
            }}>
            <View css={{ fontSize: 20 }}>{icon}</View>
            {name}
          </Button>
        ))}
      </View>
      <Modal state={newSsup} closeFn={newSsupHandler} title="New Ssup!">
        <NewSsup state={newSsup} closeFn={newSsupHandler} />
      </Modal>
    </>
  )
}
