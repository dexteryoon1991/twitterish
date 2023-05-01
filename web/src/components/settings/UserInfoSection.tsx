import { Button, Typo, View } from "@/core"
import { Colors } from "@/lib"
import { User } from "@/types"
import Image from "next/image"
import { useState, useCallback, useRef, ChangeEvent, useEffect, FormEvent } from "react"
import { IoIosSettings } from "react-icons/io"
import { RiEditLine } from "react-icons/ri"
import { MdOutlineCancel } from "react-icons/md"
import { BiCheckCircle } from "react-icons/bi"
import { FaUserCircle } from "react-icons/fa"
import Input from "../Input"
import imageCompression from "browser-image-compression"
import { useAuth } from "@/context"

export default function UserInfoSection({ email, name, uid, profileImg }: User) {
  const [username, setUsername] = useState("")
  const usernameRef = useRef<HTMLInputElement | null>(null)

  const onChangeUsername = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }, [])
  const focusOnUsername = useCallback(() => {
    usernameRef.current?.focus()
  }, [])

  const [isEdit, setIsEdit] = useState(false)
  const editHandler = useCallback(() => {
    setIsEdit((prev) => {
      if (!prev) {
        focusOnUsername()
        setUsername(name)
      }
      return !prev
    })
  }, [focusOnUsername, setUsername, name])

  const { updateName, updateProfileImg } = useAuth()

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (name === username) {
        focusOnUsername()
        return alert("변경사항이 없습니다.")
      }
      updateName(username).then((res) => (res.success ? editHandler() : console.log(res)))
    },
    [username, name, focusOnUsername, editHandler]
  )

  const [file, setFile] = useState<File | null>(null)
  const [fileImg, setFileImg] = useState("")
  const onChangeFile = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files == null) {
        return
      }
      try {
        await imageCompression(e.target.files[0], { maxSizeMB: 0.2 }).then(async (res) => {
          setFile(res)
          const imgUrl = await imageCompression.getDataUrlFromFile(res)
          setFileImg(imgUrl)
          updateProfileImg(imgUrl).then((res) => console.log(res))
        })
      } catch (error: any) {
        alert(error.message)
      }
    },
    [updateProfileImg]
  )
  return (
    <View css={{ rowGap: 10 }}>
      <View direction={"row"} css={{ columnGap: 20, alignItems: "center", justifyContent: "center" }}>
        <Button
          css={{
            padding: 0,
            width: 80,
            height: 80,
            borderRadius: 40,
            overflow: "hidden",
            backgroundColor: profileImg ? Colors.LIGHTGRAY : Colors.WHITE,
            border: `1px solid ${Colors.LIGHTGRAY}`,
            color: Colors.LIGHTGRAY,
            position: "relative",
          }}>
          <View as="label" htmlFor="imgUpload" css={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, cursor: "pointer" }} />
          <img src={profileImg ?? ""} alt="" width={80} height={80} />
          {/* {profileImg || fileImg ? <Image src={profileImg || fileImg} alt="user profile image" width={80} height={80} /> : <FaUserCircle size={80} />} */}
          <input type="file" onChange={onChangeFile} style={{ display: "none" }} id="imgUpload" accept="image/jpg,image/png,image/jpeg,image/gif" />
        </Button>

        <View>
          <View direction={"row"} css={{ alignItems: "center" }}>
            {!isEdit ? (
              <Typo weight="BOLD" size="LARGE">
                {name}
              </Typo>
            ) : (
              <View as="form" onSubmit={onSubmit} direction="row" css={{}}>
                <Input
                  props={{
                    type: "text",
                    value: username,
                    onChange: onChangeUsername,
                    ref: usernameRef,
                    placeholder: "Edit your account name",
                  }}
                />

                <Button css={{ minHeight: "auto", padding: 3, border: "none", fontSize: 20, marginLeft: 5 }} onClick={editHandler} type="button">
                  <MdOutlineCancel />
                </Button>
                <Button css={{ minHeight: "auto", padding: 3, border: "none", fontSize: 20 }} type="submit">
                  <BiCheckCircle />
                </Button>
              </View>
            )}
            {!isEdit && (
              <Button css={{ minHeight: "auto", padding: 3, border: "none", fontSize: 20 }} onClick={editHandler}>
                <RiEditLine />
              </Button>
            )}
          </View>
          <Typo css={{ fontSize: 13 }}>{email}</Typo>
        </View>
      </View>
      {/* <Button css={{ flexDirection: "row", alignItems: "center", columnGap: 10, width: 80, padding: 5, minHeight: "auto" }}>
        <Typo>edit</Typo>
        <IoIosSettings size={20} />
      </Button> */}
    </View>
  )
}
