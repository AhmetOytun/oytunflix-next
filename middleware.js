import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/utils/auth";

export async function middleware(req) {
    const token = req.headers.get("X-Auth-Token");
    if (!token) {
        console.log("No token found");
        return new NextResponse("Unauthorized", { status: 401 });
    } else {
        try {
            const decodedToken = await verifyJwtToken(token);
            if(decodedToken === null) {
                return new NextResponse("Unauthorized", { status: 401 });
            }
            const res = NextResponse.next();
            res.headers.set('X-Decoded-Token', JSON.stringify(decodedToken));

            return res;
        } catch (err) {
            console.log(err);
            return new NextResponse("Unauthorized", { status: 401 });
        }
    }
}

export const config = {
    matcher: ["/api/library", "/api/user/info","/api/[movieId]/[userId"],
};
