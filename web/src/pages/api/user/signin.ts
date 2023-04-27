// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { bcrypt, dbService, useJwt } from "@/lib"
import { Collection, Credential, EmailAndPassword, User, UserApi } from "@/types"
import { getDoc, getDocs } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = UserApi

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email, password } = req.body as EmailAndPassword
  const docRef = dbService.collection(Collection.CREDENTIAL).where("email", "==", email)
  const docSnap = await getDocs(docRef)
  const users = docSnap.docs.map((doc) => ({ ...doc.data() })) as Credential[]

  console.log(req.body, users)
  if (!users || !users.length) {
    return res.send({ success: false, message: "존재하지 않는 유저입니다." })
  }
  const { password: foundPwd, uid } = users[0]
  const isPwdCorrect = await bcrypt.compare(password, foundPwd)
  if (!isPwdCorrect) {
    return res.send({ success: false, message: "비밀번호가 일치하지 않습니다." })
  }
  const { accessToken, refreshToken } = await useJwt.getTokens({ uid })

  try {
    const userRef = dbService.collection(Collection.USER).doc(uid)
    const userSnap = await getDoc(userRef)
    const user = userSnap.data() as any

    await userRef.collection(Collection.TOKEN).doc("refreshToken").set({ refreshToken })

    return res.send({ success: true, payload: { user, accessToken } })
  } catch (error: any) {
    return res.send({ success: false, message: error.message })
  }
}
