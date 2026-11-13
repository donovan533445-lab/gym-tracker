"use client";
import {
  LayoutDashboard,
  Dumbbell,
  TrendingUp,
  Scale,
  Menu,
} from "lucide-react";
import type { Page } from "./context";
export default function MobileNavigation({
  page,
  onNavigate,
  onMenu,
}: {
  page: Page;
  onNavigate: (page: Page) => void;
  onMenu: () => void;
}) {
  const tabs = [
    { id: "dashboard", name: "首页", Icon: LayoutDashboard },
    { id: "workout", name: "训练", Icon: Dumbbell },
    { id: "analytics", name: "分析", Icon: TrendingUp },
    { id: "body", name: "身体", Icon: Scale },
  ] as const;
  return (
    <nav className="mobile-bottom-nav" aria-label="手机快捷导航">
      {tabs.map(({ id, name, Icon }) => (
        <button
          type="button"
          key={id}
          onClick={() => onNavigate(id)}
          className={page === id ? "active" : ""}
          aria-current={page === id ? "page" : undefined}
        >
          <Icon size={20} />
          <span>{name}</span>
        </button>
      ))}
      <button
        type="button"
        className={
          ["records", "programs", "settings"].includes(page) ? "active" : ""
        }
        onClick={onMenu}
      >
        <Menu size={20} />
        <span>更多</span>
      </button>
    </nav>
  );
}
