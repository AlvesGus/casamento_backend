// utils/shopee.ts
export function extractShopeeIds(url) {
  const slash = url.match(/\/product\/(\d+)\/(\d+)/)
  if (slash) {
    return { shopId: Number(slash[1]), itemId: Number(slash[2]) }
  }

  const dash = url.match(/-i\.(\d+)\.(\d+)/)
  if (dash) {
    return { shopId: Number(dash[1]), itemId: Number(dash[2]) }
  }

  return null
}
