import { Layout } from "@/components/Layout";
import { Roadmap } from "@/components/Roadmap";
import { useRouter } from "next/router";
import splitbee from '@splitbee/web';
import Link from "next/link";
import React from "react";
import Image from "next/image";
import pashaPhoto from '@/public/pasha_photo.png';

function useLocalHost(key: string, defaultValue: string) {
  const [value, setValue] = React.useState<string>(defaultValue);
  
  React.useEffect(() => {
    const item = localStorage?.getItem(key) ?? defaultValue;

    setValue(item);
  }, [key, defaultValue]);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (value) {
      localStorage?.setItem(key, value)
    }
  }, [key, value]);

  return [value, setValue] as const;
}
    

function RoadmapPage() {
  const [productName, setProductName] = useLocalHost('productName', '');
  const [firstFeature, setFirstFeature] = useLocalHost('firstFeature', '');

  return (
    <div className="h-screen p-10">
      <h1 className="text-3xl mb-10">Your product page is live 🚀 <p>→ <Link data-splitbee-event="click roadmap" target="_blank" className='text-blue-400' href="/r?repo=theoberton/broh">https://blitz.vote/{productName}</Link> ←</p></h1>
      
      <p className="mb-10">what&apos;s next?</p>  
      <p><input type="checkbox" /> add more features to the roadmap using <strong>propose</strong> button</p>
      <p><input type="checkbox" /> drop the link in your socials or somewhere in the app</p>
     <div className="max-w-3xl">

      <Roadmap repoName="random" />
     </div>
    </div>
  );
}

export default RoadmapPage;
