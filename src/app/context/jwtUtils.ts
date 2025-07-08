import jwt_decode from "jwt-decode";

export interface DecodedUser {
  _id: string;
  email: string;
  name?: string;
  role?: string;
  isBanned?: boolean;
  provider?: string;
  // Add other fields as needed
}

export function decodeUserFromJWT(token: string): DecodedUser | null {
  try {
    return jwt_decode(token) as DecodedUser;
  } catch (e) {
    return null;
  }
}
