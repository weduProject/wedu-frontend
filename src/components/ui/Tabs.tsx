import clsx from 'clsx';

export interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export default function Tabs({ items, activeKey, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 border-b border-border" role="tablist">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={activeKey === item.key}
          className={clsx(
            'bg-transparent border-0 border-b-2 -mb-px px-4 py-2.5 cursor-pointer text-sm transition-colors',
            activeKey === item.key
              ? 'text-primary border-primary font-semibold'
              : 'text-text-muted border-transparent hover:text-text',
          )}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
