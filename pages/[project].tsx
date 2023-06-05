import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import React from 'react';
import * as mongo from '@/utils/mongo';
import { DaoStateProvider, useProposal, useVoteHandler } from '@/utils/voteState';
import { setCookie, getCookie, hasCookie } from 'cookies-next';
import { v4 as uuid } from 'uuid';


const ProjectPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ project, blitzId }) => {
  if (!project) {
    return <div>could not find the project :(</div>
  }

  const propose = async () => {
    const title = prompt("what's your idea?");
    if (!title) return;

     await fetch('/api/propose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        project: project.handle,
        title,
      })
    });

    location.reload();
  }

  return (
    <Layout>
      <div className='bg-dark-blue'>
        <div className="my-5 flex flex-col justify-end gap-4">
          <h1 className="text-3xl">{project.name}</h1>
          <p className="text-muted">{project.description}</p>
          <Button className="xs:self-end" color="fancy" size="large" data-splitbee-event="propose" onClick={propose} target="_blank">
            {project.proposeBtnText}
          </Button>
        </div>
      </div>

      <DaoStateProvider insertVote={async (vote) => { 
        await fetch('/api/vote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            project: project.handle,
            vote
          })
        });
      }} defaultState={{
        proposals: project.features.map((p, index) => ({ number: index, transactions: p.transactions }))}
      }>
        <div className='flex flex-col gap-2'>
          {project.features.map((feat, index) => <Issue blitzId={blitzId} key={feat.name} feat={feat} index={index} />)}
        </div>
      </DaoStateProvider>
     
    </Layout>
  );
}

const Issue: React.FC<{ feat: mongo.Project['features'][number], blitzId: string, index: number }> = ({ feat, blitzId, index }) => {
  const { currentVote, votesCount} = useProposal({
    voterUid: blitzId,
    proposalNumber: index,
  });
  const voteHandler = useVoteHandler({
    voterUid: blitzId,
    proposalNumber: index,
  });

  return (
    <div className={`flex flex-wrap justify-end items-center min-h-11 py-2 gap-3 text-sm border-b border-[#212234]`}>
    <h3 className="flex-grow"><span className="text-muted">#{index + 1}</span> {feat.name}</h3>
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

export const getServerSideProps: GetServerSideProps<{ project: mongo.Project | undefined | null, blitzId: string }> = async (ctx) => {
  // Fetch data from external API
  // const res = await fetch(`https://.../data`);

  await mongo.client.connect();

  let project: mongo.Project | undefined | null
  try {
    // Query for a movie that has the title 'The Room'
    // const query = { title: "The Room" };
    // const options = {
    //   // sort matched documents in descending order by rating
    //   sort: { "imdb.rating": -1 },
    //   // Include only the `title` and `imdb` fields in the returned document
    //   projection: { _id: 0, title: 1, imdb: 1 },
    // };
    project = await mongo.projects.findOne({ handle: ctx.query.project });

    if (project) {
      project._id = project._id?.toString();
    }
    // since this method returns the matched document, not a cursor, print it directly
  } finally {
    await mongo.client.close();
  }

  // const project = { name: ctx.query.test as string }
  let blitzId = getCookie('blitz_uid', ctx) as string;
  
  // if (hasCookie('blitz_uid', ctx)) {
  //   blitzId = getCookie('blitz_uid', ctx)
  // }
  
  if (!blitzId) {
    blitzId = uuid();
    setCookie('blitz_uid', blitzId, {
      req: ctx.req,
      res: ctx.res,
      maxAge: 60 * 60 * 24 * 365 * 10,
      path: '/',
      sameSite: 'lax',
    })
  }
  
  // Pass data to the page via props
  return { props: { project, blitzId } };
}

export default ProjectPage;