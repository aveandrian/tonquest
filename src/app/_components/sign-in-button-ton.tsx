"use client"
import { getCsrfToken, signIn, useSession } from "next-auth/react"
import { SiweMessage } from "siwe"
import { useAccount, useChainId, useConnect, useSignMessage } from "wagmi"
import { injected } from 'wagmi/connectors'
import { useEffect } from "react"
import { Button } from "flowbite-react"
import { useRouter } from "next/navigation"
import { TonConnectButton, useIsConnectionRestored, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"

export default function SingInButtonTON() {
  // const [tonConnectUI] = useTonConnectUI();
  // const connectionRestored = useIsConnectionRestored();
  // const wallet = useTonWallet();

  // useEffect(() => {
  //   console.log('connectionRestored', connectionRestored)
  //   console.log('wallet', wallet)

  //   if(connectionRestored && wallet) {
  //     console.log('lets refresh payload')
  //     const refreshPayload = async () => {
  //       tonConnectUI.setConnectRequestParameters({ state: 'loading' });

  //       const value = 'my custom payload'//await backendAuth.generatePayload();
  //       if (!value) {
  //           tonConnectUI.setConnectRequestParameters(null);
  //       } else {
  //           tonConnectUI.setConnectRequestParameters({state: 'ready', value});
  //       }
  //     }

  //     void refreshPayload();
  //   }
  // }, [connectionRestored, wallet])

  
  return (
     <TonConnectButton />
  )
}
