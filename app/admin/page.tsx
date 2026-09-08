'use client';

import { AdminOverviewHeader } from '@/components/AdminOverviewHeader';
import { AdminTabs } from '@/components/AdminTabs';
import { DiagnosticsTable } from '@/components/DiagnosticsTable';
import { EditTORModal } from '@/components/EditTORModal';
import { LogConsole } from '@/components/LogConsole';
import { ScrapingConfig } from '@/components/ScrapingConfig';
import { TelemetryChart } from '@/components/TelemetryChart';
import { TORTable } from '@/components/TORTable';
import { useAdmin } from '@/components/useAdmin';
import { UserTable } from '@/components/UserTable';
import { useApp } from '@/context/AppContext';
import { admini18n } from '@/public/mockdata/i18n/admin';
import { TELEMETRY_HISTORY_DATA } from '@/public/mockdata/TelemetryHistoryData';
import { OrganizationTable } from '@/components/OrganizationTable';

export default function AdminPage() {
  const { lang: contextLang } = useApp();
  const activeLang: Language = (contextLang?.toLowerCase() as Language) === 'th' ? 'th' : 'en';
  const t = admini18n[activeLang];

  const {
    activeTab,
    setActiveTab,
    torList,
    users,
    editingTor,
    setEditingTor,
    userQuery,
    setUserQuery,
    scraperApiKey,
    setScraperApiKey,
    renderJs,
    setRenderJs,
    ultraPremiumProxies,
    setUltraPremiumProxies,
    logs,
    filteredUsers,
    addLog,
    triggerManualSyncAll,
    runNetworkDiagnostic,
    deleteTOR,
    handleSaveEdit,
    handleEditChange,
    toggleUserStatus,
    clearLogs,
  } = useAdmin(activeLang, t);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 w-full space-y-8 text-base-content bg-base-100 min-h-screen">
      <AdminOverviewHeader t={t} onSyncClick={triggerManualSyncAll} />

      <TelemetryChart data={TELEMETRY_HISTORY_DATA} t={t} />

      <AdminTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        torCount={torList.length}
        userCount={users.length}
        logCount={logs.length}
        t={t}
      />

      {/* TAB 1: TOR OPERATIONS */}
      {activeTab === 'ops' && (
        <TORTable
          torList={torList}
          onEdit={setEditingTor}
          onDelete={deleteTOR}
          t={t}
        />
      )}

      {/* TAB NEW: ORGANIZATIONS */}
      {activeTab === 'orgs' && (
        <OrganizationTable />
      )}

      {/* TAB 2: USER GOVERNANCE */}
      {activeTab === 'users' && (
        <UserTable
          users={filteredUsers}
          onToggleStatus={toggleUserStatus}
          searchQuery={userQuery}
          onSearchChange={setUserQuery}
          t={t}
        />
      )}

      {/* TAB 3: WEBSCRAPING */}
      {activeTab === 'scraping' && (
        <ScrapingConfig
          apiKey={scraperApiKey}
          onApiKeyChange={setScraperApiKey}
          renderJs={renderJs}
          onRenderJsChange={setRenderJs}
          ultraPremiumProxies={ultraPremiumProxies}
          onProxiesChange={setUltraPremiumProxies}
          onScrapeClick={(name) => { }}
          onAddLog={addLog}
          t={t}
        />
      )}

      {/* TAB 4: DIAGNOSTICS */}
      {activeTab === 'diagnostics' && (
        <DiagnosticsTable onPing={runNetworkDiagnostic} t={t} />
      )}

      {/* TAB 5: LOGS */}
      {activeTab === 'logs' && (
        <LogConsole logs={logs} onClear={clearLogs} t={t} />
      )}

      {/* EDIT MODAL */}
      {editingTor && (
        <EditTORModal
          editingTor={editingTor}
          onSave={handleSaveEdit}
          onCancel={() => setEditingTor(null)}
          onChange={handleEditChange}
          t={t}
        />
      )}
    </div>
  );
}