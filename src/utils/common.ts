export function getDisplayMaxDecimals(decimals?: number) {
  const maxDisplayDecimals = 8

  if (decimals === undefined) return 0

  return decimals < maxDisplayDecimals ? decimals : maxDisplayDecimals
}

export function shorterAddress(address: string, maxLength = 10) {
  const length = Math.floor(maxLength / 2)

  if ((address?.length || Infinity) <= maxLength) {
    return address
  }

  return address
    ? `${address.substring(0, length)}...${address.substring(
        address.length - length,
        address.length,
      )}`
    : ''
}
