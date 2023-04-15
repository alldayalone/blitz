import { useContext } from 'react'
import { useRouter } from 'next/router';

import { DaoStateDispatchContext, DaoStateProvider } from '@/stores/daoState';
import { IpProvider, useIp } from '@/stores/ip';
import { RepoProvider, useRepo } from '@/stores/repo';
import { IssueList } from '@/components/IssueList';
import { RepoTitle } from '@/components/RepoTitle';
import { BuilderOnboarding } from '@/components/BuilderOnboarding';

function useTonAddress() {
  return useIp();
}

function DevControlPanel() {
  const dispatch = useContext(DaoStateDispatchContext);
  const tonAddress = useTonAddress();

  if (!tonAddress) {
    return null;
  }

  if (location.hostname !== 'localhost') return null;

  return (
    <div className='fixed grid top-5 right-5 gap-3 bg-slate-200 p-5'>
      <div className='w-max'>Dev Control Panel</div>
      <button className='bg-white p-2' onClick={() => dispatch({ type: 'reset' })}>Reset state</button>
      <button className='bg-white p-2' onClick={() => dispatch({ type: 'randomize' })}>Randomize</button>
      <button className='bg-white p-2' onClick={() => dispatch({ type: 'revoke_votes', payload: { from: tonAddress }})}>Revoke votes</button>
    </div>
  )
}

function SetRepo() {
  const router = useRouter()
  function handleSubmit(e: any) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form) as any;
    const formJson = Object.fromEntries(formData.entries())
    router.push(`/?repo=${formJson.repo}`)
  }

  return (
    <form className='flex gap-3 mb-10' method="post" onSubmit={handleSubmit}>
      <input className='bg-white' name="repo" defaultValue='theoberton/blitz' />
      <button className='bg-white p-2 border border-black'>Change repo</button>
    </form>
  )
}

export default function Home() {  
  return (
    <RepoProvider>
      <IpProvider>
          <main className='w-[42rem] mx-auto mt-10'>
            <Main />
          </main>
          <DevControlPanel />
      </IpProvider>
    </RepoProvider>
  )
}

function Main() {
  const repo = useRepo();
 
  if (!repo) {
    return <BuilderOnboarding />;
  }

  return (
    <DaoStateProvider repo={repo}>
      <RepoTitle />
      <IssueList />
    </DaoStateProvider>
  );
}

