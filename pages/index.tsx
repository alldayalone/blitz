import { useRouter } from "next/router";
import Link from 'next/link';
import splitbee from "@splitbee/web";
import { Layout } from '@/components/Layout';
import Button from "@/components/Button";

const BuilderOnboarding = () => {  
  const router = useRouter();

  return (
    <Layout>
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl mb-5">setup your public roadmap in 5 mins 😏</h1>
        <p className="text-muted">do you have a public github repo? just paste a link!</p>
        <div className="flex flex-col gap-5 mb-12">
          <input className="bg-darkslategray placeholder-[#4c4f6b] py-3 px-4 rounded" type="text" onChange={(e) => {
            const link = e.target.value;
            const repo = link.split('/').slice(-2).join('/');
            splitbee.track('Paste repo', { repo });

            router.push(`/r/${repo}`);
          }} placeholder="https://github.com/theoberton/blitz" />
        </div>
        <p className="text-muted">have a <b>private</b> repo? install the github app and come back</p>
        <div className="mb-12 max-w-[16rem]">
          <Button as="a" href="https://github.com/apps/blitzmap" target="_blank" rel="noopener noreferrer" data-splitbee-event="install app" >install gh app</Button>
        </div>
        
        <p className="text-muted">just chilling? check out blitz roadmap → <Link data-splitbee-event="click roadmap" className='text-blue-600' href="/r/theoberton/blitz">roadmap ( ^ ͜ʖ ^ )</Link></p>
      </div>
    </Layout>
  )
}

export default BuilderOnboarding;
