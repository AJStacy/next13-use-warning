/**
 * Because Response.json() always returns a Promise<any> we want to
 * use a Promise<unknown> for safety. This will force use to validate
 * the value provided to us from the API.
 */
export async function safeJsonFetch(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<unknown> {
  const res = await fetch(input, init);
  return res.json();
}