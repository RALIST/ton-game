import {NextRequest} from "next/server";

export async function POST(request: NextRequest) {
  const res = await request.json()
  return Response.json({ res })
}
