import format from "date-fns/format";

import { Archive, BookCheck, BookX, ArchiveRestore } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FeedItem, Feed } from "@knocklabs/client";
import { Issue } from "../data";
import { Badge } from "@/components/ui/badge"; // Added import for Badge
import { CalendarIcon, UserIcon, HashIcon } from "lucide-react"; // Add MessageSquare
import { MessageSquare, RefreshCcw, UserPlus } from "lucide-react"; // Add these imports
import { Key } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

function getPriorityVariant(
  priority: string | undefined
): "default" | "secondary" | "destructive" | "outline" {
  switch (priority?.toLowerCase()) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "default";
  }
}

export function MessageDisplay({
  item,
  feed,
}: {
  item: FeedItem | null;
  feed: Feed;
  issues: Issue[];
}) {
  const [comment, setComment] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setComment(""); // Clear the comment when the dialog is closed
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          {!item?.read_at ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!item}
                  onClick={() => {
                    if (item) {
                      feed.markAsRead(item);
                    }
                  }}
                >
                  <BookCheck className="h-4 w-4" />
                  <span className="sr-only">Mark as read</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mark as read</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!item}
                  onClick={() => {
                    if (item) {
                      feed.markAsUnread(item);
                    }
                  }}
                >
                  <BookX className="h-4 w-4" />
                  <span className="sr-only">Mark as unread</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mark as unread</TooltipContent>
            </Tooltip>
          )}
          {!item?.archived_at ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!item}
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
              </TooltipTrigger>
              <TooltipContent>Archive</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!item}
                  onClick={() => {
                    if (item) {
                      feed.markAsUnarchived(item);
                    }
                  }}
                >
                  <ArchiveRestore className="h-4 w-4" />
                  <span className="sr-only">Unarchive</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Unarchive</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <Separator />
      {item ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              {/* Replace Avatar with event-based icon */}
              <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                {item?.data?.event === "comment" && (
                  <MessageSquare className="h-5 w-5" />
                )}
                {item?.data?.event === "statusChange" && (
                  <RefreshCcw className="h-5 w-5" />
                )}
                {item?.data?.event === "assignment" && (
                  <UserPlus className="h-5 w-5" />
                )}
              </div>
              <div className="grid gap-1">
                <div className="font-semibold">{item?.data?.title}</div>
                <div className="flex flex-wrap gap-2">
                  {/* Priority Badge */}
                  <div className="flex items-center">
                    <span className="mr-1 text-xs text-muted-foreground">
                      Priority:
                    </span>
                    <Badge variant={getPriorityVariant(item?.data?.priority)}>
                      {item?.data?.priority || "No Priority"}
                    </Badge>
                  </div>
                  {/* Type Badge */}
                  <div className="flex items-center">
                    <span className="mr-1 text-xs text-muted-foreground">
                      Type:
                    </span>
                    <Badge variant="secondary">
                      {item?.data?.type || "No Type"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            {item?.data?.date && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(item?.data?.date), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          <div
            className="flex-1 whitespace-pre-wrap p-8 text-sm [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2"
            dangerouslySetInnerHTML={{
              __html:
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (item?.blocks?.find((block) => block.name === "body") as any)
                  ?.rendered || "No content available",
            }}
          />
          <Separator />
          {/* New ticket details section */}
          <div className="grid grid-cols-2 gap-4 p-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Created:</span>
              <span>{format(new Date(item?.data?.date), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Assignee:</span>
              <span>{item?.data?.assignee || "Unassigned"}</span>
            </div>
            <div className="flex items-center gap-2">
              <HashIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">ID:</span>
              <span>{item?.data?.id || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Badge variant="outline">{item?.data?.status || "Open"}</Badge>
            </div>
          </div>
          <Separator />
          {/* Comments section */}
          <div className="p-4">
            <h3 className="mb-4 text-lg font-semibold">Comments</h3>
            {item?.data?.comments && item.data.comments.length > 0 ? (
              <div className="space-y-4">
                {item.data.comments.map(
                  (
                    comment: {
                      author: string;
                      datetime: string | number | Date;
                      text: string;
                    },
                    index: Key | null | undefined
                  ) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {comment.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(comment.datetime),
                            "MMM d, yyyy 'at' h:mm a"
                          )}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                No comments yet
              </div>
            )}
          </div>
          <Separator className="mt-auto" />
          <div className="p-4">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <Textarea
                  className="p-4"
                  placeholder={`Reply to issue ${item?.data?.id}...`}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex items-center">
                  <Label
                    htmlFor="mute"
                    className="flex items-center gap-2 text-xs font-normal"
                  >
                    <Switch id="mute" aria-label="Mute thread" /> Mute this
                    thread
                  </Label>
                  <Button type="submit" size="sm" className="ml-auto">
                    Send
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comment Submitted</DialogTitle>
            <DialogDescription>
              Your comment has been received and needs to be sent to the system
              for Issue #{item?.data?.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="text-sm">{comment}</p>
          </div>
          <DialogFooter>
            <Button onClick={handleDialogClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
