"use client";
import { Button, Link } from "@nextui-org/react";
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
    <>
      {showPopup && (
        <div className="rounder-md absolute right-5 top-20 flex animate-bounce flex-col items-center justify-center px-3 py-2">
          <FontAwesomeIcon icon={faArrowUp} />
          <p>log in first</p>
        </div>
      )}
      <main className="flex min-h-full flex-col items-center">
        <div className="flex flex-col items-center justify-center gap-12 border border-black  px-4 py-16">
          <Button onClick={handleClick} color="primary">
            Start your first quest
          </Button>
        </div>
      </main>
    </>
  );
}
