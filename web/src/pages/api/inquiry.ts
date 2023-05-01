// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { bcrypt, dbService } from "@/lib"
import { Collection, IdAndBody, Inquiry, InquiryApi, momentFormat } from "@/types"
import { doc, getDocs } from "firebase/firestore"
import moment from "moment"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = InquiryApi
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req
  const docRef = dbService.collection(Collection.INQUIRY)
  if (method === "GET") {
    const { email } = req.query as { email?: string }
    if (!email) {
      try {
        const docSnap = await getDocs(docRef)
        const inquiries = docSnap.docs.map((doc) => ({ ...doc.data() })) as Inquiry[]

        return res.send({ success: true, payload: { inquiries } })
      } catch (error: any) {
        return res.send({ success: false, message: error.message })
      }
    } else {
      try {
        const docSnap = await getDocs(docRef.where("email", "==", email))
        const inquiries = docSnap.docs.map((doc) => ({ ...doc.data() })) as Inquiry[]

        return res.send({ success: true, payload: { inquiries } })
      } catch (error: any) {
        return res.send({ success: false, message: error.message })
      }
    }
  } else {
    if (method === "POST") {
      const inquiry = req.body as Inquiry
      const id = await bcrypt.getUid(8)
      const createdAt = moment().format(momentFormat)

      try {
        await docRef.doc(id).set({ ...inquiry, id, createdAt })
        return res.send({ success: true })
      } catch (error: any) {
        return res.send({ success: false, message: error.message })
      }
    } else if (method === "PATCH") {
      const { id, body } = req.body as IdAndBody

      try {
        await docRef.doc(id).update({ body })
        return res.send({ success: true })
      } catch (error: any) {
        return res.send({ success: false, message: error.message })
      }
    } else if (method === "DELETE") {
      const { id } = req.query as { id: string }
      try {
        await docRef.doc(id).delete()
        return res.send({ success: true })
      } catch (error: any) {
        return res.send({ success: false })
      }
    }
  }
}
