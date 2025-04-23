"use client";
import React, { useState, useMemo } from "react";
import styles from "./HomeClient.module.css";
import { useDebounce } from "../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { getAssetPriceInfo } from "@funkit/api-base";
import { HomeClientProps } from "../../types";

interface AssetPriceInfo {
  unitPrice: number;
}

export default function HomeClient({ initialTokens }: HomeClientProps) {
  const [inputAmount, setInputAmount] = useState("");
  const debouncedAmount = useDebounce(inputAmount, 200);
  const amount = useMemo(() => {
    const num = parseFloat(debouncedAmount);
    return isNaN(num) ? 0 : num;
  }, [debouncedAmount]);

  const [sourceToken, setSourceToken] = useState("");
  const [destToken, setDestToken] = useState("");

  const sourceData = useQuery<AssetPriceInfo>({
    queryKey: ["price", sourceToken],
    queryFn: () =>
      getAssetPriceInfo({
        chainId: initialTokens[sourceToken].chainId,
        assetTokenAddress: initialTokens[sourceToken].address,
        apiKey: process.env.NEXT_PUBLIC_FUNKIT_API_KEY || "",
      }),
    enabled: !!sourceToken,
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 3000,
  });

  const destData = useQuery<AssetPriceInfo>({
    queryKey: ["price", destToken],
    queryFn: () =>
      getAssetPriceInfo({
        chainId: initialTokens[destToken].chainId,
        assetTokenAddress: initialTokens[destToken].address,
        apiKey: process.env.NEXT_PUBLIC_FUNKIT_API_KEY || "",
      }),
    enabled: !!destToken,
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 3000,
  });

  const sourceAmount = useMemo(
    () =>
      amount > 0 && sourceData?.data ? amount / sourceData.data.unitPrice : 0,
    [amount, sourceData.data]
  );

  const destAmount = useMemo(
    () => (amount > 0 && destData?.data ? amount / destData.data.unitPrice : 0),
    [amount, destData.data]
  );

  return (
    <div className={styles.page}>
      <div className={styles.tokenList}>
        <h2>Selected Source Token: {sourceToken}</h2>
        {Object.keys(initialTokens).map((token) => (
          <div
            key={token}
            className={`${styles.token} ${
              sourceToken === token ? styles.active : ""
            }`}
            onClick={() => setSourceToken(token)}
            aria-pressed={sourceToken === token}
          >
            {token}
          </div>
        ))}
      </div>

      <div className={styles.resultPanel}>
        <h2>Amount: ${amount}</h2>
        <input
          type="number"
          value={inputAmount}
          onChange={(e) => {
            const val = e.target.value;
            // limiting numbers here to 9999999
            if (val === "" || Number(val) <= 9999999) {
              setInputAmount(val);
            }
          }}
          placeholder="Enter USD amount"
          aria-label="USD Amount"
          className={styles.amountInput}
        />

        <div className={`${styles.token} ${styles.active}`}>
          {" "}
          {sourceData.isLoading ? (
            "Loading..."
          ) : (
            <span>
              {sourceAmount.toFixed(4)} {sourceToken}
            </span>
          )}
        </div>
        {sourceData.error && <p>Error loading price</p>}

        <div className={`${styles.token} ${styles.active}`}>
          {" "}
          {destData.isLoading ? (
            "Loading..."
          ) : (
            <span>
              {destAmount.toFixed(4)} {destToken}
            </span>
          )}
        </div>
        {sourceData.error && <p>Error loading price</p>}
      </div>

      <div className={styles.tokenList}>
        <h2>Selected Destination Token: {destToken}</h2>
        {Object.keys(initialTokens).map((token) => (
          <div
            key={token}
            onClick={() => setDestToken(token)}
            aria-pressed={destToken === token}
            className={`${styles.token} ${
              destToken === token ? styles.active : ""
            }`}
          >
            {token}
          </div>
        ))}

        {destData.error && <p>Error loading price</p>}
      </div>
    </div>
  );
}
