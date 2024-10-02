"use client";

import * as React from "react";
import { Archive, Inbox as InboxIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccountSwitcher } from "@/app/components/account-switcher";
import { Nav } from "@/app/components/nav";
import { useMessage } from "@/app/use-message";
import {
  useKnockClient,
  useNotifications,
  useNotificationStore,
} from "@knocklabs/react";
import { useState, useEffect, useMemo } from "react";
import { MessageList } from "./message-list";
import { MessageDisplay } from "./message-display";
import { Issue } from "../data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InboxProps {
  accounts: {
    id: string;
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  issues: Issue[];
  view: "inbox" | "archive";
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Inbox({
  accounts,
  issues,
  view,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: InboxProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [message] = useMessage();
  const pathname = usePathname();
  const knockClient = useKnockClient();

  const feed = useNotifications(
    knockClient,
    process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID || "",
    {
      archived: "include",
    }
  );

  const { items, metadata } = useNotificationStore(feed);

  const [feedItems, archivedItems] = useMemo(() => {
    const feedItems = items?.filter((item) => !item.archived_at);
    const archivedItems = items?.filter((item) => item.archived_at);
    return [feedItems, archivedItems];
  }, [items]);

  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [labelFilter, setLabelFilter] = useState<string | undefined>(undefined);

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

  const filteredArchivedItems = useMemo(() => {
    return archivedItems?.filter((item) => {
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
  }, [archivedItems, issues, statusFilter, labelFilter]);

  const statuses = useMemo(
    () => Array.from(new Set(issues.map((issue) => issue.status))),
    [issues]
  );
  const labels = useMemo(
    () => Array.from(new Set(issues.flatMap((issue) => issue.labels))),
    [issues]
  );

  useEffect(() => {
    feed.fetch();
  }, [feed]);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full max-h-[100vh] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onResize={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Inbox",
                label:
                  view === "inbox" ? metadata?.unread_count.toString() : "",
                icon: InboxIcon,
                variant: pathname === "/" ? "default" : "ghost",
                href: "/",
              },
              {
                title: "Archive",
                label: "",
                icon: Archive,
                variant: pathname === "/archive" ? "default" : "ghost",
                href: "/archive",
              },
            ]}
          />
          <Separator />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex space-x-4">
                <Select onValueChange={(value) => setStatusFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setLabelFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by label" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All labels</SelectItem>
                    {labels.map((label) => (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <TabsContent value="all" className="m-0">
              {view === "inbox" ? (
                <MessageList items={filteredFeedItems} />
              ) : (
                <MessageList items={filteredArchivedItems} />
              )}
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MessageList
                items={items.filter((item) => {
                  if (item.read_at) return false;
                  const issue = issues.find(
                    (i) => i.id === item.data?.issue_id
                  );
                  return (
                    (statusFilter === undefined ||
                      statusFilter === "all" ||
                      issue?.status === statusFilter) &&
                    (labelFilter === undefined ||
                      labelFilter === "all" ||
                      issue?.labels.includes(labelFilter))
                  );
                })}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <MessageDisplay
            item={items.find((item) => item.id === message.selected) || null}
            feed={feed}
            issues={issues}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
