import type { NextApiRequest, NextApiResponse } from 'next';
import * as mongo from '@/utils/mongo';
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<mongo.Project | { error: string }>,
) {
  await mongo.client.connect();

  const updatedProject = await mongo.projects.findOneAndUpdate({
    handle: req.body.project,
  }, { 
    $push: { [`features.${req.body.vote.number}.transactions`]: {
      comment: req.body.vote.comment,
      from: req.body.vote.from,
    } },
  }, {
    returnDocument: 'after'
  });

  if (!updatedProject.ok) {
    res.status(500).send({ error: 'internal error' })
    return;
  } 
  
  if (!updatedProject.value) {
    res.status(404).send({ error: 'not found' })
    return;
  }

  res.status(200).json(updatedProject.value);
}