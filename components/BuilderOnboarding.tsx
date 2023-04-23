import { useRouter } from "next/router";
import Link from 'next/link';
import splitbee from "@splitbee/web";

// starting page for the builder
// we need to onboard him to quickly setup his roadmap page
// it's either a signin with github or pasting link to repo
// then we need to show him the list of issues
export function BuilderOnboarding() {  
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl">Welcome to the Blitz!</h1>
      <p className="text-muted">Let&apos;s setup your roadmap page. You need a public GitHub repo with some open issues</p>
      <p className="text-muted">Paste a link to your GitHub repository.</p>
      <div className="flex flex-col gap-5">
        <input className="bg-darkslategray placeholder-[#4c4f6b] py-3 px-4 rounded" type="text" onChange={(e) => {
          const link = e.target.value;
          const repo = link.split('/').slice(-2).join('/');
          splitbee.track('Paste repo', { repo });


          router.push(`?repo=${repo}`);
        }} placeholder="https://github.com/theoberton/blitz" />
      </div>
      <p className="text-lg">You can also check <Link data-splitbee-event="click roadmap" className='text-blue-600' href="/?repo=theoberton/blitz">our roadmap ( ^ ͜ʖ ^ )</Link></p>
    </div>
  )
}