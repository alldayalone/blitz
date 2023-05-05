import { Layout } from "@/components/Layout";
import { Roadmap } from "@/components/Roadmap";
import { useRouter } from "next/router";
import splitbee from '@splitbee/web';

function RoadmapPage() {
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  if (!router.query.repo || Array.isArray(router.query.repo)) {
    router.push('/');
    return null;
  }

  splitbee.track('repo', { repo: router.query.repo });

  return <Layout><Roadmap repoName={router.query.repo} /></Layout>
}

export default RoadmapPage;