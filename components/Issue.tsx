import { Button } from '@/components/Button';
import { useVoteHandler, useProposal, useBlitzId } from '@theoberton/blitz-core';

export function Issue({ issue }: {
  issue: { number: number; title: string}
}) {
  const blitzId = useBlitzId();
  const voteHandler = useVoteHandler({ voterUid: blitzId, proposalNumber: issue.number });
  const { currentVote, votesCount } = useProposal({ voterUid: blitzId, proposalNumber: issue.number }); 

  return (
    <div className={`flex flex-wrap justify-end items-center min-h-11 py-2 gap-3 text-sm border-b border-[#212234]`}>
      <h3 className="flex-grow"><span className="text-muted">#{issue.number}</span> {issue.title}</h3>
      <div className='flex-shrink-0 flex gap-3'>
        <Button
          disabled={currentVote}
          color={currentVote === 'yes' ? 'green' : 'default'}
          size="small"
          onClick={voteHandler('yes')}
        >{votesCount.yes} yes</Button>
        <Button
          disabled={currentVote}
          color={currentVote === 'no' ? 'red' : 'default'}
          size="small"
          onClick={voteHandler('no')}
        >{votesCount.no} no</Button>
      </div>
    </div>
  )
}
