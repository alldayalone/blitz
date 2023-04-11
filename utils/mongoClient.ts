const napkin = 'https://pasha.npkn.net/dao-store/';
export const insertVote = (vote: any) => {
  return fetch(napkin, { method: 'POST', body: JSON.stringify(vote),  headers: {
    "Content-Type": "application/json",
    // 'Content-Type': 'application/x-www-form-urlencoded',
  }, });
}


export const getVotes = () => {
  return fetch(napkin).then(res => res.json()).then(votes => votes.filter(Boolean));
}
