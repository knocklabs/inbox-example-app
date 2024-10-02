This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

1. Configure the environment variables:

   Update the `.env.local` file in the root of your project and add the following variables:

   ```
   NEXT_PUBLIC_KNOCK_API_KEY=your_public_knock_api_key
   NEXT_PUBLIC_KNOCK_USER_ID=your_knock_user_id
   NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID=your_knock_feed_channel_id
   KNOCK_SECRET_API_KEY=your_secret_knock_api_key
   ```

   Replace the values with your actual Knock API credentials. The value for NEXT_PUBLIC_KNOCK_USER_ID can be taken from an `account` found in `data.tsx`.

2. Push and commit the Knock workflow:

   Use the Knock CLI to push and commit the `inbox-demo` workflow in the `.knock/inbox-demo` directory:

   ```bash
   knock workflow push .knock/inbox-demo --commit
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Seeding Knock Data

To populate your Knock feed with sample data:

1. Navigate to the home page of your application.
2. Look for a "Seed Knock Data" button or link (implementation details may vary).
3. Click the button to trigger the `seedKnockData` server action.

The `seedKnockData` function iterates through each issue in the `issues` array and triggers the "inbox-demo" workflow for three event types: statusChange, assignment, and comment. Each trigger sends the issue data along with the event type to Knock.

```typescript
try {
  await knock.workflows.trigger("inbox-demo", {
    recipients: [
      {
        id: account.id,
        email: account.email,
        name: account.label,
      },
    ],
    actor: {
      id: account.id,
      email: account.email,
      name: account.label,
    },
    data: {
      id: "ENH-7890",
      event: "statusChange",
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
      ],
    },
  });
  console.log(`Triggered ${eventType} workflow for issue ${issue.id}`);
} catch (error) {
  console.error(
    `Error triggering ${eventType} workflow for issue ${issue.id}:`,
    error
  );
}
```
