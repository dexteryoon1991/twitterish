// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { dbService } from "@/lib"
import { API, Collection } from "@/types"
import { getDoc } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = API
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  return res.send({ success: false, message: req.query })
}
