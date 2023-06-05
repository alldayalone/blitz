import { Layout } from "@/components/Layout";
import { Roadmap } from "@/components/Roadmap";
import { useRouter } from "next/router";
import splitbee from '@splitbee/web';
import Link from "next/link";
import { Button } from "@/components/Button";
import { useState } from "react";

function OnboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return <Layout>
    <h1 className="text-3xl mt-16 max-xs:mt-0 mb-8">what&apos;s the next feature you&apos;re building?</h1>

    <form onSubmit={async (e) => {
      setIsLoading(true);
      e.preventDefault();
      const form = new FormData(e.currentTarget)
      const firstFeature = form.get('firstFeature') as string;
      localStorage.setItem("firstFeature", firstFeature);
      splitbee.track("onboard: launch roadmap", { firstFeature });
      const project = await fetch('/api/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstFeature: form.get('firstFeature'),
          name: localStorage.getItem("productName"),
          description: localStorage.getItem("productDescription")
        })
      }).then(res => res.json())
      router.push('/author/' + project.handle);
    }}>
      <input placeholder="custom colors!" autoFocus className="mb-5 w-56 bg-transparent border-b-2 px-2" name="firstFeature" />
      {isLoading ? <Button type="submit"><div className="animate-spin text-white rounded-full h-4 w-4 border-b-2 border-white"></div></Button> : <Button type="submit">Launch roadmap</Button>}
    </form>
  </Layout>
}

export default OnboardPage;