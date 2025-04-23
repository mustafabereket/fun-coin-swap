export interface TokenInfo {
  address: string;
  chainId: string;
}

export type TokenData = {
  [tokenSymbol: string]: TokenInfo;
};

export interface RootLayoutProps {
  children: React.ReactNode;
}

export interface HomeClientProps {
  initialTokens: TokenData;
}

export interface ChainIds {
  USDC: string;
  USDT: string;
  ETH: string;
  WBTC: string;
  POLY: string;
}
