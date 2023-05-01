import { Button, Typo, View } from "@/core"
import { CSSProperties } from "@stitches/react"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { AiOutlineHeart, AiFillHeart, AiOutlineEdit, AiFillEdit } from "react-icons/ai"
import { RiDeleteBackLine, RiDeleteBackFill } from "react-icons/ri"
import { MdOutlineCancel, MdCancel } from "react-icons/md"
import { IoChatbubbleEllipsesOutline, IoChatbubbleEllipsesSharp } from "react-icons/io5"
import { useQuery, useQueryClient } from "react-query"
import { Comment, FetchLikeAndCommentApi, User } from "@/types"
import axios from "axios"
import { usePost } from "@/context"
import { selectUser, useAppSelector } from "@/redux"
import { Colors } from "@/lib"
import Image from "next/image"

interface Props {
  body?: string
  img?: string
  id?: string
}
export default function MyPost({ body, img, id }: Props) {
  const queryKey = useMemo(() => ["like", "comment", id], [id])
  const { data } = useQuery(queryKey, async (): Promise<FetchLikeAndCommentApi> => {
    const { data } = await axios.get("fetch/likecomment", { params: { id } })
    return data
  })

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

  const user = useAppSelector(selectUser)

  useEffect(() => {
    if (likes.length > 0) {
      const found = likes.map((like) => like.uid === user.uid)
      setIsLiked(found ? true : false)
    } else setIsLiked(false)
  }, [likes, user])

  const { likePost, createComment, editComment, deleteComment } = usePost()
  const queryClient = useQueryClient()
  const onLike = useCallback(async () => {
    if (!id) {
      return
    }
    const { success } = await likePost({ id, user })
    if (success) {
      queryClient.invalidateQueries({ queryKey })
      console.log(success)
    }
  }, [id, likePost, queryKey, user, queryClient])

  const [commenting, setCommenting] = useState(false)
  const commentHandler = useCallback(() => setCommenting((prev) => !prev), [])

  return (
    <View css={{ maxWidth: 600, height: "calc(100% - 40px)" }}>
      {img && (
        <View css={{ backgroundColor: "gainsboro" }}>
          <Image src={img} alt="" width={100} height={100} style={{ width: "100%", height: "auto" }} />
        </View>
      )}
      <View direction={"row"} css={{ columnGap: 10, padding: "0 10px" }}>
        <View direction={"row"} css={{ alignItems: "center" }}>
          <Button
            css={{ ...buttonStyle }}
            onClick={onLike}
            //   onMouseEnter={hoverLike} onMouseLeave={leaveLike}
          >
            {isLiked ? <AiFillHeart color={Colors.RED} /> : <AiOutlineHeart />}
          </Button>
          {likes.length > 0 && <Typo css={{ paddingTop: 3 }}>{likes.length}</Typo>}
        </View>
        <Button css={{ ...buttonStyle }}>
          <IoChatbubbleEllipsesOutline />
        </Button>
      </View>
      {body && <Typo css={{ padding: 10, backgroundColor: "red" }}>{body}</Typo>}
    </View>
  )
}

const buttonStyle: CSSProperties = { border: "none", padding: 0, fontSize: 20 }
