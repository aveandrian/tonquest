import { Button, Link } from "@nextui-org/react";

export default async function Home() {
  return (
    <main className="flex min-h-full flex-col items-center">
      <div className="flex flex-col items-center justify-center gap-12 border border-black  px-4 py-16">
        <Button as={Link} href="quest/first-quest">
          Start your first quest
        </Button>
      </div>
    </main>
  );
}
