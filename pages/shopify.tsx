import { useEffect, useState } from 'react';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider, Page} from '@shopify/polaris';
import { ShopifyRoadmap } from "@theoberton/blitz-shopify";
// import { useBlitzId } from "@/stores/blitzId";
import { useRouter } from "next/router";
import '@shopify/polaris/build/esm/styles.css';


function RoadmapPage() {
  const [repo, setRepo] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    if (  router.isReady) {
      const repoName = (!router.query.repo || Array.isArray(router.query.repo))
        ? "theoberton/blitz"
        : router.query.repo;

      setRepo(repoName);
    }
  }, [router, setRepo]);

  if (!repo) {
    return null;
  }

  return (
    <AppProvider i18n={enTranslations}>
      <Page title="Shopify styling">
        <ShopifyRoadmap repoName={repo} />
      </Page>
    </AppProvider>
  )
}

export default RoadmapPage;