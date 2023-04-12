export interface Vote {
  number: number;
  comment: 'yes' | 'no';
  from: string;
}

export abstract class VoteProvider {
  abstract insertVote(vote: Vote): Promise<void>;
  abstract getVotes(): Promise<Vote[]>;
}