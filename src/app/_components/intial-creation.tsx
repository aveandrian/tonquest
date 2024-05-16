import { api } from "@/trpc/react";
import { Button } from "@nextui-org/react";

export function InitialCreation() {
  const stepsToAdd = [
    {
      questId: 2,
      stepType: 0,
      stepTitle: "Explore TON's Whitepaper",
      stepDescription:
        "Delve into the foundational document outlining TON's principles and objectives.",
      stepOrder: 0,
    },
    {
      questId: 2,
      stepType: 0,
      stepTitle: "Discover Visionaries",
      stepDescription:
        "Learn about the visionaries behind TON's creation and their contributions to decentralized tech.",
      stepOrder: 1,
    },
    {
      questId: 2,
      stepType: 0,
      stepTitle: "Technical Architecture",
      stepDescription:
        "Understand the technical architecture underpinning the TON blockchain.",
      stepOrder: 2,
    },
    {
      questId: 2,
      stepType: 0,
      stepTitle: "Reflect & Discuss",
      stepDescription:
        "Join the TON Discord server to reflect on TON's impact and discuss with fellow enthusiasts.",
      stepOrder: 3,
    },
    {
      questId: 3,
      stepType: 0,
      stepTitle: "Core Components",
      stepDescription: "Explore TON's mainnet, SDK, and essential tools.",
      stepOrder: 0,
    },
    {
      questId: 3,
      stepType: 0,
      stepTitle: "Dive into dApps",
      stepDescription:
        "Explore TON's diverse decentralized applications and their functionalities.",
      stepOrder: 1,
    },
    {
      questId: 3,
      stepType: 0,
      stepTitle: "Partner Discoveries",
      stepDescription:
        "Discover TON's partnerships and collaborations within the blockchain ecosystem.",
      stepOrder: 2,
    },
    {
      questId: 3,
      stepType: 0,
      stepTitle: "Community Connect",
      stepDescription:
        "Connect with the TON community on Twitter and Discord for discussions and updates.",
      stepOrder: 3,
    },
    {
      questId: 4,
      stepType: 0,
      stepTitle: "Wallet Setup",
      stepDescription: "Set up your TON wallet and secure your private keys.",
      stepOrder: 0,
    },
    {
      questId: 4,
      stepType: 0,
      stepTitle: "Send TON Transactions",
      stepDescription:
        "Initiate your first TON transaction to another user or address.",
      stepOrder: 1,
    },
    {
      questId: 4,
      stepType: 0,
      stepTitle: "Fee Insights",
      stepDescription:
        "Understand transaction fees and speeds on the TON blockchain.",
      stepOrder: 2,
    },
    {
      questId: 4,
      stepType: 0,
      stepTitle: "Community Support",
      stepDescription:
        "Follow TON updates and tips on Twitter and join the Discord community for assistance.",
      stepOrder: 3,
    },
    {
      questId: 5,
      stepType: 0,
      stepTitle: "Developer Resources",
      stepDescription:
        "Explore TON's developer documentation and available resources.",
      stepOrder: 0,
    },
    {
      questId: 5,
      stepType: 0,
      stepTitle: "Development Setup",
      stepDescription:
        "Set up your development environment using TON's SDKs and tools.",
      stepOrder: 1,
    },
    {
      questId: 5,
      stepType: 0,
      stepTitle: "Project Ideation",
      stepDescription:
        "Brainstorm project ideas and outline your dApp's functionalities.",
      stepOrder: 2,
    },
    {
      questId: 5,
      stepType: 0,
      stepTitle: "Feedback & Collaboration",
      stepDescription:
        "Share your progress on Twitter and join Discord to gather feedback and collaborate with the community.",
      stepOrder: 3,
    },
    {
      questId: 6,
      stepType: 0,
      stepTitle: "Security Importance",
      stepDescription:
        "Understand the criticality of security in blockchain networks like TON.",
      stepOrder: 0,
    },
    {
      questId: 6,
      stepType: 0,
      stepTitle: "Consensus Mechanism",
      stepDescription:
        "Learn about TON's consensus mechanism and its role in network security.",
      stepOrder: 1,
    },
    {
      questId: 6,
      stepType: 0,
      stepTitle: "Threat Awareness",
      stepDescription:
        "Identify common security threats and vulnerabilities in blockchain networks.",
      stepOrder: 2,
    },
    {
      questId: 6,
      stepType: 0,
      stepTitle: "Secure Practices",
      stepDescription:
        "Adopt best practices for securing your TON wallet and private keys.",
      stepOrder: 3,
    },
  ];

  const questData = [
    {
      questSlug: "ton-genesis",
      questName: "TON's Genesis",
      questDescription:
        "Embark on a journey to explore the origins and principles of the TON blockchain.",
    },
    {
      questSlug: "ton-ecosystem",
      questName: "TON Ecosystem Tour",
      questDescription:
        "Discover the diverse ecosystem of the TON blockchain and its various components.",
    },
    {
      questSlug: "ton-transactions",
      questName: "Mastering TON Transactions",
      questDescription:
        "Learn the ins and outs of conducting transactions on the TON blockchain.",
    },
    {
      questSlug: "ton-building",
      questName: "Building on TON",
      questDescription:
        "Unlock the secrets of developing decentralized applications (dApps) on the TON blockchain.",
    },
    {
      questSlug: "ton-security",
      questName: "Guardians of TON Security",
      questDescription:
        "Become a guardian of the TON blockchain and protect its security against threats.",
    },
  ];

  const createBatchQuests = api.quest.createQuestBatch.useMutation();
  const createBatchSteps = api.questStep.createQuestStepBatch.useMutation();

  return (
    <>
      <Button onClick={() => createBatchQuests.mutate(questData)}>
        Create quests
      </Button>

      <Button onClick={() => createBatchSteps.mutate(stepsToAdd)}>
        Create STEPS
      </Button>
    </>
  );
}
