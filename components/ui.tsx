"use client";
import { ReactNode, useEffect, useRef } from "react";
import { ArrowUpRight, Dumbbell, X } from "lucide-react";
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`card ${className}`}>{children}</section>;
}
export function SectionHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
export function Empty({
  title = "你的进步，即将开始",
  text = "记录第一次训练，让每一次努力都有迹可循。",
  action,
  compact = false,
}: {
  title?: string;
  text?: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`empty ${compact ? "compact" : ""}`}>
      <div className="empty-icon">
        <Dumbbell size={23} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const scrollY = window.scrollY;
    const original = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    ref.current?.showModal();
    document.body.style.overflow = "hidden";
    // overflow:hidden alone does not reliably lock the page behind a dialog on iOS.
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    const viewport = window.visualViewport;
    const updateHeight = () =>
      ref.current?.style.setProperty(
        "--dialog-available-height",
        `${viewport?.height ?? window.innerHeight}px`,
      );
    updateHeight();
    viewport?.addEventListener("resize", updateHeight);
    return () => {
      viewport?.removeEventListener("resize", updateHeight);
      Object.assign(document.body.style, original);
      window.scrollTo({ top: scrollY, behavior: "instant" });
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      className={`modal ${wide ? "wide" : ""}`}
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button
          type="button"
          className="icon-button"
          aria-label="关闭弹窗"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function Stat({
  label,
  value,
  unit,
  detail,
  icon,
  highlight = false,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  detail?: ReactNode;
  icon: ReactNode;
  highlight?: boolean;
}) {
  return (
    <Card className={`stat ${highlight ? "highlight" : ""}`}>
      <div className="stat-label">
        {label}
        <span>{icon}</span>
      </div>
      <div className="stat-value">
        {value}
        <small>{unit}</small>
      </div>
      <div className="stat-detail">{detail}</div>
    </Card>
  );
}
export function TextLink({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" className="text-link" onClick={onClick}>
      {children}
      <ArrowUpRight size={15} />
    </button>
  );
}
export function ErrorText({ message }: { message: string }) {
  return message ? (
    <p className="form-error" role="alert">
      {message}
    </p>
  ) : null;
}
export function Confirm({
  title,
  text,
  onClose,
  onConfirm,
  busy,
}: {
  title: string;
  text: string;
  onClose: () => void;
  onConfirm: () => void;
  busy?: boolean;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="modal-body">
        <p className="confirm-text">{text}</p>
      </div>
      <div className="modal-actions">
        <button type="button" className="button secondary" onClick={onClose}>
          取消
        </button>
        <button
          type="button"
          className="button danger"
          disabled={busy}
          onClick={onConfirm}
        >
          {busy ? "正在处理…" : "确认删除"}
        </button>
      </div>
    </Modal>
  );
}
