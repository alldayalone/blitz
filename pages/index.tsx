import { useContext } from 'react'

import { DaoStateDispatchContext, DaoStateProvider } from '@/stores/daoState';
import { IpProvider, useIp } from '@/stores/ip';
import { useRepo } from '@/stores/repo';
import { IssueList } from '@/components/IssueList';
import { RepoTitle } from '@/components/RepoTitle';
import { BuilderOnboarding } from '@/components/BuilderOnboarding';
import { isLocalhost } from '@/utils/isLocalhost';
import Button from '@/components/Button';

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
      <Button onClick={() => dispatch({ type: 'reset' })}>reset state</Button>
      <Button onClick={() => dispatch({ type: 'randomize' })}>randomize</Button>
      <Button onClick={() => dispatch({ type: 'revoke_votes', payload: { from: tonAddress }})}>revoke votes</Button>
    </div>
  )
}

export default function Home() {  
  return (
    <IpProvider>
        <main className='w-[42rem] mx-auto mt-10'>
          <Main />
        </main>
        {/* <DevControlPanel /> */}
    </IpProvider>
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

