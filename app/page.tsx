// app/page.jsx (Server Component)
import HomeClient from "./components/HomeClient/HomeClient";
import { getAssetErc20ByChainAndSymbol } from "@funkit/api-base";
import "./page.module.css";
import { ChainIds, TokenData } from "./types";

// List of symbols and their chains
const CHAIN_IDS: ChainIds = {
  USDC: "1",
  USDT: "137",
  ETH: "8453",
  WBTC: "1",
  POLY: "137",
};

export default async function Page() {
  const apiKey = process.env.NEXT_PUBLIC_FUNKIT_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not defined");
  }

  const tokenInfos = await Promise.all(
    Object.keys(CHAIN_IDS).map((symbol) =>
      getAssetErc20ByChainAndSymbol({
        chainId: CHAIN_IDS[symbol as keyof ChainIds],
        symbol,
        apiKey,
      })
    )
  );

  // Build a lookup map: { USDC: { address, chainId }, ... }
  const initialTokens: TokenData = tokenInfos.reduce((map, info) => {
    map[info.symbol] = {
      address: info.address,
      chainId: CHAIN_IDS[info.symbol as keyof ChainIds],
    };
    return map;
  }, {} as TokenData);

  console.log(initialTokens);

  // Pass preloaded data into the client
  return <HomeClient initialTokens={initialTokens} />;
}
