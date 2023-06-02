import { Layout } from "@/components/Layout";
import { Roadmap } from "@/components/Roadmap";
import { useRouter } from "next/router";
import splitbee from '@splitbee/web';
import Link from "next/link";
import { Button } from "@/components/Button";

function OnboardPage() {
  const router = useRouter();

  return <Layout>
    <h1 className="text-3xl mt-16 max-xs:mt-0 mb-8">what&apos;s the next feature you're building?</h1>

    <form onSubmit={(e) => {
      e.preventDefault();
      const form = new FormData(e.currentTarget)
      localStorage.setItem("firstFeature", form.get('firstFeature') as string);
      router.push('/author');
    }}>
      <input autoFocus className="mb-5 w-56 bg-transparent border-b-2 px-2" name="firstFeature" />
      <Button type="submit">Next</Button>
    </form>
  </Layout>
}

export default OnboardPage;