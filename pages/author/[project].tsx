import { Layout } from "@/components/Layout";
import { Roadmap } from "@/components/Roadmap";
import { useRouter } from "next/router";
import splitbee from '@splitbee/web';
import Link from "next/link";
import React from "react";
import Image from "next/image";
import pashaPhoto from '@/public/pasha_photo.png';
import { Prism } from '@mantine/prism';
import { MantineProvider } from "@mantine/core";
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
  const router = useRouter();
  const [productName, setProductName] = useLocalHost('productName', '');
  const [firstFeature, setFirstFeature] = useLocalHost('firstFeature', '');
  const [isLoading, setIsLoading] = React.useState(true);

  const demoCode = `
    <div style={{position: "relative", paddingBottom: "62.5%", height: 0}}>
  <iframe src="https://blitz.vote/${router.query.project}"
    style={{ position: "absolute", top: 0, left: 0, width: '100%', height: '100%'}}>
  </iframe>
</div>
  `

  return (
    <div className="h-screen p-10 flex gap-8">
      <div className="flex-1 mb-10 border p-2 border-slate-400 rounded-xl">
        <div className="flex border-b-slate-400 items-center">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-slate-400 opacity-40" />
            <div className="w-3 h-3 rounded-full bg-slate-400 opacity-40" />
            <div className="w-3 h-3 rounded-full bg-slate-400 opacity-40" />
          </div>
          <div className="flex-1 text-center">
          <a className="text-slate-400 hover:underline" href={`https://blitz.vote/${router.query.project}`} target="_blank">https://blitz.vote/{router.query.project}</a>
          </div>
        </div>
        {isLoading &&
          <div className="left-[calc(50%-4rem)] flex justify-center items-center h-full">
           <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-slate-400" />
          </div>
        }
        <div style={{position: "relative", paddingBottom: "62.5%", height: "600px" }}>
          <iframe src={`https://blitz.vote/${router.query.project}`} onLoad={() => setIsLoading(false)}
            style={{ display: isLoading ? 'none': 'block', position: "absolute", top: 0, left: 0, width: "100%", height: '100%'}}>
          </iframe>
        </div>
      </div>

      <div className="w-1/2">
        <h1 className="text-3xl text-white mb-10">your roadmap page is live 🚀</h1>
        
        <p className="mb-3">what&apos;s next?</p>  
        <p><input type="checkbox" /> add more features to the roadmap using <strong>request feature</strong> button</p>
        <p><input type="checkbox" /> leave a link to the roadmap somewhere in your app or socials</p>
        <p><input type="checkbox" /> say hi to me on <a className="text-blue-400 underline" target="_blank" href="https://twitter.com/alldayalone">twitter ➡️</a> 😊</p>

        <h2 className="text-lg mt-32">Embed in your app!</h2>
        <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'dark',
        }}
      >
        <Prism language="tsx">{demoCode}</Prism>
        </MantineProvider>
      </div>
    </div>
  );
}

export default RoadmapPage;
