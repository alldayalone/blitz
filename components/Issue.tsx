import { useContext } from 'react'
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types'
import octokit from '@/utils/octokit'
import { DaoStateDispatchContext, DaoStateContext } from '@/stores/daoState';
import { useIp } from '@/stores/ip';
import Button from '@/components/Button';

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
  const isAuth = Boolean(tonAddress);

  const voteTransaction = proposal?.transactions.find((transaction) => transaction.from === tonAddress);
  const isVoted = Boolean(voteTransaction);

  const yesVotes = proposal?.transactions.filter((transaction) => transaction.comment === 'yes').length ?? 0;
  const noVotes = proposal?.transactions.filter((transaction) => transaction.comment === 'no').length ?? 0;

  const voteHandler = (comment: 'yes' | 'no') => () => dispatch({
    type: 'vote',
    payload: {
      number: issue.number,
      from: tonAddress,
      comment,
    }
  });
  
  return (
    <div className={`flex justify-between items-center h-11 text-sm gap-2 border-b border-[#212234]`}>
      <h3 className='text-ellipsis whitespace-nowrap overflow-hidden'>#{issue.number} {issue.title}</h3>
      {tonAddress && <div className='flex-shrink-0 flex gap-3'>
        <Button
          disabled={!isAuth || isVoted}
          color={isVoted && voteTransaction?.comment === 'yes' ? 'green' : 'default'}
          size="small"
          onClick={voteHandler('yes')}
        >{yesVotes} yes</Button>
        <Button
          disabled={!isAuth || isVoted}
          color={isVoted && voteTransaction?.comment === 'no' ? 'red' : 'default'}
          size="small"
          onClick={voteHandler('no')}
        >{noVotes} no</Button>
      </div>}
    </div>
  )
}
