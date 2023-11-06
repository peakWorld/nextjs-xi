import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("nextUrl", request.nextUrl.pathname);

  if (request.nextUrl.pathname.startsWith("/test")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// middleware 只处理这些路由
// 为配置config, 则匹配所有的路由
export const config = {
  matcher: [
    "/test/:path*", // 0+ 路由seg
    "/test1/:path+", // 1+ 路由seg
    "/test2/:path?", // 0或1 路由seg
  ],
};
