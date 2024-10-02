"use server";

import { issues, accounts } from "../data";
import { Knock } from "@knocklabs/node";

const knock = new Knock(process.env.KNOCK_SECRET_API_KEY as string);

export async function seedKnockData() {
  const userId = process.env.NEXT_PUBLIC_KNOCK_USER_ID as string;
  const account = accounts.find((acc) => acc.id === userId);

  if (!account) {
    console.error(`Account not found for user ID: ${userId}`);
    return;
  }

  const eventTypes = ["statusChange", "assignment", "comment"];

  for (const issue of issues) {
    for (const eventType of eventTypes) {
      const payload = {
        ...issue,
        event: eventType,
      };

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
          data: payload,
        });
        console.log(`Triggered ${eventType} workflow for issue ${issue.id}`);
      } catch (error) {
        console.error(
          `Error triggering ${eventType} workflow for issue ${issue.id}:`,
          error
        );
      }
    }
  }

  console.log("Finished seeding Knock data");
}
