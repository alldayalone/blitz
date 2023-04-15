import { useContext } from 'react'
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types'
import octokit from '@/utils/octokit'
import { DaoStateDispatchContext, DaoStateContext } from '@/stores/daoState';
import { useIp } from '@/stores/ip';

function useTonAddress() {
  return useIp();
}

export function Issue({ issue }: {
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
      }}>{noVotes} No</button>}
    </div>
  </div>
  )
}
