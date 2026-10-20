import { timingSafeEqual } from "node:crypto";

/**
 * Local-development guard, NOT production login or an identity system.
 * Fail closed outside development, and when no key is configured.
 */
export function hasDemoOperatorAccess(configured: string | undefined, supplied: string | null, environment: string | undefined): boolean {
  if (environment !== "development" || !configured || !supplied || configured.length < 12) return false;
  const left = Buffer.from(configured);
  const right = Buffer.from(supplied);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function canUseDemoOperatorApi(request: Request): boolean {
  return hasDemoOperatorAccess(process.env.DEMO_OPERATOR_KEY, request.headers.get("x-demo-operator-key"), process.env.NODE_ENV);
}
