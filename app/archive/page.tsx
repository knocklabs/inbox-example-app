import { cookies } from "next/headers";
import Image from "next/image";

import { Inbox } from "@/app/components/inbox";
import { accounts, issues } from "@/app/data";
import { InboxProvider } from "../components/inbox-provider";

export default function ArchivePage() {
  const layout = cookies().get("react-resizable-panels:layout:mail");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/mail-dark.png"
          width={1280}
          height={727}
          alt="Mail"
          className="hidden dark:block"
        />
        <Image
          src="/examples/mail-light.png"
          width={1280}
          height={727}
          alt="Mail"
          className="block dark:hidden"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <InboxProvider>
          <Inbox
            accounts={accounts}
            view="archive"
            issues={issues}
            defaultLayout={defaultLayout}
            defaultCollapsed={defaultCollapsed}
            navCollapsedSize={4}
          />
        </InboxProvider>
      </div>
    </>
  );
}
