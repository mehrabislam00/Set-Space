const CACHE_NAME = "setspace-profile-avatars-v1"
const VERSION_HEADER = "x-setspace-avatar-version"

function cacheKey(userId: string) {
  return new Request(
    `${window.location.origin}/__setspace/profile-avatar/${encodeURIComponent(userId)}`
  )
}

export async function readProfileAvatarCache(userId: string) {
  if (!("caches" in window)) return null

  const cache = await window.caches.open(CACHE_NAME)
  const response = await cache.match(cacheKey(userId))
  if (!response) return null

  return {
    blob: await response.blob(),
    version: response.headers.get(VERSION_HEADER) ?? "",
  }
}

export async function writeProfileAvatarCache(
  userId: string,
  blob: Blob,
  version: string
) {
  if (!("caches" in window)) return

  const cache = await window.caches.open(CACHE_NAME)
  await cache.put(
    cacheKey(userId),
    new Response(blob, {
      headers: {
        "Content-Type": blob.type || "application/octet-stream",
        [VERSION_HEADER]: version,
      },
    })
  )
}

export async function deleteProfileAvatarCache(userId: string) {
  if (!("caches" in window)) return

  const cache = await window.caches.open(CACHE_NAME)
  await cache.delete(cacheKey(userId))
}
