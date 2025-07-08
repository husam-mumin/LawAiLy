import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const refreshSecret = new TextEncoder().encode(process.env.REFRESH_SECRET!);

export async function createAccessToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1m")
    .sign(secret);
}

export async function createRefreshToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string) {
  return await jwtVerify(token, secret);
}

export async function verifyRefreshToken(token: string) {
  return await jwtVerify(token, refreshSecret);
}
