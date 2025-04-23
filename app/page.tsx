import HomeClient from "./components/HomeClient/HomeClient";
import { getAssetErc20ByChainAndSymbol } from "@funkit/api-base";
import "./page.module.css";
import { ChainIds, TokenData } from "./types";

const CHAIN_IDS: ChainIds = {
  USDC: "1",
  USDT: "137",
  ETH: "8453",
  WBTC: "1",
  POLY: "137",
};
// This main page is SSR rendered, I am fetching all the addresses and making everything ready beforehand.
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

  const initialTokens: TokenData = tokenInfos.reduce((map, info) => {
    map[info.symbol] = {
      address: info.address,
      chainId: CHAIN_IDS[info.symbol as keyof ChainIds],
    };
    return map;
  }, {} as TokenData);

  console.log(initialTokens);

  return <HomeClient initialTokens={initialTokens} />;
}
