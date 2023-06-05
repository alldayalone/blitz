import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
// import { NapkinVoteProvider, LocalStorageProvider, VoidProvider, Vote } from './vote-provider';
export interface Vote {
  number: number;
  comment: 'yes' | 'no' | 'none';
  from: string;
}

export abstract class VoteProvider {
  constructor(readonly repo: string) {}
  abstract insertVote(vote: Vote): Promise<void>;
  abstract getVotes(): Promise<Vote[]>;
}

function isLocalhost() {
  return window.location.hostname === 'localhost';
}

export interface DaoState {
  proposals: {
    number: number
    transactions: {
      from: string
      comment: Vote['comment']
    }[]
  }[]
}

type Action<T extends string, P = void> = P extends void
  ? { type: T }
  : { type: T; payload: P }

type VoteAction = Action<'vote', { number: number, from: string, comment: Vote['comment'] }>
type ResetAction = Action<'reset'>
type RevokeVotesAction = Action<'revoke_votes', { from: string }>
type RandomizeAction = Action<'randomize'>
export type DaoAction = VoteAction | ResetAction | RandomizeAction | RevokeVotesAction;

export const initialState: DaoState = {
  proposals: []
}

function reducer(state: DaoState, action: DaoAction): DaoState {
  switch (action.type) {
    case 'vote': {
      const proposals = [...state.proposals];

      if (!proposals.find((proposal) => proposal.number === action.payload.number)) {
        proposals.push({
          number: action.payload.number,
          transactions: []
        });
      }

      return {
        ...state,
        proposals: proposals.map((proposal) => {
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
    // For development purposes only
    case 'randomize': {
      return {
        ...state,
        proposals: state.proposals.map((proposal) => {
          return {
            ...proposal,
            transactions: [
              ...proposal.transactions,
              ...[...Array(Math.floor(Math.random() * 10))].map(() => {
                return {
                  from: '0x' + Math.random().toString(16),
                  comment: Math.random() > 0.5 ? 'yes' as const : 'no' as const
                }
              })
            ]
          }}),
      }
    }
    // For development purposes only
    case 'reset': {
      return initialState;
    }
    // For development purposes only?
    case 'revoke_votes': {
      return {
        ...state,
        proposals: state.proposals.map((proposal) => {
          return {
            ...proposal,
            transactions: proposal.transactions.filter((transaction) => transaction.from !== action.payload.from)
          }
        }
      )}
    }
  }
}

export const DaoStateContext = createContext<DaoState>(initialState);
export const DaoStateDispatchContext = createContext<React.Dispatch<DaoAction>>(() => {});



export function DaoStateProvider({ children, defaultState, insertVote }: { children: React.ReactNode, defaultState: DaoState, insertVote: (vote: Vote) => Promise<void> }) {
  // const [loading, setLoading] = useState(true);
  const [daoState, dispatch] = useReducer(reducer, defaultState);

  // /* CHOOSE PROVIDER */
  // const votesProvider = useMemo(() => {
  //   if (!repo) return new VoidProvider();

  //   return isLocalhost()
  //     ? new LocalStorageProvider(repo.nameWithOwner)
  //     : new NapkinVoteProvider(repo.nameWithOwner); // persistent and shared using napkin.io
  // }, [repo]); 

  // useEffect(() => {
  //   (async () => {

  //     initialVotes.forEach((vote) => {
  //       dispatch({ type: 'vote', payload: vote });
  //     });

  //     setLoading(false);
  //   })();
  // }, [initialVotes]);

  const dispatchWithSideEffects = async (action: DaoAction) => {
    dispatch(action);

    switch(action.type) {
      case 'vote': {
        insertVote(action.payload);
      }
    }
  }

  // if (loading) return <div>Loading...</div>;

  return (
    <DaoStateContext.Provider value={daoState}>
      <DaoStateDispatchContext.Provider value={dispatchWithSideEffects}>
        {children}
      </DaoStateDispatchContext.Provider>
    </DaoStateContext.Provider>
  );
}

export function useVoteHandler({ voterUid, proposalNumber }: { voterUid: string, proposalNumber: number }) {
  const dispatch = useContext(DaoStateDispatchContext);
  const voteHandler = useCallback((comment: Vote['comment']) => () => dispatch({
    type: 'vote',
    payload: {
      number: proposalNumber,
      from: voterUid,
      comment,
    }
  }), [dispatch, voterUid, proposalNumber]);

  return voteHandler;
}

export function useProposal({ voterUid, proposalNumber }: { voterUid: string, proposalNumber: number }) {
  const daoState = useContext(DaoStateContext);
  const proposal = daoState.proposals.find((proposal) => proposal.number === proposalNumber);
  const votes = proposal?.transactions ?? [];

  const voteTransaction = votes.find((transaction) => transaction.from === voterUid); // fixme: should be findlast
  const votesCount = votes.reduceRight((memo, tx) => {
    if (!memo.voters[tx.from]) {
      memo[tx.comment] += 1;
      memo.voters[tx.from] = true;
    }

    return memo;
  }, { yes: 0, no: 0, none: 0, voters: {} as Record<string, boolean> });
  return {
    currentVote: voteTransaction?.comment,
    votesCount
  };
}
