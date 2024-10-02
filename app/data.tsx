import { CircleUser } from "lucide-react";

export const issues = [
  {
    id: "ISS-8726",
    title: "ISS-8726: Fix the bug",
    description: "Fix the bug",
    date: new Date(),
    status: "open",
    previousStatus: "todo",
    priority: "high",
    type: "bug",
    assignee: "John Doe",
    reporter: "Jane Doe",
    labels: ["bug", "fix"],
    comments: [
      {
        text: "I've identified the cause of the bug. Working on a fix now.",
        datetime: new Date(Date.now() - 3600000), // 1 hour ago
        author: "John Doe",
      },
      {
        text: "Thanks for the update. Let me know if you need any assistance.",
        datetime: new Date(Date.now() - 1800000), // 30 minutes ago
        author: "Jane Doe",
      },
    ],
  },
  {
    id: "FEAT-3921",
    title: "FEAT-3921: Implement new user dashboard",
    description:
      "Create a new dashboard for users to view their account statistics",
    date: new Date(Date.now() + 86400000), // Tomorrow
    status: "in progress",
    previousStatus: "open",
    priority: "medium",
    type: "feature",
    assignee: "Alice Smith",
    reporter: "Bob Johnson",
    labels: ["feature", "ui", "dashboard"],
    comments: [
      {
        text: "I've started working on the UI design. Will share mockups soon.",
        datetime: new Date(Date.now() - 86400000), // 1 day ago
        author: "Alice Smith",
      },
    ],
  },
  {
    id: "TASK-5432",
    title: "TASK-5432: Update documentation",
    description:
      "Review and update the API documentation for the latest release",
    date: new Date(Date.now() + 172800000), // Day after tomorrow
    status: "todo",
    previousStatus: "backlog",
    priority: "low",
    type: "task",
    assignee: "Emily Davis",
    reporter: "Michael Wilson",
    labels: ["documentation", "api"],
    comments: [
      {
        text: "I'll start working on this next week. Any specific sections to focus on?",
        datetime: new Date(Date.now() - 259200000), // 3 days ago
        author: "Emily Davis",
      },
      {
        text: "Please prioritize the new endpoints we added in the last sprint.",
        datetime: new Date(Date.now() - 172800000), // 2 days ago
        author: "Michael Wilson",
      },
    ],
  },
  {
    id: "ENH-7890",
    title: "ENH-7890: Optimize database queries",
    description:
      "Improve performance by optimizing frequently used database queries",
    date: new Date(Date.now() - 86400000), // Yesterday
    status: "closed",
    previousStatus: "in progress",
    priority: "high",
    type: "enhancement",
    assignee: "David Lee",
    reporter: "Sarah Brown",
    labels: ["performance", "database", "optimization"],
    comments: [
      {
        text: "I've optimized the main query. Seeing a 50% performance improvement.",
        datetime: new Date(Date.now() - 432000000), // 5 days ago
        author: "David Lee",
      },
      {
        text: "Great work! Let's close this issue and monitor the performance.",
        datetime: new Date(Date.now() - 345600000), // 4 days ago
        author: "Sarah Brown",
      },
    ],
  },
  {
    id: "SEC-6543",
    title: "SEC-6543: Implement two-factor authentication",
    description:
      "Add two-factor authentication option for user accounts to enhance security",
    date: new Date(Date.now() - 604800000), // 1 week ago
    status: "open",
    previousStatus: "backlog",
    priority: "high",
    type: "security",
    assignee: "Emma Wilson",
    reporter: "Alex Thompson",
    labels: ["security", "authentication", "user-accounts"],
    comments: [
      {
        text: "I've researched some 2FA libraries we could use. Let's discuss the best approach.",
        datetime: new Date(Date.now() - 86400000), // 1 day ago
        author: "Emma Wilson",
      },
      {
        text: "Great initiative! Let's schedule a meeting to review the options.",
        datetime: new Date(Date.now() - 43200000), // 12 hours ago
        author: "Alex Thompson",
      },
    ],
  },
];

export type Issue = (typeof issues)[number];
export const accounts = [
  {
    label: "Brett Kertzmann",
    email: "brett@test.com",
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    icon: <CircleUser />,
  },
  {
    label: "Angie Grady",
    email: "angie@test.com",
    id: "60f7a8a0-9f70-4c9f-9c3a-9d5a8f5e0e1d",
    icon: <CircleUser />,
  },
  {
    label: "Katie Osinski",
    email: "katie@test.com",
    id: "3b241101-e2bb-4255-8caf-4136c566a962",
    icon: <CircleUser />,
  },
  {
    label: "Abel Rowe",
    email: "abel@test.com",
    id: "9d7b5e57-ce8d-4f7c-9d3e-7b9e0c7b1d4a",
    icon: <CircleUser />,
  },
];

export type Account = (typeof accounts)[number];
