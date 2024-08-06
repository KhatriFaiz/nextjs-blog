import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import jwt from "jsonwebtoken";

/**
 * @typedef User
 * @type {object}
 * @property {string} id - MongoDB ObjectID
 */

/**
 * Accepts cookieStore object from request and return `{ id: string }` or `null` based on JWT token from  the request cookies
 *
 * @param cookieStore
 */

export function verifyUser(
  cookieStore: ReadonlyRequestCookies
): { id: string } | null {
  const token = cookieStore.get("token");
  if (!token) {
    return null;
  }

  // Validate jwt
  try {
    const user = <{ id: string }>(
      jwt.verify(token.value, process.env.ACCESS_TOKEN_SECRET || "")
    );
    return user;
  } catch (error) {
    return null;
  }
}
