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
import { momentFormat, Post } from "@/types"
import { ImSpinner9 } from "react-icons/im"
import { keyframes } from "@stitches/react"
import { useRouter } from "next/router"
import { useQueryClient } from "react-query"
import ActivityIndicator from "./ActivityIndicator"

type Props = { payload?: Post; payloadFn?: () => void }
export default function WriteSup({ payload, payloadFn }: Props) {
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

  useEffect(() => {
    if (payload) {
      setBody(payload.body)
      payload.img && setFileUrl(payload.img)
    }
  }, [payload])

  const onChangeFile = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) {
      return
    }

    const inputFile = e.target.files[0]
    const options: Options = { maxSizeMB: 0.2 }

    try {
      await imageCompression(inputFile, options).then(async (res) => {
        setFile(res)
        console.log(res)
        const imgUrl = await imageCompression.getDataUrlFromFile(res)
        setFileUrl(imgUrl)
      })
    } catch (error: any) {
      alert(error.message)
    }
  }, [])

  useEffect(() => {
    focusOnBody()
  }, [focusOnBody])

  const { createPost, isProcessing, editPost } = usePost()

  const user = useAppSelector(selectUser)

  const router = useRouter()

  const queryClient = useQueryClient()

  const onSubmit = useCallback(async () => {
    const createdAt = moment().format(momentFormat)
    const id = user.uid.concat(new Date().getTime().toString())
    if (bodyText) {
      if (file == null || fileUrl == null) {
        alert(`사진 또는 ${bodyText}`)
        return focusOnBody()
      }
      return payload
        ? await editPost({ ...payload, body, img: fileUrl }).then(async () => {
            router.replace(router.asPath)
            queryClient.invalidateQueries("post")
            payloadFn && payloadFn()
          })
        : await createPost({ body, img: fileUrl, createdBy: user, createdAt, id }).then(({ success }) => {
            if (success) {
              setBody("")
              setFile(null)
              setFileUrl("")
              router.replace(router.asPath)
              queryClient.invalidateQueries("post")
            }
          })
    }
    payload
      ? editPost({ ...payload, body, img: fileUrl }).then(async () => {
          router.replace(router.asPath)
          queryClient.invalidateQueries("post")
          payloadFn && payloadFn()
        })
      : await createPost({ body, img: fileUrl, createdBy: user, createdAt, id }).then(({ success }) => {
          if (success) {
            setBody("")
            setFile(null)
            setFileUrl("")
            router.replace(router.asPath)
            queryClient.invalidateQueries("post")
          }
        })
  }, [body, bodyText, file, fileUrl, createPost, router, editPost, focusOnBody, payload, payloadFn, queryClient, user])

  return (
    <View css={{ width: "100%", margin: "0 auto", rowGap: 10, position: "relative" }}>
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
          <ActivityIndicator />
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
