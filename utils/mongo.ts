import { MongoClient, ObjectId } from 'mongodb';

export type Project = {
  _id?: ObjectId | string,
  name: string;
  handle: string;
  description: string;
  proposeBtnText: string;
  features: Array<{
    name: string;
    transactions: Array<{
      from: string;
      comment: 'yes' | 'no' | 'none';
    }>
  }>
}

export const client = new MongoClient(process.env.DB_URI as string);

export const database = client.db("blitz");
export const projects = database.collection<Project>("projects");
