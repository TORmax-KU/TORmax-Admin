'use client';

type TabKey = 'ops' | 'users' | 'scraping' | 'diagnostics' | 'logs' | 'orgs';

interface AdminTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  torCount: number;
  userCount: number;
  logCount: number;
  orgCount?: number;
  t: any;
}

export function AdminTabs({ 
  activeTab, 
  onTabChange, 
  torCount, 
  userCount, 
  logCount,
  orgCount
}: AdminTabsProps) {
  const tabs = [
    { key: 'ops' as const, icon: 'ri-folder-open-line', label: 'การดำเนินการ TOR', count: torCount },
    { key: 'orgs' as const, icon: 'ri-building-4-line', label: 'โครงสร้างองค์กร', count: orgCount },
    { key: 'users' as const, icon: 'ri-team-line', label: 'จัดการผู้ใช้งาน', count: userCount },
    { key: 'scraping' as const, icon: 'ri-radar-line', label: 'ระบบดึงข้อมูล (Scraping)' },
    { key: 'diagnostics' as const, icon: 'ri-pulse-line', label: 'วิเคราะห์ระบบ' },
    { key: 'logs' as const, icon: 'ri-terminal-box-line', label: 'บันทึกระบบ (Logs)', count: logCount, isError: true },
  ];

  return (
    <div role="tablist" className="tabs tabs-bordered overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          onClick={() => onTabChange(tab.key)}
          className={`tab whitespace-nowrap gap-2 text-base-content ${
            activeTab === tab.key ? 'tab-active font-bold border-primary text-primary' : ''
          }`}
        >
          <i className={tab.icon}></i>
          {tab.label}
          {tab.count !== undefined && (
            <span className={`badge badge-sm font-mono ${tab.isError ? 'badge-error' : ''}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}