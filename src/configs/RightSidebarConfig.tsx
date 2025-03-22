import { Info, List, Settings2, Table2, ZoomIn } from "lucide-react";
import React from "react";
import ForceGraphLayoutRadio from "../components/force-graph/ForceGraphLayoutRadio";
import styles from "../Sidebar.module.css";
import { getActiveFilter } from "../store/activeFilterStore";
import {
  getActiveLayout,
  getCurrentSceneGraph,
  getForceGraph3dLayoutMode,
  setForceGraph3dLayoutMode,
} from "../store/appConfigStore";

export interface SubMenuItem {
  label: string;
  onClick?: () => void;
  content?: React.ReactNode;
  customRender?: React.ReactNode;
}

export interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  content?: React.ReactNode;
  subMenus?: SubMenuItem[];
}

export const createDefaultRightMenus = (
  renderLegends: () => React.ReactNode,
  isForceGraph3dActive: boolean,
  isDarkMode: boolean
): MenuItem[] => [
  {
    id: "legends",
    icon: <List size={20} className={styles.menuIcon} />,
    label: "Legends",
    content: (
      <div className={styles.optionsPanelContainer}>{renderLegends()}</div>
    ),
  },
  {
    id: "settings",
    icon: <Settings2 size={20} className={styles.menuIcon} />,
    label: "Settings",
    content: (
      <div className={styles.optionsPanelContainer}>
        {isForceGraph3dActive && (
          <ForceGraphLayoutRadio
            layout={getForceGraph3dLayoutMode()}
            onLayoutChange={setForceGraph3dLayoutMode}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    ),
  },
  {
    id: "info",
    icon: <Info size={20} className={styles.menuIcon} />,
    label: "Info",
    content: (
      <SceneGraphInfoPanel
        sceneGraphName={getCurrentSceneGraph().getMetadata().name ?? ""}
        activeLayout={getActiveLayout()}
        activeFilter={getActiveFilter()?.name}
      />
    ),
  },
];

// Info panel component for SceneGraph details
const SceneGraphInfoPanel = ({
  sceneGraphName,
  activeLayout,
  activeFilter,
}: {
  sceneGraphName: string;
  activeLayout: string;
  activeFilter?: string | null;
}) => (
  <div className={styles.infoPanel}>
    <div className={styles.infoSection}>
      <h4 className={styles.infoSectionTitle}>SceneGraph</h4>
      <div className={styles.infoSectionValue}>
        {sceneGraphName || "Untitled"}
      </div>
    </div>
    <div className={styles.infoSection}>
      <h4 className={styles.infoSectionTitle}>Active Layout</h4>
      <div className={styles.infoSectionValue}>{activeLayout}</div>
    </div>
    {activeFilter && (
      <div className={styles.infoSection}>
        <h4 className={styles.infoSectionTitle}>Active Filter</h4>
        <div className={styles.infoSectionValue} style={{ color: "orange" }}>
          {activeFilter}
        </div>
      </div>
    )}
  </div>
);

export const rightFooterContent = (
  isOpen: boolean,
  actions?: {
    onFitToView: () => void;
    onViewEntities?: () => void;
    details?: {
      sceneGraphName: string;
      activeLayout: string;
      activeFilter?: string | null;
    };
  }
) => {
  if (!actions) return null;

  return (
    <div className={styles.footerIconGroup}>
      <button
        className={styles.footerIconButton}
        onClick={actions.onViewEntities}
        title="View Entities"
      >
        <Table2 size={16} />
      </button>
      <button
        className={styles.footerIconButton}
        onClick={actions.onFitToView}
        title="Fit to View"
      >
        <ZoomIn size={16} />
      </button>
    </div>
  );
};
