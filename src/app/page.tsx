
import Link from "next/link";
import { Button } from "@/components/ui/button"
import Container from "@/components/Container";

export default function Home() {
  return (
      <main className="text-center">
        <Container className="flex flex-col justify-center h-full gap-6">
        <h1 className="text-5xl font-bold">ZenInvoice</h1>
        <p>

          <Button asChild>
          <Link href="/dashboard">
            LogIn
          </Link>
          </Button>
        </p>
        </Container>
      </main>
 
  );
}
