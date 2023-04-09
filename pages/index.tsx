import { useEffect, useReducer, useState } from 'react'
import { TonConnectButton, TonConnectUIProvider } from '@tonconnect/ui-react'
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types'
import octokit from '@/utils/octokit'
import styles from './page.module.css'

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

interface DaoState {
  proposals: {
    number: number
    transactions: {
      from: string
      comment: 'yes' | 'no'
    }[]
  }[]
}

interface TurnIntoProposalAction {
  type: 'turn_into_proposal'
  payload: {
    number: number
  }
}

interface VoteAction {
  type: 'vote'
  payload: {
    number: number
    from: string
    comment: 'yes' | 'no'
  }
}

type DaoAction = TurnIntoProposalAction | VoteAction;

const initialState: DaoState = {
  proposals: []
}

function reducer(state: DaoState, action: DaoAction): DaoState {
  switch (action.type) {
    case 'turn_into_proposal': {
      return {
        ...state,
        proposals: [
          ...state.proposals,
          { number: action.payload.number, transactions: [] }
        ]
      }

    }
    case 'vote': {
      return {
        ...state,
        proposals: state.proposals.map((proposal) => {
          if (proposal.number === action.payload.number) {
            return {
              ...proposal,
              transactions: [
                ...proposal.transactions,
                {
                  from: action.payload.from,
                  comment: action.payload.comment
                }
              ]
            }
          }

          return proposal;
        })
      }
    }
  }
}

const initializer = () => (typeof window !== "undefined" && JSON.parse(localStorage.getItem('dao-state') ?? 'null')) || initialState;

export default function Home() {
  const [daoState, dispatch] = useReducer(reducer, initialState, initializer);

  useEffect(() => {
    localStorage.setItem('dao-state', JSON.stringify(daoState));
  }, [daoState]);


  const [issues, setState, loading, error] = useAsyncState(async () => {
    // get open issues from https://github.com/theoberton/3.14xl
    const { data } = await octokit.rest.issues.listForRepo({
      owner: 'theoberton',
      repo: '3.14xl',
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
      <TonConnectUIProvider manifestUrl="https://pi.oberton.io/tonconnect-manifest.json">
        <main className={styles.main}>
          <TonConnectButton className='mb-10'/>
          
          <div className='flex flex-col gap-5'>
            {issues.map((issue) => <Issue key={issue.id} issue={issue} daoState={daoState} dispatch={dispatch} />)}
          </div>
        </main>
      </TonConnectUIProvider >

  )
}

function Issue({ issue, daoState, dispatch }: {
  issue: GetResponseDataTypeFromEndpointMethod<typeof octokit.rest.issues.listForRepo>[number],
  daoState: DaoState,
  dispatch: React.Dispatch<DaoAction>
}) {
  const isProposal = daoState.proposals.find((proposal) => proposal.number === issue.number);
  const yesVotes = isProposal && isProposal.transactions.filter((transaction) => transaction.comment === 'yes').length;
  const noVotes = isProposal && isProposal.transactions.filter((transaction) => transaction.comment === 'no').length;

  const issueBg = (() => {
    if (yesVotes === undefined || noVotes === undefined) return '';
    if (yesVotes === noVotes) return 'bg-white';
    if (yesVotes > noVotes) return 'bg-green-200';
    if (noVotes > yesVotes) return 'bg-red-200';
  })();

  return (
    <div className={`flex justify-between border border-black px-2 py-1 ${issueBg}`}>
    <h3>#{issue.number} {issue.title}</h3>
    <div className='flex gap-3'>
      {!isProposal && <button className='bg-blue-400' onClick={() => dispatch({
        type: 'turn_into_proposal',
        payload: {
          number: issue.number
        }
      })}>Turn into proposal</button>}
      {isProposal && <button className='bg-green-400' onClick={() => dispatch({
        type: 'vote',
        payload: {
          number: issue.number,
          from: '0:123',
          comment: 'yes'
        }
      })}>{yesVotes} Yes</button>}
      {isProposal && <button className='bg-red-400' onClick={() => dispatch({
        type: 'vote',
        payload: {
          number: issue.number,
          from: '0:123',
          comment: 'no'
        }
      })}>{noVotes} No</button>}
    </div>
  </div>
  )
}
