import React, { useCallback, useState } from 'react';

import {
  LegacyCard,
  ResourceList,
  Button,
  ResourceItem,
  Text,
  ButtonGroup,
  HorizontalStack,
  SkeletonDisplayText,
  SkeletonBodyText,
  TextContainer,
  Modal,
  LegacyStack,
  TextField,
} from '@shopify/polaris';

import { RepoProvider, useRepo, DaoStateProvider, useProposal, useVoteHandler, useMakeProposal  } from '@theoberton/blitz-core';

function ShopifyIssue({ issue, userId }: {issue: { number: number; title: string}, userId: string }) {
  const voteHandler = useVoteHandler({ voterUid: userId, proposalNumber: issue.number });
  const { currentVote, votesCount } = useProposal({ voterUid: userId, proposalNumber: issue.number }); 

  return (
    <ResourceItem
      id={issue.number.toString()}
      onClick={() => {}}
      accessibilityLabel={`View details for ${name}`}
    >
      <HorizontalStack blockAlign="center">
        <div style={{ flexGrow: 1 }}>
          
          <Text variant="bodyMd" fontWeight="semibold" as="h3">
            <Text color="subdued" variant="bodyMd"  as="span">
              #{issue.number}
            </Text> {issue.title}
            
          </Text>
        </div>
        <ButtonGroup segmented>
          <div style={{ minWidth: '4rem' }}>
          <Button
            size="slim"
            fullWidth
            pressed={currentVote === 'yes'}
            onClick={currentVote === 'yes' ? voteHandler('none') : voteHandler('yes')}
          >
            {votesCount.yes.toString()} Yes
          </Button>
          </div>
          <div style={{ minWidth: '4rem' }}>
          <Button
            size="slim"
            fullWidth
            pressed={currentVote === 'no'}
            onClick={currentVote === 'no' ? voteHandler('none') : voteHandler('no')}
          >
            {votesCount.no.toString()} No
          </Button>
          </div>
        </ButtonGroup>
  </HorizontalStack>

    </ResourceItem>
  );
}

type InternalProps = {
  headerContent: string;
  userId: string;
}

const ProposeModal = () => {
  const makeProposal = useMakeProposal();

  const [active, setActive] = useState(false);

  const handleModalChange = useCallback(() => setActive(!active), [active]);

  const handleClose = useCallback(() => {
    handleModalChange();
  }, [handleModalChange]);

  const [isLoading, setIsLoading] = useState(false);
  const activator = <Button onClick={handleModalChange}>Propose idea</Button>;

  const [oneliner, setOneliner] = useState('');
  const handleOnelinerChange = useCallback(
    (newValue: string) => setOneliner(newValue),
    [],
  );

  const handleSend = useCallback(async () => {
    setIsLoading(true);
    await makeProposal({ oneliner, description: '.' });
    handleClose();
  }, [handleClose, makeProposal, oneliner]);

  return (
      <Modal
        activator={activator}
        open={active}
        onClose={handleClose}
        title="Propose idea"
        primaryAction={{
          content: 'Send',
          onAction: handleSend,
          loading: isLoading 
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleClose,
          },
        ]}
      >
        <Modal.Section>
          <LegacyStack vertical>
            <LegacyStack.Item>
              <TextField
                label="One-liner"
                value={oneliner}
                onChange={handleOnelinerChange}
                autoComplete="off"
              />
            </LegacyStack.Item>
          </LegacyStack>
        </Modal.Section>
      </Modal>
  )
}

const Internal: React.FC<InternalProps> = ({ headerContent, userId }) => {
  const { repo } = useRepo();

  if (!repo) {
    return (
      <LegacyCard sectioned>
        <TextContainer>
          <SkeletonDisplayText size="small"  />
          <SkeletonBodyText lines={5} />
        </TextContainer>
      </LegacyCard>
    )
  }

  return (
  <LegacyCard>
    <ResourceList
      items={repo.discussions.nodes}
      renderItem={(issue) => <ShopifyIssue issue={issue} userId={userId} />}
      headerContent={headerContent}
      alternateTool={<ProposeModal />}
    />
  </LegacyCard>
  );
}

export type ShopifyRoadmapProps = {
  headerContent?: string;
  userId?: string;
  repoName: string;
}

export const ShopifyRoadmap: React.FC<ShopifyRoadmapProps> = ({ repoName, ...rest }) => {
  const userId = rest.userId || 'sos';
  const headerContent = rest.headerContent || "What should I build next?";
  return (
    <RepoProvider repoName={repoName}>
      <DaoStateProvider>
        <Internal userId={userId} headerContent={headerContent}  />
      </DaoStateProvider>
    </RepoProvider>
  );
}