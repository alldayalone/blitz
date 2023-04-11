import { createContext, useEffect, useReducer } from 'react';

export interface DaoState {
  proposals: {
    number: number
    transactions: {
      from: string
      comment: 'yes' | 'no'
    }[]
  }[]
}

type Action<T extends string, P = void> = P extends void
  ? { type: T }
  : { type: T; payload: P }

type TurnIntoProposalAction = Action<'turn_into_proposal', { number: number }>
type VoteAction = Action<'vote', { number: number, from: string, comment: 'yes' | 'no' }>
type ResetAction = Action<'reset'>
type RevokeVotesAction = Action<'revoke_votes', { from: string }>
type RandomizeAction = Action<'randomize'>
export type DaoAction = TurnIntoProposalAction | VoteAction | ResetAction | RandomizeAction | RevokeVotesAction;

export const initialState: DaoState = {
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

const initializer = () => (typeof window !== "undefined" && JSON.parse(localStorage.getItem('dao-state') ?? 'null')) || initialState;

export const DaoStateContext = createContext<DaoState>(initialState);
export const DaoStateDispatchContext = createContext<React.Dispatch<DaoAction>>(() => {});

export function DaoStateProvider({ children }: { children: React.ReactNode }) {
  const [daoState, dispatch] = useReducer(reducer, initialState, initializer);

  useEffect(() => {
    localStorage.setItem('dao-state', JSON.stringify(daoState));
  }, [daoState]);

  return (
    <DaoStateContext.Provider value={daoState}>
      <DaoStateDispatchContext.Provider value={dispatch}>
        {children}
      </DaoStateDispatchContext.Provider>
    </DaoStateContext.Provider>
  );
}