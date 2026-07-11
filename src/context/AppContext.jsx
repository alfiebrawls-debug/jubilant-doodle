import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api } from '../services/mockApi.js';
import { useAuth } from './AuthContext.jsx';
import { STYLES } from '../data/mockData.js';

const AppContext = createContext(null);

/**
 * Global app state: navigation, analytics, projects, and the active
 * forge pipeline (input → processing → generated package).
 */
export function AppProvider({ children }) {
  const {
    isPaid,
    canUseStyle,
    requestForgeCredit,
    refundForgeCredit,
    openPaywall,
  } = useAuth();
  const [view, setView] = useState('dashboard'); // dashboard | forge | studio
  const [analytics, setAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const [forgeStatus, setForgeStatus] = useState('idle'); // idle | processing | done | error
  const [progress, setProgress] = useState({ pct: 0, label: '' });
  const [clipPackage, setClipPackage] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.fetchAnalytics(), api.fetchProjects()])
      .then(([analyticsData, projectData]) => {
        if (cancelled) return;
        setAnalytics(analyticsData);
        setProjects(projectData);
      })
      .finally(() => {
        if (!cancelled) setIsBootstrapping(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const forge = useCallback(async ({ input, styleId }) => {
    // Entitlement gates (mirrored server-side in production):
    // premium styles need Pro+, and every forge costs one credit —
    // a free user's second attempt lands on the paywall instead.
    const style = STYLES.find((s) => s.id === styleId);
    if (style && !canUseStyle(style)) {
      openPaywall('premium-style');
      return;
    }
    if (!(await requestForgeCredit())) return;

    setForgeStatus('processing');
    setProgress({ pct: 0, label: 'Warming up the forge…' });
    try {
      const pkg = await api.forgeClipPackage({
        input,
        styleId,
        priority: isPaid, // paid tiers ride the fast lane
        onProgress: setProgress,
      });
      setClipPackage(pkg);
      setForgeStatus('done');
      setView('studio');

      // Reflect the new clip package in dashboard numbers immediately.
      setAnalytics((prev) =>
        prev
          ? {
              ...prev,
              activeProjects: prev.activeProjects + 1,
              clipsForged: prev.clipsForged + 1,
              hoursSaved: +(prev.hoursSaved + pkg.projectedStats.hoursSaved).toFixed(1),
              estimatedViewsSaved:
                prev.estimatedViewsSaved + pkg.projectedStats.estimatedViews,
            }
          : prev
      );
      setProjects((prev) => [
        {
          id: pkg.id,
          title: pkg.script.title,
          source: input.slice(0, 60),
          style: styleId,
          status: 'ready',
          clips: pkg.script.segments.length,
          createdAt: pkg.createdAt,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error('Forge failed', err);
      await refundForgeCredit(); // don't charge for a failed forge
      setForgeStatus('error');
    }
  }, [canUseStyle, requestForgeCredit, refundForgeCredit, openPaywall, isPaid]);

  const resetForge = useCallback(() => {
    setForgeStatus('idle');
    setProgress({ pct: 0, label: '' });
  }, []);

  const value = {
    view,
    setView,
    analytics,
    projects,
    isBootstrapping,
    forgeStatus,
    progress,
    clipPackage,
    forge,
    resetForge,
    exportOpen,
    setExportOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
