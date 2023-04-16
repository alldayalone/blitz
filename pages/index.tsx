import { useContext } from 'react'
import { useRouter } from 'next/router';

import { DaoStateDispatchContext, DaoStateProvider } from '@/stores/daoState';
import { IpProvider, useIp } from '@/stores/ip';
import { RepoProvider, useRepo } from '@/stores/repo';
import { IssueList } from '@/components/IssueList';
import { RepoTitle } from '@/components/RepoTitle';
import { BuilderOnboarding } from '@/components/BuilderOnboarding';
import { isLocalhost } from '@/utils/isLocalhost';

function useTonAddress() {
  return useIp();
}

function DevControlPanel() {
  const dispatch = useContext(DaoStateDispatchContext);
  const tonAddress = useTonAddress();

  if (!tonAddress) return null;
  if (!isLocalhost()) return null;

  return (
    <div className='fixed grid top-5 right-5 gap-3 bg-slate-200 p-5'>
      <div className='w-max'>Dev Control Panel</div>
      <button className='bg-white p-2' onClick={() => dispatch({ type: 'reset' })}>Reset state</button>
      <button className='bg-white p-2' onClick={() => dispatch({ type: 'randomize' })}>Randomize</button>
      <button className='bg-white p-2' onClick={() => dispatch({ type: 'revoke_votes', payload: { from: tonAddress }})}>Revoke votes</button>
    </div>
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

