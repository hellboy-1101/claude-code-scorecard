"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface TabContentProps {
  tabs: TabItem[];
  defaultValue?: string;
  /** Optional type color for the active tab indicator */
  color?: string;
  className?: string;
}

export default function TabContent({
  tabs,
  defaultValue,
  color,
  className,
}: TabContentProps) {
  const defaultTab = defaultValue ?? tabs[0]?.value;

  return (
    <Tabs defaultValue={defaultTab} className={className}>
      <TabsList variant="line" className="w-full justify-start border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="px-4 py-2.5 text-sm font-medium"
            style={
              color
                ? ({
                    "--tw-tab-active-color": color,
                  } as React.CSSProperties)
                : undefined
            }
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="pt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
