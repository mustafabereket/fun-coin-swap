"use client";
import React, { useState, useMemo } from "react";
import styles from "./HomeClient.module.css";
import { useDebounce } from "../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { getAssetPriceInfo } from "@funkit/api-base";

export default function HomeClient({ initialTokens }) {
  const [inputAmount, setInputAmount] = useState("");
  const debouncedAmount = useDebounce(inputAmount, 200);
  const amount = useMemo(() => {
    const num = parseFloat(debouncedAmount);
    return isNaN(num) ? 0 : num;
  }, [debouncedAmount]);

  const [sourceToken, setSourceToken] = useState("");
  const [destToken, setDestToken] = useState("");

  const sourceData = useQuery({
    queryKey: ["price", sourceToken],
    queryFn: () =>
      getAssetPriceInfo({
        chainId: initialTokens[sourceToken].chainId,
        assetTokenAddress: initialTokens[sourceToken].address,
        apiKey: process.env.NEXT_PUBLIC_FUNKIT_API_KEY,
      }),
    enabled: !!sourceToken,
    staleTime: 0,
    cacheTime: 0,
    refetchInterval: 3000,
  });

  const destData = useQuery({
    queryKey: ["price", destToken],
    queryFn: () =>
      getAssetPriceInfo({
        chainId: initialTokens[destToken].chainId,
        assetTokenAddress: initialTokens[destToken].address,
        apiKey: process.env.NEXT_PUBLIC_FUNKIT_API_KEY,
      }),
    enabled: !!destToken,
    staleTime: 0,
    cacheTime: 0,
    refetchInterval: 3000,
  });

  const sourceAmount = useMemo(
    () =>
      amount > 0 && sourceData?.data ? amount / sourceData?.data?.unitPrice : 0,
    [amount, sourceData.data]
  );

  const destAmount = useMemo(
    () =>
      amount > 0 && destData?.data ? amount / destData?.data?.unitPrice : 0,
    [amount, destData.data]
  );

  return (
    <div className={styles.page}>
      <div className={styles.tokenList}>
        <h2>Selected Source Token: {sourceToken}</h2>
        {Object.keys(initialTokens).map((token) => (
          <button
            key={token}
            onClick={() => setSourceToken(token)}
            aria-pressed={sourceToken === token}
          >
            {token}
          </button>
        ))}
      </div>

      <div>
        <h2>
          {sourceData.isLoading
            ? "Loading..."
            : `$${amount} USD is ${sourceAmount.toFixed(6)} ${sourceToken}`}
        </h2>
        {sourceData.error && <p>Error loading price</p>}

        <input
          type="number"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          placeholder="Enter USD amount"
          aria-label="USD Amount"
        />
        <h2>Amount: ${amount}</h2>

        <h2>
          Destination Amount:{" "}
          {destData.isLoading ? "Loading..." : destAmount.toFixed(6)}
        </h2>
      </div>

      <div className={styles.tokenList}>
        <h2>Selected Destination Token: {destToken}</h2>
        {Object.keys(initialTokens).map((token) => (
          <button
            key={token}
            onClick={() => setDestToken(token)}
            aria-pressed={destToken === token}
          >
            {token}
          </button>
        ))}

        {destData.error && <p>Error loading price</p>}
      </div>
    </div>
  );
}
