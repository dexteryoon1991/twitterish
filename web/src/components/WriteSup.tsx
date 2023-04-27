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
    const options: Options = { maxSizeMB: 1 }

    try {
      const compressedFile = await imageCompression(inputFile, options)
      setFile(compressedFile)

      const imgUrl = await imageCompression.getDataUrlFromFile(compressedFile)
      console.log(imgUrl)
      setFileUrl(imgUrl)
    } catch (error: any) {}
  }, [])

  useEffect(() => {
    focusOnBody()
  }, [])

  const { createPost } = usePost()

  const user = useAppSelector(selectUser)
  const onSubmit = useCallback(() => {
    const createdAt = moment().format(momentFormat)
    const id = user.uid.concat(new Date().getTime().toString())
    if (bodyText) {
      if (file == null || fileUrl == null) {
        alert(`사진 또는 ${bodyText}`)
        return focusOnBody()
      }
      return createPost({ body, img: fileUrl, createdBy: user, createdAt, id })
    }
    createPost({ body, img: fileUrl, createdBy: user, createdAt, id })
  }, [body, bodyText, file, fileUrl, createPost])
  return (
    <View css={{ maxWidth: 600, width: "calc(100% - 20px)", margin: "0 auto", rowGap: 10 }}>
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
