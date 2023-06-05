import { Layout } from "@/components/Layout";
import { Roadmap } from "@/components/Roadmap";
import { Button } from '@/components/Button';
import { useRouter } from "next/router";
import splitbee from '@splitbee/web';
import Link from "next/link";

function OnboardPage() {
  const router= useRouter();
  return <Layout>
    <h1 className="text-3xl mt-16 max-xs:mt-0 mb-8">describe it in one line</h1>
    <form onSubmit={(e) => {
      e.preventDefault();
      const form = new FormData(e.currentTarget)
      const productDescription = form.get('productDescription') as string;
      splitbee.track("onboard: product description", { productDescription });
      localStorage.setItem("productDescription", productDescription);
      router.push('/onboard-3');
    }}>
      <textarea placeholder="a tool to run community-driven products" autoFocus className="mb-5 w-full bg-transparent border-b-2 px-2" name="productDescription" />
      <Button type="submit">Next</Button>
    </form>
  </Layout>
}

export default OnboardPage;