export type Token = {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

export async function fetchTokens(): Promise<Token[]> {
  const res = await fetch('https://cache.jup.ag/tokens')
  const data = await res.json()
  return Object.values(data)
}