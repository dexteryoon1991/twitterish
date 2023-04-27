import { Button, Typo, View } from "@/core"
import { Colors } from "@/lib"
import { Post } from "@/types"
import Image from "next/image"
import React from "react"
import UserImage from "./UserImage"

export default function SupItem(props: Post) {
  const { body, createdAt, createdBy, id, img } = props
  return (
    <View css={{ rowGap: 10 }}>
      <View>
        <UserImage user={createdBy} size={20} nameOnly />
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
          <Image src={img} alt={`image posted by ${createdBy.name}`} width={100} height={100} style={{ width: "100%", objectFit: "cover", height: "auto" }} />
        </View>
      )}
      <Typo>{body}</Typo>
      <View direction={"row"}>
        <Button>comment</Button>
        <Button>like</Button>
      </View>
    </View>
  )
}
