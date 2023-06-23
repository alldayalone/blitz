import { Layout } from "@/components/Layout";
import { Button } from "@/components/Button";
import { useRouter } from "next/router";
import splitbee from '@splitbee/web';
import Link from "next/link";

import pashaPhoto from '@/public/pasha_photo.png';
import Image from "next/image";
import { useState } from "react";

function OnboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  return <div className="w-screen h-screen max-md:px-4 md:px-10 max-md:pt-8 md:pt-20">
    <div className="flex max-md:flex-col-reverse gap-16">
      <div className="max-lg:w-full lg:w-1/2 h-[40rem] mb-10 border p-2 border-slate-400 rounded-xl relative">
        <div className="flex border-b-slate-400 items-center">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-slate-400 opacity-40" />
            <div className="w-3 h-3 rounded-full bg-slate-400 opacity-40" />
            <div className="w-3 h-3 rounded-full bg-slate-400 opacity-40" />
          </div>
          <div className="flex-1 text-center">
            <a className="text-slate-400 hover:underline" href="https://blitz.vote/blitz" target="_blank">https://blitz.vote/blitz</a>
          </div>
        </div>
        {/* spinner */}
        {isLoading &&
          <div className="left-[calc(50%-4rem)] flex justify-center items-center h-full">
           <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-slate-400" />
          </div>
        }
        <div style={{position: "relative", paddingBottom: "62.5%", height: "600px"}}>
          <iframe src={`https://blitz.vote/blitz`} onLoad={() => setIsLoading(false)}
            style={{ display: isLoading ? 'none': 'block', position: "absolute", top: 0, left: 0, width: '100%', height: '100%'}} className="bg-transparent">
          </iframe>
        </div>
      </div>
      <div className="relative flex flex-col">
        <h1 className="text-3xl mt-16 max-xs:mt-0 mb-8">find out what people <span className="bg-red-500"> actually want</span> from your product!</h1>
        <p className="text-muted text-xl mb-10">launch a public page for your product roadmap in 5 mins ( ^ ͜ʖ ^ )</p>
        <Button size="large" data-splitbee-event="onboard: product name" className='w-sm items-center mt-4' onClick={() => router.push("/onboard-1")}>ok, let&apos;s do it! →</Button>
        <a data-splitbee-event="demo" href="https://youtu.be/StHVi2jFzlI" target="_blank" className="w-[150px] mt-5 hover:scale-105 transition self-center" >
          <Image width="150" src={pashaPhoto} alt="author photo" />
        </a>
      </div>
    </div>
   
  </div>
}

export default OnboardPage;