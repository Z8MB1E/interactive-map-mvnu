import db from "@/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const markers = await db.GetMapMarkers();
  return NextResponse.json(markers);
};