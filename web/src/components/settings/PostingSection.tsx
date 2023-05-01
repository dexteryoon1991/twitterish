import { Button, Typo, View } from "@/core"
import { MyPostApi, Post, User } from "@/types"
import axios from "axios"
import React, { useCallback, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { BsImage, BsPlusCircle } from "react-icons/bs"
import { Colors } from "@/lib"
import Modal from "../Modal"
import MyPost from "./MyPost"

export default function PostingSection({ uid }: User) {
  const { data } = useQuery([uid, "post"], async (): Promise<MyPostApi> => {
    const { data } = await axios.get("fetch/myposts", { withCredentials: true })
    return data
  })

  const [posts, setPosts] = useState<Post[]>([])
  useEffect(() => {
    setPosts(data?.payload?.posts ? data.payload.posts : [])
  }, [data])
  return (
    <View
      css={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr", border: `1px soild ${Colors.LIGHTGRAY}`, borderRadius: 5, overflow: "hidden" }}>
      <PostItem newItem />
      {posts?.map((post) => (
        <PostItem key={post.id} {...post} />
      ))}
    </View>
  )
}

function PostItem({ img, body, newItem, id }: { newItem?: boolean; body?: string; img?: string; id?: string }) {
  const [isHovering, setIsHovering] = useState(false)
  const onHover = useCallback(() => setIsHovering(true), [])
  const onLeave = useCallback(() => setIsHovering(false), [])

  const [isAdding, setIsAdding] = useState(false)
  const addingHandler = useCallback(() => setIsAdding((prev) => !prev), [])

  const [modal, setModal] = useState(false)
  const modalHandler = useCallback(() => setModal((prev) => !prev), [])

  const onClick = useCallback(() => {
    newItem ? addingHandler() : modalHandler()
  }, [newItem, addingHandler, modalHandler])

  useEffect(() => {
    console.log(modal, isAdding)
  }, [modal, isAdding])
  return (
    <>
      <Button css={{ padding: 0, borderRadius: 0, border: "none" }} onClick={onClick} onMouseEnter={onHover} onMouseLeave={onLeave}>
        <View
          css={{
            width: 100,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            position: "relative",
            backgroundColor: newItem ? Colors.WHITE : Colors.LIGHTGRAY,
          }}>
          <Typo
            css={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "80%",
              transform: "translate(-50%, -50%)",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}>
            {body}
          </Typo>
          {newItem ? (
            <BsPlusCircle size={40} color={Colors.GRAY} />
          ) : img ? (
            <img src={img} alt="" style={{ height: "100%", objectFit: "cover" }} />
          ) : (
            <BsImage size={40} color={"rgba(0, 0, 0, .1)"} />
          )}
        </View>
      </Button>

      <Modal state={modal} closeFn={modalHandler} title="My Post">
        {modal && <MyPost body={body} img={img} id={id} />}
      </Modal>
    </>
  )
}
