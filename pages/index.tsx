import { useRouter } from "next/router";
import Link from 'next/link';
import splitbee from "@splitbee/web";
import { Layout } from '@/components/Layout';
import { Button } from "@/components/Button";
import pashaPhoto from '@/public/pasha_photo.png';
import Image from "next/image";

const BuilderOnboarding = () => {  
  const router = useRouter();

  return (
    <Layout>
      <div className="flex flex-col gap-5 relative">
        <h1 className="text-3xl mt-16 max-xs:mt-0 mb-5">setup your public roadmap in 5 mins 😏</h1>
        <p className="text-muted">do you have a public github repo? just paste a link!</p>
        <div className="flex flex-col gap-5 mb-12 max-w-[28rem]">
          <input className="bg-darkslategray placeholder-[#4c4f6b] py-3 px-4 rounded" type="text" onChange={(e) => {
            const link = e.target.value;
            const repo = link.split('/').slice(-2).join('/');
            splitbee.track('Paste repo', { repo });

            router.push(`/r?repo=${repo}`);
          }} placeholder="https://github.com/theoberton/blitz" />
        </div>
        <p className="text-muted">have a <b>private</b> repo? install the github app and come back</p>
        <div className="mb-12 max-w-[16rem]">
          <Button as="a" href="https://github.com/apps/blitzmap" target="_blank" rel="noopener noreferrer" data-splitbee-event="install app" >install gh app</Button>
        </div>
        
        <p className="text-muted mb-12">just chilling? check out blitz roadmap → <Link data-splitbee-event="click roadmap" className='text-blue-600' href="/r?repo=theoberton/blitz">roadmap ( ^ ͜ʖ ^ )</Link></p>

        <a href="https://youtu.be/StHVi2jFzlI" target="_blank" className="w-[150px] hover:scale-105 transition absolute bottom-[-120px] left-1/2 translate-x-[-75px] sm:bottom-0 sm:left-full sm:translate-x-[-150px]" >
          <Image width="150" src={pashaPhoto} alt="author photo" />
        </a>
      </div>
    </Layout>
  )
}

export default BuilderOnboarding;
