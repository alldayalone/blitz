import { createContext, useContext, useEffect, useState } from 'react'
// import { TonConnectButton, TonConnectUIProvider, useTonAddress } from '@tonconnect/ui-react'
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types'
import octokit from '@/utils/octokit'
import { insertVote, getVotes } from '@/utils/mongoClient';

import { DaoStateDispatchContext, DaoStateContext, DaoStateProvider } from '@/stores/daoState';
import styles from './page.module.css'

const ipContext = createContext<string | undefined>(undefined);

function useTonAddress() {
  return useContext(ipContext);
}

function useAsyncState<T>(fn: () => Promise<T>) {
  const [state, setState] = useState<T>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const asyncSetState = useEffect(() => {
    async function main() {
      try {
        setState(await fn())
      } catch (error) {
        if (error instanceof Error) {
          setError(error)
        } else {
          setError(new Error('Something went wrong'))
        }
      } finally {
        setLoading(false)
      }
    }

    main();
  }, [fn])

  return [state, asyncSetState, loading, error] as const
}






function DevControlPanel() {
  const dispatch = useContext(DaoStateDispatchContext);
  const tonAddress = useTonAddress();

  if (!tonAddress) {
    return null;
  }

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

  const [ip, setIp] = useState<string>();
  
  useEffect(() => {
    (async () => {
      fetch('https://ipapi.co/json/').then(res => res.json()).then(data => {
        console.log(data);
        setIp(data.ip);
      });
    })();
  }, []);



  const [issues, setState, loading, error] = useAsyncState(async () => {
    // get open issues from https://github.com/theoberton/3.14xl
    const { data } = await octokit.rest.issues.listForRepo({
      owner: 'theoberton',
      repo: 'github-dao',
      state: 'open',
    });

    return data;  
  });

  if (!issues || loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error.message}</p>
  }

  return (
      // <TonConnectUIProvider manifestUrl="https://pi.oberton.io/tonconnect-manifest.json">
    <ipContext.Provider value={ip}>
        <DaoStateProvider>
          <main className={styles.main}>
            {/* <TonConnectButton className='mb-10'/> */}

          
            <div className='flex flex-col gap-5'>
              {issues.map((issue) => <Issue key={issue.id} issue={issue} />)}
            </div>
          </main>
        <DevControlPanel />
       </DaoStateProvider>
      </ipContext.Provider>
      // </TonConnectUIProvider >

  )
}

function Issue({ issue }: {
  issue: GetResponseDataTypeFromEndpointMethod<typeof octokit.rest.issues.listForRepo>[number],
}) {
  const daoState = useContext(DaoStateContext);
  const dispatch = useContext(DaoStateDispatchContext);
  const tonAddress = useTonAddress();
  const proposal = daoState.proposals.find((proposal) => proposal.number === issue.number);
  const isProposal = Boolean(proposal);
  const isAuth = Boolean(tonAddress);

  const voteTransaction = proposal?.transactions.find((transaction) => transaction.from === tonAddress);
  const isVoted = Boolean(voteTransaction);

  const yesVotes = proposal?.transactions.filter((transaction) => transaction.comment === 'yes').length;
  const noVotes = proposal?.transactions.filter((transaction) => transaction.comment === 'no').length;

  const issueBg = (() => {
    if (yesVotes === undefined || noVotes === undefined) return '';
    if (yesVotes === noVotes) return 'bg-white';
    if (yesVotes > noVotes) return 'bg-green-200';
    if (noVotes > yesVotes) return 'bg-red-200';
  })();

  const yesBg = (() => {
    if (voteTransaction?.comment === 'yes') return 'bg-green-700';
    if (voteTransaction?.comment === 'no') return 'bg-gray-200';
    return 'bg-green-400';
  })();

  const noBg = (() => {
    if (voteTransaction?.comment === 'yes') return 'bg-gray-200';
    if (voteTransaction?.comment === 'no') return 'bg-red-700';
    return 'bg-red-400';
  })();

  return (
    <div className={`flex justify-between border border-black px-2 py-1 ${issueBg}`}>
    <h3>#{issue.number} {issue.title}</h3>
    <div className='flex gap-3'>
      {isAuth && !isProposal && <button className='bg-blue-400' onClick={() => dispatch({
        type: 'turn_into_proposal',
        payload: {
          number: issue.number
        }
      })}>Turn into proposal</button>}
      {isProposal && tonAddress && <button disabled={!isAuth || isVoted} className={yesBg} onClick={() => {
        dispatch({
          type: 'vote',
          payload: {
            number: issue.number,
            from: tonAddress,
            comment: 'yes'
          }
        });
        insertVote({
          number: issue.number,
          from: tonAddress,
          comment: 'yes'
        })
      }}>{yesVotes} Yes</button>}
      {isProposal && tonAddress && <button disabled={!isAuth || isVoted} className={noBg} onClick={() => {
        dispatch({
          type: 'vote',
          payload: {
            number: issue.number,
            from: tonAddress,
            comment: 'no'
          }
        });
        insertVote({
          number: issue.number,
          from: tonAddress,
          comment: 'no'
        })
      }}>{noVotes} No</button>}
    </div>
  </div>
  )
}
