// export async function GET(Request) {}
// export async function HEAD(Request) {}
// export async function POST(Request) {}
// export async function PUT(Request) {}
// export async function DELETE(Request) {}
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ msg: "This is a new API route" });
}
