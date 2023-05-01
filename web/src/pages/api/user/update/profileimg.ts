// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { dbService, jwtAuth, storage } from "@/lib"
import { uploadString, getDownloadURL } from "firebase/storage"
import { Collection, UpdateProfileImgApi } from "@/types"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = UpdateProfileImgApi
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { authenticated, message, uid } = await jwtAuth(req)
  if (!authenticated || !uid) {
    return res.send({ success: false, message })
  }

  const { img } = req.body as { img: string }
  const docRef = dbService.collection(Collection.USER).doc(uid)
  const base64 = img.split(",")[1]
  const path = `post/${uid}/profileImg`
  const imgRef = storage.ref(path)

  try {
    await uploadString(imgRef, base64, "base64")
    const profileImg = await getDownloadURL(imgRef)
    await docRef.update({ profileImg })
    return res.send({ success: true, profileImg })
  } catch (error: any) {
    return res.send({ success: false, message: error.message })
  }
}
