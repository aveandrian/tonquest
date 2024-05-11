"use client";

import { Button, Image } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const router = useRouter();
  const { data: session, update } = useSession();

  // useEffect(() => {
  //   async function updateCurrentSession() {
  //     await signOut();
  //     // await update();
  //   }
  //   if (session) void updateCurrentSession();
  // }, [session]);

  const [showPopup, setShowPopup] = useState<boolean>(false);

  function handleClick() {
    if (!session) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } else router.push("quest/first-quest");
  }
  return (
    <main className="relative h-full">
      {showPopup && (
        <div className="rounder-md absolute right-5 top-20 flex animate-bounce flex-col items-center justify-center px-3 py-2">
          <FontAwesomeIcon icon={faArrowUp} />
          <p>log in first</p>
        </div>
      )}

      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform bg-[url('/bg-main.png')] bg-contain bg-no-repeat"></div>
      <div className="flex h-full w-full flex-col items-center justify-center ">
        <Button onClick={handleClick} color="primary" className="start-first">
          Start your first quest
        </Button>
      </div>
    </main>
  );
}
