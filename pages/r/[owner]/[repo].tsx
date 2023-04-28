import { Layout } from "@/components/Layout";
import { Roadmap } from "@/components/Roadmap";
import { useRouter } from "next/router";

function RoadmapPage() {
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  return <Layout><Roadmap repoName={router.query.owner + "/" + router.query.repo} /></Layout>
}

export default RoadmapPage;