import { useRouter } from "next/router";
import Link from 'next/link';

// starting page for the builder
// we need to onboard him to quickly setup his roadmap page
// it's either a signin with github or pasting link to repo
// then we need to show him the list of issues
export function BuilderOnboarding() {  
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl">Welcome to the Blitz!</h1>
      <p className="text-lg">Let&apos;s setup your roadmap page.</p>
      <p className="text-lg">We need to know what repository you want to use for your roadmap.</p>
      <p className="text-lg">Paste a link to your repository.</p>
      <div className="flex flex-col gap-5">
        <input type="text" onChange={(e) => {
          const link = e.target.value;
          const repo = link.split('/').slice(-2).join('/');

          router.push(`?repo=${repo}`);
        }} placeholder="Paste a link to your repository" />
      </div>
      <p className="text-lg">You can also check <Link className='text-blue-600' href="/?repo=theoberton/blitz">our roadmap ( ^ ͜ʖ ^ )</Link></p>
    </div>
  )
}