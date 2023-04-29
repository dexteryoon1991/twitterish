import { Button, Typo, View } from "@/core"
import { Comment, FetchLikeAndCommentApi, momentFormat, Post, User } from "@/types"
import Image from "next/image"
import React, { useCallback, useEffect, useState } from "react"
import UserImage from "./UserImage"
import moment from "moment"
import { selectUser, useAppSelector } from "@/redux"
import WriteSup from "./WriteSup"
import { CSSProperties } from "@stitches/react"
import Modal from "./Modal"
import { Confirm } from "."
import { usePost } from "@/context"
import { Colors } from "@/lib"
import { AiOutlineHeart, AiFillHeart, AiOutlineEdit, AiFillEdit } from "react-icons/ai"
import { RiDeleteBackLine, RiDeleteBackFill } from "react-icons/ri"
import { MdOutlineCancel, MdCancel } from "react-icons/md"
import { IoChatbubbleEllipsesOutline, IoChatbubbleEllipsesSharp } from "react-icons/io5"
import { useQuery, useQueryClient } from "react-query"
import axios from "axios"
import CommentModal from "./CommentModal"

export default function SupItem(props: Post) {
  const { body, createdAt, createdBy, id, img } = props
  const queryKey = ["like", "comment", id]

  const { data } = useQuery({
    queryKey,
    queryFn: async (): Promise<FetchLikeAndCommentApi> => {
      const { data } = await axios.get("fetch/likecomment", { params: { id } })
      return data
    },
    onSuccess: (res) => {
      console.log("fetched", res)
    },
  })

  const user = useAppSelector(selectUser)
  const [isLiked, setIsLiked] = useState(false)

  const [likes, setLikes] = useState<User[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  useEffect(() => {
    if (data?.payload) {
      const { likes, comments } = data.payload
      setLikes(likes)
      setComments(comments)
    }
  }, [data])

  useEffect(() => {
    if (likes.length > 0) {
      const found = likes.map((like) => like.uid === user.uid)
      setIsLiked(found ? true : false)
    } else setIsLiked(false)
  }, [likes, user])

  const [isEditting, setIsEditting] = useState(false)
  const editHandler = useCallback(() => {
    setIsEditting((prev) => !prev)
  }, [])
  const [isHoveringEdit, setIsHoveringEdit] = useState(false)
  const hoverEdit = useCallback(() => {
    setIsHoveringEdit(true)
  }, [])
  const leaveEdit = useCallback(() => {
    setIsHoveringEdit(false)
  }, [])

  const [isDeletting, setIsDeletting] = useState(false)
  const DelettingHandler = useCallback(() => {
    setIsDeletting((prev) => !prev)
  }, [])
  const [isHoveringDelete, setIsHoveringDelete] = useState(false)
  const hoverDelete = useCallback(() => {
    setIsHoveringDelete(true)
  }, [])
  const leaveDelete = useCallback(() => {
    setIsHoveringDelete(false)
  }, [])

  const { deletePost, likePost } = usePost()
  const onDelete = useCallback(() => {
    deletePost(id)
  }, [id, deletePost])

  const [isHoveringLike, setIsHoveringLike] = useState(false)
  const hoverLike = useCallback(() => {
    setIsHoveringLike(true)
  }, [])
  const leaveLike = useCallback(() => {
    setIsHoveringLike(false)
  }, [])

  const queryClient = useQueryClient()
  const onLike = useCallback(async () => {
    const { success } = await likePost({ id, user })
    if (success) {
      queryClient.invalidateQueries({ queryKey })
      console.log(success)
    }
  }, [id, deletePost, queryKey])

  const [isComment, setIsComment] = useState(false)
  const CommentHandler = useCallback(() => {
    setIsComment((prev) => !prev)
  }, [])
  const [isHoveringComment, setIsHoveringComment] = useState(false)
  const hoverComment = useCallback(() => {
    setIsHoveringComment(true)
  }, [])
  const leaveComment = useCallback(() => {
    setIsHoveringComment(false)
  }, [])

  const buttonStyle: CSSProperties = { fontSize: 20, padding: 5, minHeight: "auto", border: "none" }
  return (
    <View css={{ rowGap: 10 }}>
      {isEditting ? (
        <View css={{ rowGap: 10, position: "relative" }}>
          <WriteSup payload={props} payloadFn={editHandler} />
          <Button onClick={editHandler} css={{ position: "absolute", top: 10, right: 5, fontSize: 20, padding: 0, minHeight: "auto", border: "none" }}>
            <MdOutlineCancel />
          </Button>
        </View>
      ) : (
        <>
          <View direction={"row"} css={{ justifyContent: "space-between", alignItems: "center" }}>
            <View direction="row" css={{ alignItems: "center", columnGap: 10 }}>
              <UserImage user={createdBy} size={20} nameOnly />
              <Typo size="SMALL" color="GRAY">
                {moment(createdAt, momentFormat).fromNow()}
              </Typo>
            </View>

            {user.uid === createdBy?.uid && (
              <View direction="row" css={{ justifyContent: "flex-end", alignItems: "center" }}>
                <Button type="button" onClick={editHandler} css={{ ...buttonStyle }} onMouseEnter={hoverEdit} onMouseLeave={leaveEdit}>
                  {isHoveringEdit ? <AiFillEdit /> : <AiOutlineEdit />}
                </Button>
                <Button type="button" css={{ ...buttonStyle }} onClick={DelettingHandler} onMouseEnter={hoverDelete} onMouseLeave={leaveDelete}>
                  {isHoveringDelete ? <RiDeleteBackFill /> : <RiDeleteBackLine />}
                </Button>
              </View>
            )}
          </View>
          {img && (
            <View
              css={{
                borderRadius: 10,
                overflow: "hidden",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: "0 3px 6px rgba(0,0,0,.1)",
                },
              }}>
              <Image
                src={img}
                alt={`image posted by ${createdBy.name}`}
                width={100}
                height={100}
                style={{ width: "100%", objectFit: "cover", height: "auto" }}
              />
            </View>
          )}
          <Typo
            css={{
              whiteSpace: "pre",
              display: "block",
              padding: "0 10px",
              maxHeight: 100,
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineClamp: 4,
            }}>
            {body}
          </Typo>
          <View direction={"row"} css={{ columnGap: likes.length > 0 ? 10 : undefined }}>
            <View direction={"row"} css={{ alignItems: "center" }}>
              <Button css={{ ...buttonStyle }} onClick={onLike} onMouseEnter={hoverLike} onMouseLeave={leaveLike}>
                {isLiked ? (
                  <AiFillHeart color={isHoveringLike ? undefined : Colors.RED} />
                ) : isHoveringLike ? (
                  <AiFillHeart color={Colors.RED} />
                ) : (
                  <AiOutlineHeart />
                )}
              </Button>
              {likes.length > 0 && <Typo css={{ paddingTop: 3 }}>{likes.length}</Typo>}
            </View>
            <View direction={"row"} css={{ alignItems: "center" }}>
              <Button css={{ ...buttonStyle }} onClick={CommentHandler} onMouseEnter={hoverComment} onMouseLeave={leaveComment}>
                {isHoveringComment ? <IoChatbubbleEllipsesSharp /> : <IoChatbubbleEllipsesOutline />}
              </Button>
              {comments.length > 0 && <Typo css={{ paddingTop: 3 }}>{comments.length}</Typo>}
            </View>
          </View>
          {isComment && <CommentModal id={id} state={isComment} comments={comments} closeFn={CommentHandler} queryKey={queryKey} />}
        </>
      )}
      <Modal state={isDeletting} closeFn={DelettingHandler} title="삭제?!?!">
        <Confirm closeFn={DelettingHandler} message="포스팅을 삭제하시겠습니까?" okBtn={{ name: "삭제", onPress: onDelete }} />
      </Modal>
    </View>
  )
}
