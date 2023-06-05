import type { NextApiRequest, NextApiResponse } from 'next';
import * as mongo from '@/utils/mongo';
import slug from 'slug';
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  await mongo.client.connect();

  const project = {
    name: req.body.name,
    handle: slug(req.body.name),
    description: req.body.description,
    proposeBtnText: 'request feature',
    features: [
      {
        name: req.body.firstFeature,
        transactions: [],
      }
    ],
  }

  await mongo.projects.insertOne(project);


  res.status(200).json(project);
}