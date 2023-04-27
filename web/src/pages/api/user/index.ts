// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { dbService, jwtAuth, useJwt } from "@/lib"
import { bcrypt } from "@/lib"
import { Collection, EmailAndPassword, SignupProps, UserApi, FirebaseUser } from "@/types"
import { getDoc, getDocs } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = UserApi

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req
  if (method === "GET") {
    const { authenticated, message, uid } = await jwtAuth(req)
    if (!authenticated || !uid) {
      return res.send({ success: false, message })
    }
    const docRef = dbService.collection(Collection.USER).doc(uid)
    const userSnap = await getDoc(docRef)
    const user = userSnap.data() as FirebaseUser

    return res.send({ success: true, payload: { user } })
  } else if (method === "POST") {
    const { email, password, name } = req.body as SignupProps
    const docRef = dbService.collection(Collection.CREDENTIAL)

    const targetRef = docRef.where("email", "==", email)
    const docSnap = await getDocs(targetRef)
    const users = docSnap.docs.map((doc) => ({ ...doc.data() })) as EmailAndPassword[]
    if (users.length > 0) {
      return res.send({ success: false, message: "이미 사용된 이메일 입니다." })
    }

    const hashedPassword = await bcrypt.hash(password)
    const uid = await bcrypt.getUid()
    const { accessToken, refreshToken } = await useJwt.getTokens({ uid })

    try {
      await docRef.doc(uid).set({ email, name, uid, password: hashedPassword })
      const user = { email, name, uid }
      const userRef = dbService.collection(Collection.USER).doc(uid)
      await userRef.set(user)
      await userRef.collection(Collection.TOKEN).doc("refreshToken").set({ refreshToken })

      return res.send({ success: true, payload: { user: { ...user, profileImg: "" }, accessToken } })
    } catch (error: any) {
      return res.send({ success: false, message: error.message })
    }
  }
}
