"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";

import { useTonAddress } from "@tonconnect/ui-react";
import { useSession } from "next-auth/react";
import {
  faImage,
  faLink,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";

export function UserInfo() {
  const { data: session } = useSession();

  const address = useTonAddress();

  return (
    <>
      <div className="flex flex-col flex-wrap gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <h1>Your wallet:</h1>
          <h1 className="sm:text-sm">{address}</h1>
        </div>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faTwitter} />
          <h1>{session?.user.twitter ?? "Connect Twitter first"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faDiscord} />
          <h1>{session?.user.twitter ?? "Connect Discord first"}</h1>
        </div>
      </div>
      <div className="flex flex-col flex-wrap gap-5">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faNoteSticky} />
          <h1>100 Quests</h1>
        </div>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faLink} />
          <h1>150 Transactions</h1>
        </div>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faImage} />
          <h1>3 NFTs</h1>
        </div>
      </div>
    </>
  );
}
