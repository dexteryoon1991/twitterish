import { usePost } from "@/context"
import { Button, Typo, View } from "@/core"
import { Colors } from "@/lib"
import { selectUser, useAppSelector } from "@/redux"
import { Comment } from "@/types"
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useQueryClient } from "react-query"
import TextArea from "./TextArea"
import UserImage from "./UserImage"
import { AiFillEdit } from "react-icons/ai"
import { RiDeleteBackFill } from "react-icons/ri"
import { MdOutlineCancel } from "react-icons/md"
import { BiCheckCircle } from "react-icons/bi"
import Modal from "./Modal"
import { Confirm } from "."

type Props = {
  comments: Comment[]
  state: boolean
  closeFn: () => void
  queryKey: any[]
  id: string
}
export default function CommentModal({ comments, state, closeFn, queryKey, id }: Props) {
  const [body, setBody] = useState("")
  const bodyRef = useRef<HTMLTextAreaElement | null>(null)
  const focusOnBody = useCallback(() => {
    bodyRef.current?.focus()
  }, [])

  useEffect(() => {
    console.log(state ? comments : "")
    state && focusOnBody()
  }, [comments, state])

  const onChangeBody = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
  }, [])
  const { createComment } = usePost()

  const queryClient = useQueryClient()
  const bodyText = useMemo(() => {
    if (!body) {
      return "댓글을 입력하세요."
    }
    return null
  }, [body])
  const user = useAppSelector(selectUser)
  const onSubmit = useCallback(async () => {
    if (bodyText) {
      return alert(bodyText)
    }

    const { success, message } = await createComment({ body, createdBy: user, postId: id })
    if (!success) {
      return alert(message)
    }
    setBody("")
    queryClient.invalidateQueries({ queryKey })
  }, [body, createComment, user, bodyText, queryKey, queryClient])
  return (
    <View css={{ padding: 10, borderRadius: 5, backgroundColor: "rgba(0,0,0,.02)", columnGap: 10, justifyContent: "center", width: "100%", rowGap: 10 }}>
      <View css={{ rowGap: 10 }}>
        <View>
          <UserImage nameOnly size={30} />
        </View>
        <View css={{ rowGap: 10, alignItems: "flex-end" }}>
          <TextArea
            props={{
              value: body,
              onChange: onChangeBody,
              ref: bodyRef,
              placeholder: comments.length === 0 ? "Be 1st to write Comment..." : "write here...",
              style: {
                padding: 10,
                width: "calc(100% - 20px)",
              },
            }}
            style={{ flex: 1, resize: "none", backgroundColor: "transparent", border: `1px solid ${Colors.LIGHTGRAY}`, borderRadius: 5, width: "100%" }}
          />
          <Button css={{ width: 100, minHeight: "100%", height: "100%" }} colors="BLUE" onClick={onSubmit}>
            Submit
          </Button>
        </View>
      </View>
      {comments?.map((comment, index) => (
        <Item key={index} {...comment} postId={id} queryKey={queryKey} />
      ))}
    </View>
  )
}

function Item({ body, createdAt, createdBy, id, queryKey, postId }: Comment & { queryKey: any[]; postId: string }) {
  const { uid } = useAppSelector(selectUser)
  const [isEdit, setIsEdit] = useState(false)
  const editHandler = useCallback(() => {
    setIsEdit((prev) => !prev)
  }, [])

  const [text, setText] = useState(body)
  const textRef = useRef<HTMLTextAreaElement | null>(null)
  const focusOnText = useCallback(() => {
    textRef.current?.focus()
    setText(body)
  }, [body])
  const onChangeText = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }, [])
  useEffect(() => {
    isEdit && focusOnText()
  }, [isEdit])

  const { editComment, deleteComment } = usePost()
  const queryClient = useQueryClient()
  const onEditSubmit = useCallback(async () => {
    const { success, message } = await editComment({ body: text, id: id!, postId })
    if (!success) {
      return alert(message)
    }
    editHandler()
    return queryClient.invalidateQueries({ queryKey })
  }, [text, body, id, queryKey, queryClient, editHandler])

  const [isDelete, setIsDelete] = useState(false)
  const deleteHandler = useCallback(() => {
    setIsDelete((prev) => !prev)
  }, [])

  const onDelete = useCallback(async () => {
    if (!id) {
      return
    }
    const { success, message } = await deleteComment({ id, postId })
    if (!success) {
      alert(message)
    }
    return queryClient.invalidateQueries({ queryKey })
  }, [deleteComment, postId, id, queryKey, queryClient])
  return (
    <>
      <View direction={"row"} css={{ alignItems: "center", columnGap: 10, padding: 10, backgroundColor: Colors.WHITE, borderRadius: 5 }}>
        <View>
          <UserImage size={30} nameOnly user={createdBy} />
        </View>
        {isEdit ? (
          <TextArea
            props={{
              value: text,
              onChange: onChangeText,
              ref: textRef,
              style: { padding: 5 },
            }}
            style={{ width: "calc(100% - 200px)", flex: 1, border: "none" }}
          />
        ) : (
          <Typo css={{ width: "calc(100% - 200px)", flex: 1 }}>{body}</Typo>
        )}
        {uid === createdBy.uid && (
          <View direction="row">
            {isEdit && (
              <Button css={{ border: "none", padding: 5, fontSize: 15 }} onClick={onEditSubmit}>
                <BiCheckCircle />
              </Button>
            )}
            <Button onClick={editHandler} css={{ border: "none", padding: 5, fontSize: 15 }}>
              {isEdit ? <MdOutlineCancel /> : <AiFillEdit />}
            </Button>
            <Button onClick={deleteHandler} css={{ border: "none", padding: 5, fontSize: 15 }}>
              <RiDeleteBackFill />
            </Button>
          </View>
        )}
      </View>
      <Modal state={isDelete} closeFn={deleteHandler} title="삭제?!?!">
        <Confirm closeFn={deleteHandler} message="포스팅을 삭제하시겠습니까?" okBtn={{ name: "삭제", onPress: onDelete }} />
      </Modal>
    </>
  )
}
