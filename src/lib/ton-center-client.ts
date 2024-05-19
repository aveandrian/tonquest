"use server";
import { TonClient } from "@ton/ton";
import { env } from "@/env";
import {
  Address,
  beginCell,
  toNano,
  Cell,
  type Transaction,
  storeMessage,
} from "@ton/ton";
import { CHAIN } from "@tonconnect/sdk";
import axios from "axios";

const client = new TonClient({
  endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
  apiKey: env.TON_CENTER_KEY, // https://t.me/tonapibot
});

export async function retry<T>(
  fn: () => Promise<T>,
  options: { retries: number; delay: number },
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < options.retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (e instanceof Error) {
        lastError = e;
      }
      await new Promise((resolve) => setTimeout(resolve, options.delay));
    }
  }
  throw lastError;
}

export async function getTxByBOC(
  exBoc: string,
  address: string,
): Promise<string> {
  const myAddress = Address.parse(address); // Address to fetch transactions from

  return retry(
    async () => {
      const transactions: Transaction[] = await client.getTransactions(
        myAddress,
        {
          limit: 5,
        },
      );
      for (const tx of transactions) {
        const inMsg = tx.inMessage;
        if (inMsg?.info.type === "external-in") {
          const inBOC = inMsg?.body;
          if (typeof inBOC === "undefined") {
            new Error("Invalid external");
            continue;
          }
          const extHash = Cell.fromBase64(exBoc).hash().toString("hex");
          const myStoreMessage = storeMessage(inMsg);
          const inHash = beginCell()
            .store(myStoreMessage)
            .endCell()
            .hash()
            .toString("hex");

          //   console.log(" hash BOC", extHash);
          //   console.log("inMsg hash", inHash);
          //   console.log("checking the tx", tx, tx.hash().toString("hex"));

          // Assuming `inBOC.hash()` is synchronous and returns a hash object with a `toString` method
          if (extHash === inHash) {
            // console.log("Tx match");
            const txHash = tx.hash().toString("hex");
            // console.log(`Transaction Hash: ${txHash}`);
            // console.log(`Transaction LT: ${tx.lt}`);
            return txHash;
          }
        }
      }
      throw new Error("Transaction not found");
    },
    { retries: 30, delay: 1000 },
  );
}

export async function createMintTransactionPayload(token: string) {
  const body = beginCell()
    .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
    .storeStringTail(token) // write our text comment
    .endCell();
  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    network: CHAIN.TESTNET,
    messages: [
      {
        address: Address.parse(env.COLLECTION_OWNER).toRawString(),
        amount: toNano("0.06").toString(),
        payload: body.toBoc().toString("base64"), // payload with comment in body
      },
    ],
  };
  return transaction;
}

export const restTonCenterClientV3 = axios.create({
  baseURL: "https://testnet.toncenter.com/api/v3",
  headers: {
    "X-API-Key": env.TON_CENTER_KEY,
  },
});

export const restTonCenterClientV2 = axios.create({
  baseURL: "https://testnet.toncenter.com/api/v2",
  headers: {
    "X-API-Key": env.TON_CENTER_KEY,
  },
});
