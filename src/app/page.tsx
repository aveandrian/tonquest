"use client";

import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const [showPopup, setShowPopup] = useState<boolean>(false);

  function handleClick() {
    if (!session) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } else router.push("quest/first-quest");
  }
  return (
    <main className="container relative flex h-full min-h-[90vh] w-full max-w-[1024px] flex-col items-center justify-center self-center px-6">
      {showPopup && (
        <div className="rounder-md absolute right-5 top-5 flex animate-bounce flex-col items-center justify-center px-3 py-2">
          <FontAwesomeIcon icon={faArrowUp} />
          <p className="text-center">log in first</p>
        </div>
      )}

      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform bg-[url('/bg-main.png')] bg-contain bg-no-repeat sm:h-80 sm:w-80"></div>
      <Button onClick={handleClick} color="primary" className="start-first">
        Start your first quest
      </Button>
    </main>
  );
}
