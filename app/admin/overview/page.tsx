'use client';

import { IncidentBanner } from "@/components/overview/IncidentBanner";
import { IncidentTimeline } from "@/components/overview/IncidentTimeline";
import { LatencyDistribution } from "@/components/overview/LatencyDistribution";
import { LatencyTrendSection } from "@/components/overview/LatencyTrendSection";
import { NodeStatusGrid } from "@/components/overview/NodeStatusGrid";
import { OverviewHeader } from "@/components/overview/OverviewHeader";
import { useOverview } from "@/components/overview/useOverview";
import { useApp } from "@/context/AppContext";
import { overviewi18n } from "@/public/mockdata/i18n/overview";

export default function OverviewPage() {
  const { lang: contextLang } = useApp();
  const lang = (contextLang?.toLowerCase() as 'en' | 'th') || 'en';
  const t = overviewi18n[lang];

  const {
    activeNodeKey,
    visibleNodes,
    handleNodeSelect,
    handlePingAlert,
    incidents,
    nodes,
    latencyData,
  } = useOverview();

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 w-full space-y-8 bg-base-100 text-base-content min-h-screen">
      <OverviewHeader t={t} onPingClick={handlePingAlert} />

      <IncidentBanner t={t} />

      <NodeStatusGrid
        nodes={nodes}
        activeNodeKey={activeNodeKey}
        onNodeSelect={handleNodeSelect}
        t={t}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LatencyTrendSection
          data={latencyData}
          nodes={nodes}
          activeNodeKey={activeNodeKey}
          visibleNodes={visibleNodes}
          onNodeFilter={handleNodeSelect}
          t={t}
        />

        <LatencyDistribution nodes={visibleNodes} t={t} />
      </div>

      <IncidentTimeline incidents={incidents} t={t} />
    </div>
  );
}