import { ComponentProps } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessage } from "@/app/use-message";
import { FeedItem } from "@knocklabs/client";
interface MessageListProps {
  items: FeedItem[];
}

export function MessageList({ items }: MessageListProps) {
  const [message, setMessage] = useMessage();

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0 pb-36">
        {" "}
        {/* Updated this line */}
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              message.selected === item.id && "bg-muted"
            )}
            onClick={() =>
              setMessage({
                ...message,
                selected: item.id,
              })
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{`${
                    item?.data?.id
                  } - ${getEventDescription(item)}`}</div>
                  {!item.read_at && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    message.selected === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {formatDistanceToNow(new Date(item.inserted_at), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">
                {`${item?.data?.id} - ${getEventDescription(item)}`}
              </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item?.data?.text?.substring(0, 300)}
            </div>
            {item?.data?.labels?.length ? (
              <div className="flex items-center gap-2">
                {item?.data?.labels.map((label: string) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}

function getEventDescription(item: FeedItem): string {
  const eventType = item?.data?.event;
  switch (eventType) {
    case "assignment":
      return "Assignment updated";
    case "comment":
      return "New comment added";
    case "statusChange":
      return `Status changed`;
    default:
      return item?.data?.subject || "Event occurred";
  }
}
