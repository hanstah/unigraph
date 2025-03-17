import {
  ChevronDown,
  ChevronRight,
  Home,
  Menu,
  Settings,
  X,
} from "lucide-react";
import React, { useState } from "react";
import ForceGraphRenderConfigEditor from "./components/force-graph/ForceGraphRenderConfigEditor";
import { CustomLayoutType } from "./core/layouts/CustomLayoutEngine";
import { GraphologyLayoutType } from "./core/layouts/GraphologyLayoutEngine";
import { GraphvizLayoutType } from "./core/layouts/GraphvizLayoutEngine";
import { PresetLayoutType } from "./core/layouts/LayoutEngine";
import styles from "./Sidebar.module.css";

// Define menu ID type
type MenuId = "dashboard" | "layouts" | "forceGraphSettings";

// Define menu state type
interface MenuState {
  dashboard: boolean;
  management: boolean;
  reports: boolean;
  communications: boolean;
  layouts: boolean;
  forceGraphSettings: boolean;
}

interface SidebarProps {
  onLayoutChange: (layout: string) => void;
  activeLayout: string;
  physicsMode: boolean;
  isDarkMode: boolean;
  onApplyForceGraphConfig: (config: any) => void;
  initialForceGraphConfig: any;
  position: "left" | "right"; // Add position prop
}

const Sidebar: React.FC<SidebarProps> = ({
  onLayoutChange,
  activeLayout,
  physicsMode,
  isDarkMode,
  onApplyForceGraphConfig,
  initialForceGraphConfig,
  position, // Add position prop
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<MenuState>({
    dashboard: true,
    management: false,
    reports: false,
    communications: false,
    layouts: false,
    forceGraphSettings: false,
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = (menuId: MenuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const allLayoutLabels = [
    ...Object.values(GraphvizLayoutType),
    ...Object.values(GraphologyLayoutType),
    ...Object.values(CustomLayoutType),
    ...Object.values(PresetLayoutType),
  ];

  return (
    <div
      className={styles.sidebar}
      style={{
        width: isOpen ? "250px" : "60px",
        position: "fixed",
        top: "50px", // Adjust this value to match the height of the UniAppToolbar
        [position]: 0, // Use position prop to determine left or right
        height: "calc(100vh - 50px)", // Adjust this value to match the height of the UniAppToolbar
        zIndex: 1000,
      }}
    >
      {/* Sidebar Header */}
      <div className={styles.sidebarHeader}>
        {isOpen && <h1 className={styles.sidebarTitle}>Unigraph</h1>}
        <button
          onClick={toggleSidebar}
          className={styles.toggleButton}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Menu */}
      <div className={styles.menuContainer}>
        <nav className={styles.nav}>
          {/* Dashboard Menu */}
          <div className={styles.menuItem}>
            <button
              className={styles.menuButton}
              onClick={() => isOpen && toggleMenu("dashboard")}
            >
              <Home size={20} className={styles.menuIcon} />
              {isOpen && (
                <>
                  <span className={styles.menuText}>Dashboard</span>
                  {expandedMenus.dashboard ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </>
              )}
            </button>
            {isOpen && expandedMenus.dashboard && (
              <div className={styles.submenu}>
                <a href="#" className={styles.submenuItem}>
                  Overview
                </a>
                <a href="#" className={styles.submenuItem}>
                  Analytics
                </a>
                <a href="#" className={styles.submenuItem}>
                  Statistics
                </a>
              </div>
            )}
          </div>
          {/* Layouts Menu */}
          <div className={styles.menuItem}>
            <button
              className={styles.menuButton}
              onClick={() => isOpen && toggleMenu("layouts")}
            >
              <Settings size={20} className={styles.menuIcon} />
              {isOpen && (
                <>
                  <span className={styles.menuText}>Layouts</span>
                  {expandedMenus.layouts ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </>
              )}
            </button>
            {isOpen && expandedMenus.layouts && (
              <div className={styles.submenu}>
                {allLayoutLabels.map((layout) => (
                  <button
                    key={layout}
                    className={`${styles.layoutButton} ${!physicsMode && activeLayout === layout ? styles.active : ""}`}
                    onClick={() => onLayoutChange(layout)}
                  >
                    {layout}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ForceGraph Settings Menu */}
          <div className={styles.menuItem}>
            <button
              className={styles.menuButton}
              onClick={() => isOpen && toggleMenu("forceGraphSettings")}
            >
              <Settings size={20} className={styles.menuIcon} />
              {isOpen && (
                <>
                  <span className={styles.menuText}>ForceGraph Settings</span>
                  {expandedMenus.forceGraphSettings ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </>
              )}
            </button>
            {isOpen && expandedMenus.forceGraphSettings && (
              <div className={styles.submenu}>
                <ForceGraphRenderConfigEditor
                  onApply={onApplyForceGraphConfig}
                  isDarkMode={isDarkMode}
                  initialConfig={initialForceGraphConfig}
                />
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
