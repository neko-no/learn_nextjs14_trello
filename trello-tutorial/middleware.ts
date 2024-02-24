import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ['/'],
  // Routes that can always be accessed, and have
  // no authentication information
  afterAuth(auth, req) {
    // ログインしているが，marketingページに行こうといた場合
    if(auth.userId && auth.isPublicRoute) {
        let path = '/select-org';

        if(auth.orgId) {
            path=`/organization/${auth.orgId}`;
        }

        const orgSelection = new URL(path, req.url);
        return NextResponse.redirect(orgSelection);
    }

    // singin指定ない
    if(!auth.userId && !auth.isPublicRoute) {
        return redirectToSignIn({ returnBackUrl: req.url})
    }

    // ユーザーが組織に所属していない場合は，選択画面に飛ばす
    if(auth.userId && !auth.orgId && req.nextUrl.pathname !== '/select-org') {
        const orgSelection = new URL('/select-org', req.url);

        return NextResponse.redirect(orgSelection);
    }
  }
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
