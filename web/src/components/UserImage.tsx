import React, { useCallback, useEffect } from "react"
import { useAppSelector, selectUser } from "@/redux"
import { Button, Typo, View } from "@/core"
import { FaUserCircle } from "react-icons/fa"
import { Colors } from "@/lib"
import { User } from "@/types"
import { useRouter } from "next/router"

interface Props {
  size?: number
  imgOnly?: boolean
  nameOnly?: boolean
  emailOnly?: boolean
  textsOnly?: boolean
  user?: User
}
export default function UserImage({ emailOnly, imgOnly, nameOnly, size, textsOnly, user }: Props) {
  const { email, name, profileImg } = useAppSelector(selectUser)
  useEffect(() => {
    console.log(emailOnly, nameOnly, imgOnly, textsOnly, email, name, profileImg)
  }, [])

  const router = useRouter()
  const onIcon = useCallback(() => {
    if (!user) {
      return router.push({ pathname: "/my" })
    }
    router.push({
      pathname: "/[uid]",
      query: { uid: user.uid },
    })
  }, [user])
  return (
    <View direction="row" css={{ columnGap: 10, alignItems: "center" }}>
      {(!textsOnly || !nameOnly || !emailOnly) && (
        <Button
          css={{ padding: 0, minHeight: "auto", width: size ?? 40, height: size ?? 40, borderRadius: size ?? 40, border: `1px solid ${Colors.LIGHTGRAY}` }}
          onClick={onIcon}>
          {user ? (
            user.profileImg ? (
              <img src={profileImg} alt={"user profile"} />
            ) : (
              <FaUserCircle fontSize={size ?? 40} color={Colors.LIGHTGRAY} />
            )
          ) : profileImg ? (
            <img src={profileImg} alt={"user profile"} />
          ) : (
            <FaUserCircle fontSize={size ?? 40} color={Colors.LIGHTGRAY} />
          )}
        </Button>
      )}
      {!imgOnly && (
        <View>
          {!nameOnly && (
            <Typo weight={"BOLD"} css={{ fontSize: 14 }}>
              {user ? user.email : email}
            </Typo>
          )}
          {!emailOnly && (
            <Typo weight={nameOnly ? "BOLD" : undefined} css={{ fontSize: nameOnly ? 14 : 12 }}>
              {user ? user.name : name}
            </Typo>
          )}
        </View>
      )}
    </View>
  )
}
