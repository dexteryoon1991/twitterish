import { View, Button } from "@/core"
import { Colors } from "@/lib"
import React, { useState, useRef, useCallback, ChangeEvent, useEffect, useMemo } from "react"
import UserImage from "./UserImage"
import { BsCardImage } from "react-icons/bs"
import imageCompression, { Options } from "browser-image-compression"
import Image from "next/image"
import { usePost } from "@/context"
import { selectUser, useAppSelector } from "@/redux"
import moment from "moment"
import { momentFormat } from "@/types"
import { ImSpinner9 } from "react-icons/im"
import { keyframes } from "@stitches/react"

export default function WriteSup() {
  const [body, setBody] = useState("")
  const bodyRef = useRef<HTMLTextAreaElement | null>(null)
  const focusOnBody = useCallback(() => {
    bodyRef.current?.focus()
  }, [])
  const onChangeBody = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
  }, [])

  const bodyText = useMemo(() => {
    if (!body) {
      return "내용을 입력하세요."
    }
    return null
  }, [body])

  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState("")

  const onChangeFile = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) {
      return
    }

    const inputFile = e.target.files[0]
    const options: Options = { maxSizeMB: 0.9 }

    try {
      const compressedFile = await imageCompression(inputFile, { maxSizeMB: 1, alwaysKeepResolution: true })
      setFile(compressedFile)

      const imgUrl = await imageCompression.getDataUrlFromFile(compressedFile)
      setFileUrl(imgUrl)
    } catch (error: any) {
      alert(error.message)
    }
  }, [])

  useEffect(() => {
    focusOnBody()
  }, [])

  const { createPost, isProcessing } = usePost()

  const user = useAppSelector(selectUser)

  const onSubmit = useCallback(async () => {
    const createdAt = moment().format(momentFormat)
    const id = user.uid.concat(new Date().getTime().toString())
    if (bodyText) {
      if (file == null || fileUrl == null) {
        alert(`사진 또는 ${bodyText}`)
        return focusOnBody()
      }
      return await createPost({ body, img: fileUrl, createdBy: user, createdAt, id }).then(({ success }) => {
        if (success) {
          setBody("")
          setFile(null)
          setFileUrl("")
        }
      })
    }
    await createPost({ body, img: fileUrl, createdBy: user, createdAt, id }).then(({ success }) => {
      if (success) {
        setBody("")
        setFile(null)
        setFileUrl("")
      }
    })
  }, [body, bodyText, file, fileUrl, createPost])

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
    <View css={{ maxWidth: 600, width: "100%", margin: "0 auto", rowGap: 10, position: "relative" }}>
      {isProcessing && (
        <View
          css={{
            backgroundColor: "rgba(0,0,0,.05)",
            borderRadius: 5,
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
          position="absolute">
          <View css={{ width: 40, height: 40, borderRadius: 40, fontSize: 40, animation: `${Animation} 3s infinite` }}>
            <ImSpinner9 />
          </View>
        </View>
      )}
      <UserImage nameOnly />

      <View direction="row" css={{ columnGap: 10 }}>
        <View
          as="textarea"
          onChange={onChangeBody}
          value={body}
          placeholder="type here..."
          ref={bodyRef}
          css={{
            backgroundColor: "rgba(0,0,0,.05)",
            borderRadius: 5,
            resize: "none",
            border: `1px solid ${Colors.LIGHTGRAY}`,
            padding: 5,
            minHeight: 50,
            flex: 1,
          }}
        />
        <input accept="image/jpg,image/png,image/jpeg,image/gif" type="file" onChange={onChangeFile} style={{ display: "none" }} id="imgFile" />
        <Button
          css={{ minWidth: 50, border: `1px solid ${Colors.LIGHTGRAY}`, padding: 0, cursor: "pointer", overFlow: "hidden", borderRadius: 5 }}
          htmlFor={"imgFile"}
          as="label">
          {fileUrl ? <Image src={fileUrl} alt={file != null ? file.name : ""} width={50} height={60} style={{ objectFit: "cover" }} /> : <BsCardImage />}
        </Button>

        <Button colors="BLUE" onClick={onSubmit} css={{ minWidth: 50 }}>
          Sup!
        </Button>
      </View>
    </View>
  )
}
