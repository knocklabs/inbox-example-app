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

1. Navigate to the home page of the application.
2. Look for a "Seed Knock Data" button in the left-hand navigation.
3. Click the button to trigger the `seedKnockData` server action.

The `seedKnockData` function iterates through each issue in the `issues` array and triggers the "inbox-demo" workflow for three event types: `statusChange`, `assignment`, and `comment`. Each trigger sends the issue data along with the event type to Knock.

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

## Creating a custom inbox using the feed API

This project uses components and hooks from the `@knocklabs/react` package to create a custom inbox view. Here's how these are utilized:

1. `KnockProvider` component:

   In `inbox-provider.tsx`, we wrap our application with the `KnockProvider` to initialize the Knock client:

   ```typescript
   import { KnockProvider } from "@knocklabs/react";

   export function InboxProvider({ children }: InboxProviderProps) {
     return (
       <KnockProvider
         apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY || ""}
         userId={process.env.NEXT_PUBLIC_KNOCK_USER_ID || ""}
       >
         {children}
       </KnockProvider>
     );
   }
   ```

   This provider sets up the Knock client with the necessary API key and user ID, making it available to all child components.

2. `useKnockClient` hook:

   ```typescript
   const knockClient = useKnockClient();
   ```

   This hook provides access to the Knock client instance for interacting with the Knock API.

3. `useNotifications` hook:

   ```typescript
   const feed = useNotifications(
     knockClient,
     process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID || "",
     {
       archived: "include",
     }
   );
   ```

   This hook fetches and manages notifications for a specific feed channel. It returns a `feed` object with methods to interact with the notifications.

4. `useNotificationStore` hook:

   ```typescript
   const { items, metadata } = useNotificationStore(feed);
   ```

   This hook provides access to notification items and metadata, automatically updating when the feed changes.

5. Fetch notifications on component mount:

```typescript
useEffect(() => {
  feed.fetch();
}, [feed]);
```

Lastly, we need to perform a `fetch` of the feed to load its initial state.

### Implementing Inbox Functionality

- Separate feed items and archived items. This allows us to create separate views for the inbox and archived items:

  ```typescript
  const [feedItems, archivedItems] = useMemo(() => {
    const feedItems = items?.filter((item) => !item.archived_at);
    const archivedItems = items?.filter((item) => item.archived_at);
    return [feedItems, archivedItems];
  }, [items]);
  ```

- Apply additional filtering based on status and label:

  ```typescript
  const filteredFeedItems = useMemo(() => {
    return feedItems?.filter((item) => {
      const issue = issues.find((i) => i.id === item.data?.id);
      return (
        (statusFilter === undefined ||
          statusFilter === "all" ||
          issue?.status === statusFilter) &&
        (labelFilter === undefined ||
          labelFilter === "all" ||
          issue?.labels.includes(labelFilter))
      );
    });
  }, [feedItems, issues, statusFilter, labelFilter]);
  ```

- Render filtered items in the `MessageList` component:

  ```typescript
  <MessageList items={filteredFeedItems} />
  ```

- Display selected item details in the `MessageDisplay` component:
  ```typescript
  <MessageDisplay
    item={items.find((item) => item.id === message.selected) || null}
    feed={feed}
    issues={issues}
  />
  ```

By leveraging these hooks, the component efficiently manages and displays notifications from Knock, handles real-time updates, and provides filtering and viewing capabilities for the inbox.

### Managing message status with knockClient

In the `MessageDisplay` component, we utilize the `knockClient` through the `feed` prop to manage the status of messages. This includes marking messages as read/unread and archiving/unarchiving them. Here's how it's implemented:

1. Marking as Read/Unread:

   ```typescript
   {
     !item?.read_at ? (
       <Button
         // ... other props ...
         onClick={() => {
           if (item) {
             feed.markAsRead(item);
           }
         }}
       >
         <BookCheck className="h-4 w-4" />
         <span className="sr-only">Mark as read</span>
       </Button>
     ) : (
       <Button
         // ... other props ...
         onClick={() => {
           if (item) {
             feed.markAsUnread(item);
           }
         }}
       >
         <BookX className="h-4 w-4" />
         <span className="sr-only">Mark as unread</span>
       </Button>
     );
   }
   ```

   We use the `feed.markAsRead(item)` and `feed.markAsUnread(item)` methods to toggle the read status of a message.

2. Archiving/Unarchiving:

   ```typescript
   {
     !item?.archived_at ? (
       <Button
         // ... other props ...
         onClick={() => {
           if (item) {
             feed.markAsRead(item);
             feed.markAsArchived(item);
           }
         }}
       >
         <Archive className="h-4 w-4" />
         <span className="sr-only">Archive</span>
       </Button>
     ) : (
       <Button
         // ... other props ...
         onClick={() => {
           if (item) {
             feed.markAsUnarchived(item);
           }
         }}
       >
         <ArchiveRestore className="h-4 w-4" />
         <span className="sr-only">Unarchive</span>
       </Button>
     );
   }
   ```

   For archiving, we use `feed.markAsArchived(item)`, and for unarchiving, we use `feed.markAsUnarchived(item)`. Note that when archiving, we also mark the item as read.

These methods interact with the Knock API to update the status of messages in real-time. The `feed` object, which is an instance of the Knock Feed API, handles the communication with the server and updates the local state accordingly using optimistic updates.

By using these methods, we ensure that the message status is consistently managed both in the UI and on the server-side, providing a seamless experience for users interacting with their inbox.
