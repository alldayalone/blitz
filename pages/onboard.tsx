import { Layout } from "@/components/Layout";
import { Button } from "@/components/Button";
import { useRouter } from "next/router";
import splitbee from '@splitbee/web';
import Link from "next/link";

function OnboardPage() {
  const router = useRouter();
  return <Layout>
    <h1 className="text-3xl mt-16 max-xs:mt-0 mb-8">find out what people <span className="bg-red-500"> actually want</span> from your product!</h1>
    <p className="text-muted">launch a public page for your product roadmap in 5 mins ( ^ ͜ʖ ^ )</p>
    <Button  className='w-sm items-center mt-4' onClick={() => router.push("/onboard-1")}>ok, let's do it! →</Button>
  </Layout>
}

export default OnboardPage;