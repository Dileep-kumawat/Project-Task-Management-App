/**
 * TaskFlow - Feature-based Kanban App
 *
 * Architecture: UI → Hook → State → API (four layers)
 *
 * Feature Folders (simulated in one file):
 * ├── features/
 * │   ├── projects/
 * │   │   ├── api/projectsApi.js
 * │   │   ├── state/projectsStore.js
 * │   │   ├── hooks/useProjects.js
 * │   │   └── ui/ ProjectList, ProjectCard, NewProjectModal
 * │   ├── board/
 * │   │   ├── api/boardApi.js
 * │   │   ├── state/boardStore.js
 * │   │   ├── hooks/useBoard.js
 * │   │   └── ui/ KanbanBoard, KanbanColumn, TaskCard
 * │   └── tasks/
 * │       ├── api/tasksApi.js
 * │       ├── state/tasksStore.js
 * │       ├── hooks/useTasks.js
 * │       └── ui/ CreateTaskModal, TaskDetail
 * └── shared/
 *     ├── ui/ Header, Sidebar, Badge, Avatar, Button
 *     └── styles/ (SCSS variables & tokens)
 */

import { useState, useCallback, useMemo, useEffect, useRef } from "react";

/* ============================================================
   SCSS-IN-JS — mirrors what SCSS modules would generate.
   Variables follow SCSS token naming conventions.
   ============================================================ */
const STYLES = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

//   /* ── SCSS $variables as CSS custom properties ──────────── */
//   :root {
//     --font-display: 'Space Mono', monospace;
//     --font-body: 'DM Sans', sans-serif;

//     --color-bg: #f5f4f0;
//     --color-surface: #ffffff;
//     --color-surface-hover: #fafaf8;
//     --color-border: #e8e6e0;
//     --color-border-strong: #d4d1c8;

//     --color-text-primary: #1a1916;
//     --color-text-secondary: #6b6960;
//     --color-text-muted: #9e9b91;

//     --color-accent: #2d4a3e;
//     --color-accent-light: #e8f0ec;
//     --color-accent-hover: #233c32;

//     --color-todo-badge: #e8e6e0;
//     --color-todo-text: #4a4840;
//     --color-inprogress-badge: #e8f0ec;
//     --color-inprogress-text: #2d4a3e;
//     --color-done-badge: #f5f0e8;
//     --color-done-text: #6b5a2d;

//     --color-high: #f0e8e8;
//     --color-high-text: #7a2d2d;
//     --color-medium: #f5f0e0;
//     --color-medium-text: #7a6020;
//     --color-low: #e8f0ec;
//     --color-low-text: #2d5a3e;

//     --radius-sm: 6px;
//     --radius-md: 10px;
//     --radius-lg: 14px;
//     --radius-xl: 20px;
//     --radius-full: 9999px;

//     --shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
//     --shadow-modal: 0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08);

//     --transition: 150ms ease;
//   }

//   * { box-sizing: border-box; margin: 0; padding: 0; }

//   body {
//     font-family: var(--font-body);
//     background: var(--color-bg);
//     color: var(--color-text-primary);
//     font-size: 14px;
//     line-height: 1.6;
//     -webkit-font-smoothing: antialiased;
//   }

//   /* ── Layout ─────────────────────────────────────────────── */
//   .app-shell {
//     display: flex;
//     height: 100vh;
//     overflow: hidden;
//   }

//   /* ── Sidebar ─────────────────────────────────────────────── */
//   .sidebar {
//     width: 220px;
//     background: var(--color-surface);
//     border-right: 1px solid var(--color-border);
//     display: flex;
//     flex-direction: column;
//     flex-shrink: 0;
//   }
//   .sidebar-logo {
//     padding: 20px 20px 16px;
//     border-bottom: 1px solid var(--color-border);
//   }
//   .sidebar-logo h1 {
//     font-family: var(--font-display);
//     font-size: 15px;
//     font-weight: 700;
//     letter-spacing: -0.02em;
//     color: var(--color-text-primary);
//   }
//   .sidebar-logo span {
//     color: var(--color-accent);
//   }
//   .sidebar-nav {
//     padding: 12px 10px;
//     display: flex;
//     flex-direction: column;
//     gap: 2px;
//     flex: 1;
//   }
//   .nav-item {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     padding: 8px 10px;
//     border-radius: var(--radius-md);
//     font-size: 13px;
//     font-weight: 500;
//     color: var(--color-text-secondary);
//     cursor: pointer;
//     border: none;
//     background: none;
//     width: 100%;
//     text-align: left;
//     transition: background var(--transition), color var(--transition);
//   }
//   .nav-item:hover { background: var(--color-bg); color: var(--color-text-primary); }
//   .nav-item.active { background: var(--color-accent-light); color: var(--color-accent); }
//   .nav-icon { font-size: 15px; width: 20px; text-align: center; }
//   .sidebar-footer {
//     padding: 12px;
//     border-top: 1px solid var(--color-border);
//   }
//   .user-chip {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     padding: 8px;
//     border-radius: var(--radius-md);
//   }
//   .user-avatar {
//     width: 28px; height: 28px;
//     border-radius: var(--radius-full);
//     background: var(--color-accent);
//     color: white;
//     font-size: 11px;
//     font-weight: 600;
//     display: flex; align-items: center; justify-content: center;
//     flex-shrink: 0;
//   }
//   .user-name { font-size: 12px; font-weight: 500; color: var(--color-text-secondary); }

//   /* ── Main area ───────────────────────────────────────────── */
//   .main-area {
//     flex: 1;
//     display: flex;
//     flex-direction: column;
//     overflow: hidden;
//   }

//   /* ── Top bar ─────────────────────────────────────────────── */
//   .topbar {
//     height: 56px;
//     background: var(--color-surface);
//     border-bottom: 1px solid var(--color-border);
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 0 24px;
//     flex-shrink: 0;
//   }
//   .topbar-left {
//     display: flex;
//     align-items: center;
//     gap: 12px;
//   }
//   .back-btn {
//     display: flex; align-items: center; justify-content: center;
//     width: 32px; height: 32px;
//     border: 1px solid var(--color-border);
//     border-radius: var(--radius-md);
//     background: none;
//     cursor: pointer;
//     color: var(--color-text-secondary);
//     font-size: 16px;
//     transition: all var(--transition);
//   }
//   .back-btn:hover { border-color: var(--color-border-strong); color: var(--color-text-primary); }
//   .topbar-title { font-weight: 600; font-size: 14px; }
//   .topbar-subtitle { font-size: 12px; color: var(--color-text-muted); }
//   .topbar-actions { display: flex; align-items: center; gap: 8px; }

//   /* ── Buttons ─────────────────────────────────────────────── */
//   .btn {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 7px 14px;
//     border-radius: var(--radius-md);
//     font-family: var(--font-body);
//     font-size: 13px;
//     font-weight: 500;
//     cursor: pointer;
//     border: 1px solid transparent;
//     transition: all var(--transition);
//     white-space: nowrap;
//   }
//   .btn-primary {
//     background: var(--color-accent);
//     color: white;
//     border-color: var(--color-accent);
//   }
//   .btn-primary:hover { background: var(--color-accent-hover); border-color: var(--color-accent-hover); }
//   .btn-ghost {
//     background: none;
//     color: var(--color-text-secondary);
//     border-color: var(--color-border);
//   }
//   .btn-ghost:hover { background: var(--color-bg); color: var(--color-text-primary); }
//   .btn-danger {
//     background: none;
//     color: #9b3535;
//     border-color: #e8d0d0;
//   }
//   .btn-danger:hover { background: #fdf0f0; }
//   .btn-icon {
//     width: 32px; height: 32px; padding: 0;
//     display: inline-flex; align-items: center; justify-content: center;
//     background: none;
//     color: var(--color-text-muted);
//     border: 1px solid transparent;
//     border-radius: var(--radius-md);
//     cursor: pointer;
//     font-size: 15px;
//     transition: all var(--transition);
//   }
//   .btn-icon:hover { background: var(--color-bg); color: var(--color-text-primary); border-color: var(--color-border); }

//   /* ── Analytics Bar ───────────────────────────────────────── */
//   .analytics-bar {
//     display: flex;
//     gap: 12px;
//     padding: 20px 24px 0;
//     flex-shrink: 0;
//   }
//   .stat-card {
//     background: var(--color-surface);
//     border: 1px solid var(--color-border);
//     border-radius: var(--radius-lg);
//     padding: 14px 18px;
//     flex: 1;
//   }
//   .stat-label {
//     font-size: 11px;
//     font-weight: 600;
//     letter-spacing: 0.06em;
//     text-transform: uppercase;
//     color: var(--color-text-muted);
//   }
//   .stat-value {
//     font-family: var(--font-display);
//     font-size: 26px;
//     font-weight: 700;
//     color: var(--color-text-primary);
//     margin-top: 4px;
//     line-height: 1;
//   }
//   .stat-card.todo .stat-value { color: var(--color-todo-text); }
//   .stat-card.inprogress .stat-value { color: var(--color-inprogress-text); }
//   .stat-card.done .stat-value { color: #9b7530; }

//   /* ── Progress bar inside stat ────────────────────────────── */
//   .progress-bar-wrap {
//     margin-top: 8px;
//     height: 3px;
//     background: var(--color-border);
//     border-radius: var(--radius-full);
//     overflow: hidden;
//   }
//   .progress-bar-fill {
//     height: 100%;
//     border-radius: var(--radius-full);
//     background: var(--color-accent);
//     transition: width 0.4s ease;
//   }

//   /* ── Kanban board ────────────────────────────────────────── */
//   .board-area {
//     flex: 1;
//     overflow: hidden;
//     padding: 20px 24px 24px;
//     display: flex;
//     gap: 16px;
//   }

//   /* ── Kanban column ───────────────────────────────────────── */
//   .kanban-column {
//     flex: 1;
//     display: flex;
//     flex-direction: column;
//     background: var(--color-surface);
//     border: 1px solid var(--color-border);
//     border-radius: var(--radius-xl);
//     overflow: hidden;
//     min-width: 0;
//   }
//   .column-header {
//     padding: 14px 16px 12px;
//     border-bottom: 1px solid var(--color-border);
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     flex-shrink: 0;
//   }
//   .column-header-left { display: flex; align-items: center; gap: 8px; }
//   .column-title {
//     font-family: var(--font-display);
//     font-size: 11px;
//     font-weight: 700;
//     letter-spacing: 0.08em;
//     text-transform: uppercase;
//     color: var(--color-text-secondary);
//   }
//   .column-count {
//     font-size: 11px;
//     font-weight: 600;
//     padding: 2px 7px;
//     border-radius: var(--radius-full);
//   }
//   .count-todo { background: var(--color-todo-badge); color: var(--color-todo-text); }
//   .count-inprogress { background: var(--color-inprogress-badge); color: var(--color-inprogress-text); }
//   .count-done { background: var(--color-done-badge); color: var(--color-done-text); }

//   .column-body {
//     flex: 1;
//     overflow-y: auto;
//     padding: 12px;
//     display: flex;
//     flex-direction: column;
//     gap: 8px;
//   }
//   .column-body::-webkit-scrollbar { width: 4px; }
//   .column-body::-webkit-scrollbar-track { background: transparent; }
//   .column-body::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 4px; }

//   .drop-zone {
//     border: 1.5px dashed var(--color-border);
//     border-radius: var(--radius-lg);
//     padding: 28px 16px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: var(--color-text-muted);
//     font-size: 12px;
//     text-align: center;
//     margin-top: 4px;
//     transition: all var(--transition);
//   }
//   .drop-zone.drag-over {
//     border-color: var(--color-accent);
//     background: var(--color-accent-light);
//     color: var(--color-accent);
//   }

//   /* ── Task card ───────────────────────────────────────────── */
//   .task-card {
//     background: var(--color-bg);
//     border: 1px solid var(--color-border);
//     border-radius: var(--radius-lg);
//     padding: 12px 14px;
//     cursor: grab;
//     transition: all var(--transition);
//     position: relative;
//   }
//   .task-card:hover {
//     border-color: var(--color-border-strong);
//     box-shadow: var(--shadow-card);
//     background: var(--color-surface);
//   }
//   .task-card:active { cursor: grabbing; }
//   .task-card.dragging {
//     opacity: 0.5;
//     box-shadow: var(--shadow-modal);
//   }
//   .task-card.done-card { opacity: 0.7; }

//   .task-card-top {
//     display: flex;
//     align-items: flex-start;
//     justify-content: space-between;
//     margin-bottom: 8px;
//   }
//   .task-card-actions {
//     display: flex;
//     gap: 4px;
//     opacity: 0;
//     transition: opacity var(--transition);
//   }
//   .task-card:hover .task-card-actions { opacity: 1; }

//   .task-title {
//     font-size: 13px;
//     font-weight: 500;
//     line-height: 1.4;
//     color: var(--color-text-primary);
//     margin-bottom: 6px;
//   }
//   .task-title.completed {
//     text-decoration: line-through;
//     color: var(--color-text-muted);
//   }
//   .task-desc {
//     font-size: 12px;
//     color: var(--color-text-secondary);
//     line-height: 1.5;
//     margin-bottom: 8px;
//     display: -webkit-box;
//     -webkit-line-clamp: 2;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//   }
//   .task-card-bottom {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     margin-top: 10px;
//   }
//   .task-meta { display: flex; align-items: center; gap: 6px; }
//   .task-assignee {
//     width: 22px; height: 22px;
//     border-radius: var(--radius-full);
//     font-size: 9px;
//     font-weight: 700;
//     display: flex; align-items: center; justify-content: center;
//     border: 2px solid var(--color-surface);
//     color: white;
//   }
//   .task-date {
//     font-size: 11px;
//     color: var(--color-text-muted);
//     display: flex; align-items: center; gap: 4px;
//   }
//   .task-date.overdue { color: #9b3535; }

//   /* ── Priority badge ──────────────────────────────────────── */
//   .priority-badge {
//     font-size: 10px;
//     font-weight: 700;
//     letter-spacing: 0.05em;
//     text-transform: uppercase;
//     padding: 3px 8px;
//     border-radius: var(--radius-sm);
//   }
//   .priority-high { background: var(--color-high); color: var(--color-high-text); }
//   .priority-medium { background: var(--color-medium); color: var(--color-medium-text); }
//   .priority-low { background: var(--color-low); color: var(--color-low-text); }

//   /* ── Status indicator dot ────────────────────────────────── */
//   .status-dot {
//     width: 8px; height: 8px;
//     border-radius: var(--radius-full);
//     flex-shrink: 0;
//   }
//   .status-dot.todo { background: #b5b0a5; }
//   .status-dot.inprogress { background: var(--color-accent); }
//   .status-dot.done { background: #c4a34e; }

//   /* ── Modal overlay ───────────────────────────────────────── */
//   .modal-overlay {
//     position: fixed; inset: 0;
//     background: rgba(10, 10, 8, 0.55);
//     backdrop-filter: blur(3px);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     z-index: 1000;
//     padding: 24px;
//     animation: fadeIn 0.15s ease;
//   }
//   @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

//   .modal {
//     background: var(--color-surface);
//     border-radius: var(--radius-xl);
//     border: 1px solid var(--color-border);
//     width: 100%;
//     max-width: 480px;
//     box-shadow: var(--shadow-modal);
//     animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
//     overflow: hidden;
//   }
//   @keyframes slideUp {
//     from { transform: translateY(12px); opacity: 0; }
//     to { transform: translateY(0); opacity: 1; }
//   }
//   .modal-header {
//     padding: 20px 22px 16px;
//     border-bottom: 1px solid var(--color-border);
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//   }
//   .modal-title { font-weight: 600; font-size: 15px; }
//   .modal-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 16px; }
//   .modal-footer {
//     padding: 16px 22px;
//     border-top: 1px solid var(--color-border);
//     display: flex;
//     justify-content: flex-end;
//     gap: 8px;
//     background: var(--color-bg);
//   }

//   /* ── Form elements ───────────────────────────────────────── */
//   .form-group { display: flex; flex-direction: column; gap: 6px; }
//   .form-label {
//     font-size: 12px;
//     font-weight: 600;
//     color: var(--color-text-secondary);
//     letter-spacing: 0.03em;
//   }
//   .form-input, .form-textarea, .form-select {
//     font-family: var(--font-body);
//     font-size: 13px;
//     padding: 9px 12px;
//     border: 1px solid var(--color-border);
//     border-radius: var(--radius-md);
//     background: var(--color-bg);
//     color: var(--color-text-primary);
//     outline: none;
//     transition: border-color var(--transition), box-shadow var(--transition);
//     width: 100%;
//     resize: none;
//   }
//   .form-input::placeholder, .form-textarea::placeholder { color: var(--color-text-muted); }
//   .form-input:focus, .form-textarea:focus, .form-select:focus {
//     border-color: var(--color-accent);
//     box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
//     background: var(--color-surface);
//   }
//   .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

//   /* ── Project list view ───────────────────────────────────── */
//   .projects-page {
//     flex: 1;
//     overflow-y: auto;
//     padding: 24px;
//   }
//   .projects-header {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     margin-bottom: 20px;
//   }
//   .projects-title { font-size: 20px; font-weight: 600; }
//   .projects-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//     gap: 14px;
//   }
//   .project-card {
//     background: var(--color-surface);
//     border: 1px solid var(--color-border);
//     border-radius: var(--radius-xl);
//     padding: 20px;
//     cursor: pointer;
//     transition: all var(--transition);
//     position: relative;
//     overflow: hidden;
//   }
//   .project-card:hover {
//     border-color: var(--color-border-strong);
//     box-shadow: var(--shadow-card);
//     transform: translateY(-1px);
//   }
//   .project-card::before {
//     content: '';
//     position: absolute;
//     top: 0; left: 0; right: 0;
//     height: 3px;
//   }
//   .project-card.accent-green::before { background: var(--color-accent); }
//   .project-card.accent-amber::before { background: #c4a34e; }
//   .project-card.accent-blue::before { background: #3d6ea8; }
//   .project-card.accent-rose::before { background: #a84d4d; }

//   .project-status-pill {
//     font-size: 10px;
//     font-weight: 700;
//     letter-spacing: 0.05em;
//     text-transform: uppercase;
//     padding: 3px 9px;
//     border-radius: var(--radius-full);
//     display: inline-flex;
//     align-items: center;
//     gap: 5px;
//     margin-bottom: 12px;
//   }
//   .status-active { background: var(--color-inprogress-badge); color: var(--color-inprogress-text); }
//   .status-planning { background: #e8eef5; color: #3d5a7a; }
//   .status-paused { background: #f5f0e0; color: #7a6020; }
//   .project-name { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
//   .project-desc { font-size: 12px; color: var(--color-text-secondary); line-height: 1.5; margin-bottom: 14px; }
//   .project-meta {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     font-size: 11px;
//     color: var(--color-text-muted);
//   }
//   .project-task-count {
//     display: flex;
//     align-items: center;
//     gap: 4px;
//     font-weight: 500;
//   }

//   /* ── Empty state ─────────────────────────────────────────── */
//   .empty-state {
//     display: flex; flex-direction: column;
//     align-items: center; justify-content: center;
//     padding: 40px 20px;
//     color: var(--color-text-muted);
//     text-align: center;
//     gap: 8px;
//   }
//   .empty-icon { font-size: 28px; margin-bottom: 4px; }
//   .empty-text { font-size: 12px; }

//   /* ── Toast ───────────────────────────────────────────────── */
//   .toast-container {
//     position: fixed;
//     bottom: 24px; right: 24px;
//     z-index: 2000;
//     display: flex; flex-direction: column; gap: 8px;
//     pointer-events: none;
//   }
//   .toast {
//     background: var(--color-text-primary);
//     color: var(--color-bg);
//     padding: 10px 16px;
//     border-radius: var(--radius-md);
//     font-size: 13px;
//     font-weight: 500;
//     display: flex; align-items: center; gap: 8px;
//     animation: toastIn 0.2s ease;
//     min-width: 200px;
//   }
//   @keyframes toastIn { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
//   .toast-success { background: var(--color-accent); }
//   .toast-error { background: #7a2d2d; }

//   /* ── Confirm dialog ──────────────────────────────────────── */
//   .confirm-modal { max-width: 360px; }
//   .confirm-msg { font-size: 13px; color: var(--color-text-secondary); line-height: 1.6; }

//   /* ── Scrollbar global ────────────────────────────────────── */
//   * { scrollbar-width: thin; scrollbar-color: var(--color-border) transparent; }
`;

/* ============================================================
   LAYER 1 — API
   Simulates async persistence (localStorage-backed)
   ============================================================ */

// features/projects/api/projectsApi.js
const projectsApi = {
  async list() {
    await delay(80);
    return JSON.parse(localStorage.getItem("tf_projects") || "null") || defaultProjects();
  },
  async create(data) {
    await delay(120);
    const projects = JSON.parse(localStorage.getItem("tf_projects") || "null") || defaultProjects();
    const newProject = { id: uid(), ...data, createdAt: new Date().toISOString(), taskCount: 0 };
    const updated = [...projects, newProject];
    localStorage.setItem("tf_projects", JSON.stringify(updated));
    return newProject;
  },
  async delete(id) {
    await delay(80);
    const projects = JSON.parse(localStorage.getItem("tf_projects") || "null") || defaultProjects();
    const updated = projects.filter(p => p.id !== id);
    localStorage.setItem("tf_projects", JSON.stringify(updated));
  }
};

// features/tasks/api/tasksApi.js
const tasksApi = {
  async list(projectId) {
    await delay(80);
    const all = JSON.parse(localStorage.getItem(`tf_tasks_${projectId}`) || "null");
    return all || defaultTasks(projectId);
  },
  async create(projectId, data) {
    await delay(100);
    const tasks = JSON.parse(localStorage.getItem(`tf_tasks_${projectId}`) || "null") || defaultTasks(projectId);
    const newTask = { id: uid(), projectId, ...data, createdAt: new Date().toISOString() };
    const updated = [...tasks, newTask];
    localStorage.setItem(`tf_tasks_${projectId}`, JSON.stringify(updated));
    return newTask;
  },
  async update(projectId, taskId, patch) {
    await delay(80);
    const tasks = JSON.parse(localStorage.getItem(`tf_tasks_${projectId}`) || "null") || defaultTasks(projectId);
    const updated = tasks.map(t => t.id === taskId ? { ...t, ...patch } : t);
    localStorage.setItem(`tf_tasks_${projectId}`, JSON.stringify(updated));
    return updated.find(t => t.id === taskId);
  },
  async delete(projectId, taskId) {
    await delay(80);
    const tasks = JSON.parse(localStorage.getItem(`tf_tasks_${projectId}`) || "null") || defaultTasks(projectId);
    const updated = tasks.filter(t => t.id !== taskId);
    localStorage.setItem(`tf_tasks_${projectId}`, JSON.stringify(updated));
  }
};

/* ============================================================
   LAYER 2 — STATE (Zustand-like store via useState/useReducer)
   features/projects/state/projectsStore.js
   features/tasks/state/tasksStore.js
   ============================================================ */

// Shared context-free store pattern (simulates Zustand slices)
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(l => l(state));
  };
  const getState = () => state;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  return { dispatch, getState, subscribe };
}

const projectsReducer = (state, action) => {
  switch (action.type) {
    case "SET_PROJECTS": return { ...state, projects: action.payload, loading: false };
    case "ADD_PROJECT": return { ...state, projects: [...state.projects, action.payload] };
    case "DELETE_PROJECT": return { ...state, projects: state.projects.filter(p => p.id !== action.payload) };
    case "SET_LOADING": return { ...state, loading: action.payload };
    default: return state;
  }
};

const tasksReducer = (state, action) => {
  switch (action.type) {
    case "SET_TASKS": return { ...state, tasks: action.payload, loading: false };
    case "ADD_TASK": return { ...state, tasks: [...state.tasks, action.payload] };
    case "UPDATE_TASK": return {
      ...state,
      tasks: state.tasks.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t)
    };
    case "DELETE_TASK": return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case "SET_LOADING": return { ...state, loading: action.payload };
    default: return state;
  }
};

const projectsStore = createStore(projectsReducer, { projects: [], loading: true });
const tasksStore = createStore(tasksReducer, { tasks: [], loading: true });

/* ============================================================
   LAYER 3 — HOOKS
   features/projects/hooks/useProjects.js
   features/tasks/hooks/useTasks.js
   ============================================================ */

function useStore(store) {
  const [state, setState] = useState(store.getState());
  useEffect(() => {
    const unsub = store.subscribe(setState);
    return unsub;
  }, [store]);
  return state;
}

function useProjects() {
  const { projects, loading } = useStore(projectsStore);

  useEffect(() => {
    projectsApi.list().then(data => {
      projectsStore.dispatch({ type: "SET_PROJECTS", payload: data });
    });
  }, []);

  const createProject = useCallback(async (data) => {
    const p = await projectsApi.create(data);
    projectsStore.dispatch({ type: "ADD_PROJECT", payload: p });
    return p;
  }, []);

  const deleteProject = useCallback(async (id) => {
    await projectsApi.delete(id);
    projectsStore.dispatch({ type: "DELETE_PROJECT", payload: id });
  }, []);

  return { projects, loading, createProject, deleteProject };
}

function useTasks(projectId) {
  const { tasks, loading } = useStore(tasksStore);

  useEffect(() => {
    if (!projectId) return;
    tasksStore.dispatch({ type: "SET_LOADING", payload: true });
    tasksApi.list(projectId).then(data => {
      tasksStore.dispatch({ type: "SET_TASKS", payload: data });
    });
  }, [projectId]);

  const createTask = useCallback(async (data) => {
    const t = await tasksApi.create(projectId, data);
    tasksStore.dispatch({ type: "ADD_TASK", payload: t });
    return t;
  }, [projectId]);

  const updateTask = useCallback(async (taskId, patch) => {
    const t = await tasksApi.update(projectId, taskId, patch);
    tasksStore.dispatch({ type: "UPDATE_TASK", payload: t });
    return t;
  }, [projectId]);

  const deleteTask = useCallback(async (taskId) => {
    await tasksApi.delete(projectId, taskId);
    tasksStore.dispatch({ type: "DELETE_TASK", payload: taskId });
  }, [projectId]);

  const moveTask = useCallback(async (taskId, newStatus) => {
    return updateTask(taskId, { status: newStatus });
  }, [updateTask]);

  const tasksByStatus = useMemo(() => ({
    todo: tasks.filter(t => t.status === "todo"),
    inprogress: tasks.filter(t => t.status === "inprogress"),
    done: tasks.filter(t => t.status === "done"),
  }), [tasks]);

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    inprogress: tasks.filter(t => t.status === "inprogress").length,
    done: tasks.filter(t => t.status === "done").length,
  }), [tasks]);

  return { tasks, tasksByStatus, stats, loading, createTask, updateTask, deleteTask, moveTask };
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((message, type = "success") => {
    const id = uid();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);
  return { toasts, show };
}

/* ============================================================
   LAYER 4 — UI COMPONENTS
   ============================================================ */

// shared/ui/Toast.jsx
function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.type === "success" ? "✓" : "✕"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// shared/ui/ConfirmModal.jsx
function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal confirm-modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn-icon" onClick={onCancel}>✕</button>
        </div>
        <div className="modal-body">
          <p className="confirm-msg">{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// features/tasks/ui/CreateTaskModal.jsx
function CreateTaskModal({ onClose, onSave, initialStatus = "todo" }) {
  const [form, setForm] = useState({
    title: "", description: "", priority: "medium",
    status: initialStatus, assignee: "JS", dueDate: ""
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">New Task</span>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Task title *</label>
              <input className="form-input" placeholder="What needs to be done?"
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                autoFocus required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows={3} placeholder="Add details..."
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Assignee</label>
                <select className="form-select" value={form.assignee}
                  onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}>
                  <option value="JS">JS — Jamie S.</option>
                  <option value="AK">AK — Anita K.</option>
                  <option value="ML">ML — Marcus L.</option>
                  <option value="RN">RN — Riya N.</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due date</label>
                <input className="form-input" type="date" value={form.dueDate}
                  onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// features/tasks/ui/EditTaskModal.jsx
function EditTaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState({ ...task });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(task.id, form);
    setSaving(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Edit Task</span>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Task title *</label>
              <input className="form-input" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows={3} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Assignee</label>
                <select className="form-select" value={form.assignee}
                  onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}>
                  <option value="JS">JS — Jamie S.</option>
                  <option value="AK">AK — Anita K.</option>
                  <option value="ML">ML — Marcus L.</option>
                  <option value="RN">RN — Riya N.</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due date</label>
                <input className="form-input" type="date" value={form.dueDate || ""}
                  onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// features/tasks/ui/TaskCard.jsx
function TaskCard({ task, onEdit, onDelete, onMove }) {
  const [dragging, setDragging] = useState(false);

  const avatarColors = {
    JS: "#2d4a3e", AK: "#3d6ea8", ML: "#7a5020", RN: "#6b3570"
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <article
      className={`task-card ${task.status === "done" ? "done-card" : ""} ${dragging ? "dragging" : ""}`}
      draggable
      onDragStart={e => { setDragging(true); e.dataTransfer.setData("taskId", task.id); }}
      onDragEnd={() => setDragging(false)}
    >
      <div className="task-card-top">
        <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
        <div className="task-card-actions">
          <button className="btn-icon" title="Edit" onClick={() => onEdit(task)}
            style={{ width: 26, height: 26, fontSize: 12 }}>✏</button>
          <button className="btn-icon" title="Delete" onClick={() => onDelete(task.id)}
            style={{ width: 26, height: 26, fontSize: 12, color: "#9b3535" }}>✕</button>
        </div>
      </div>

      <h4 className={`task-title ${task.status === "done" ? "completed" : ""}`}>{task.title}</h4>
      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-card-bottom">
        <div className="task-meta">
          <div className="task-assignee"
            style={{ background: avatarColors[task.assignee] || "#555" }}>
            {task.assignee}
          </div>
          {task.dueDate && (
            <span className={`task-date ${isOverdue ? "overdue" : ""}`}>
              📅 {formatDate(task.dueDate)}
            </span>
          )}
        </div>
        <MoveMenu task={task} onMove={onMove} />
      </div>
    </article>
  );
}

// Inline move menu
function MoveMenu({ task, onMove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const options = [
    { value: "todo", label: "→ To Do" },
    { value: "inprogress", label: "→ In Progress" },
    { value: "done", label: "→ Done" },
  ].filter(o => o.value !== task.status);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="btn-icon" title="Move to…" onClick={() => setOpen(!open)}
        style={{ width: 26, height: 26, fontSize: 13 }}>⇄</button>
      {open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 4px)", right: 0,
          background: "var(--color-surface)", border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-modal)",
          padding: "4px", zIndex: 100, minWidth: 140
        }}>
          {options.map(o => (
            <button key={o.value} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "6px 10px", fontSize: 12, background: "none",
              border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer",
              color: "var(--color-text-secondary)", fontFamily: "var(--font-body)"
            }}
              onMouseEnter={e => e.target.style.background = "var(--color-bg)"}
              onMouseLeave={e => e.target.style.background = "none"}
              onClick={() => { onMove(task.id, o.value); setOpen(false); }}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// features/board/ui/KanbanColumn.jsx
function KanbanColumn({ id, title, tasks, countClass, onAddTask, onEdit, onDelete, onMove }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) onMove(taskId, id);
    setDragOver(false);
  };

  return (
    <div className="kanban-column"
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}>
      <div className="column-header">
        <div className="column-header-left">
          <div className={`status-dot ${id}`} />
          <span className="column-title">{title}</span>
          <span className={`column-count ${countClass}`}>{tasks.length}</span>
        </div>
        <button className="btn-icon" title={`Add to ${title}`}
          onClick={() => onAddTask(id)} style={{ fontSize: 18 }}>+</button>
      </div>
      <div className="column-body">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task}
            onEdit={onEdit} onDelete={onDelete} onMove={onMove} />
        ))}
        <div className={`drop-zone ${dragOver ? "drag-over" : ""}`}>
          {tasks.length === 0 ? "Drop tasks here" : ""}
        </div>
      </div>
    </div>
  );
}

// features/board/ui/KanbanBoard.jsx (Board page)
function BoardPage({ project, onBack, toast }) {
  const { tasksByStatus, stats, loading, createTask, updateTask, deleteTask, moveTask } = useTasks(project.id);
  const [showCreate, setShowCreate] = useState(false);
  const [createStatus, setCreateStatus] = useState("todo");
  const [editTask, setEditTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleAddTask = (status) => { setCreateStatus(status); setShowCreate(true); };
  const handleCreate = async (data) => {
    await createTask(data);
    toast.show("Task created");
  };
  const handleEdit = async (taskId, patch) => {
    await updateTask(taskId, patch);
    toast.show("Task updated");
  };
  const handleDelete = async () => {
    await deleteTask(deleteConfirm);
    setDeleteConfirm(null);
    toast.show("Task deleted", "error");
  };
  const handleMove = async (taskId, status) => {
    await moveTask(taskId, status);
    toast.show(`Moved to ${status === "inprogress" ? "In Progress" : status === "done" ? "Done" : "To Do"}`);
  };

  const donePercent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <button className="back-btn" onClick={onBack}>←</button>
          <div>
            <div className="topbar-title">{project.name}</div>
            <div className="topbar-subtitle">{project.description}</div>
          </div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={() => handleAddTask("todo")}>
            + Add Task
          </button>
        </div>
      </div>

      <div className="analytics-bar">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{stats.total}</div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${donePercent}%` }} />
          </div>
        </div>
        <div className="stat-card todo">
          <div className="stat-label">To Do</div>
          <div className="stat-value">{stats.todo}</div>
        </div>
        <div className="stat-card inprogress">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">{stats.inprogress}</div>
        </div>
        <div className="stat-card done">
          <div className="stat-label">Done</div>
          <div className="stat-value">{stats.done}</div>
        </div>
      </div>

      <div className="board-area">
        {loading ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}>
            Loading…
          </div>
        ) : (
          <>
            <KanbanColumn id="todo" title="To Do" tasks={tasksByStatus.todo}
              countClass="count-todo" onAddTask={handleAddTask}
              onEdit={setEditTask} onDelete={setDeleteConfirm} onMove={handleMove} />
            <KanbanColumn id="inprogress" title="In Progress" tasks={tasksByStatus.inprogress}
              countClass="count-inprogress" onAddTask={handleAddTask}
              onEdit={setEditTask} onDelete={setDeleteConfirm} onMove={handleMove} />
            <KanbanColumn id="done" title="Done" tasks={tasksByStatus.done}
              countClass="count-done" onAddTask={handleAddTask}
              onEdit={setEditTask} onDelete={setDeleteConfirm} onMove={handleMove} />
          </>
        )}
      </div>

      {showCreate && (
        <CreateTaskModal initialStatus={createStatus}
          onClose={() => setShowCreate(false)} onSave={handleCreate} />
      )}
      {editTask && (
        <EditTaskModal task={editTask}
          onClose={() => setEditTask(null)} onSave={handleEdit} />
      )}
      {deleteConfirm && (
        <ConfirmModal
          title="Delete task"
          message="This task will be permanently removed. This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)} />
      )}
    </>
  );
}

// features/projects/ui/NewProjectModal.jsx
function NewProjectModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: "", description: "", status: "active" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">New Project</span>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Project name *</label>
              <input className="form-input" placeholder="e.g. Website Redesign 2025"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                autoFocus required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows={3} placeholder="What is this project about?"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="active">Active</option>
                <option value="planning">Planning</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Creating…" : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// features/projects/ui/ProjectList.jsx (Projects page)
const ACCENT_CLASSES = ["accent-green", "accent-amber", "accent-blue", "accent-rose"];

function ProjectsPage({ onOpen, toast }) {
  const { projects, loading, createProject, deleteProject } = useProjects();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleCreate = async (data) => {
    await createProject({ ...data, accent: ACCENT_CLASSES[projects.length % ACCENT_CLASSES.length] });
    toast.show("Project created");
  };
  const handleDelete = async () => {
    await deleteProject(deleteConfirm);
    setDeleteConfirm(null);
    toast.show("Project deleted", "error");
  };

  const statusClass = { active: "status-active", planning: "status-planning", paused: "status-paused" };
  const statusLabel = { active: "Active", planning: "Planning", paused: "Paused" };

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div>
          <h2 className="projects-title">All Projects</h2>
          <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Project</button>
      </div>

      {loading ? (
        <div style={{ color: "var(--color-text-muted)", padding: 40, textAlign: "center" }}>Loading…</div>
      ) : (
        <div className="projects-grid">
          {projects.map(p => (
            <div key={p.id} className={`project-card ${p.accent || "accent-green"}`}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <span className={`project-status-pill ${statusClass[p.status] || "status-active"}`}>
                  <span className="status-dot"
                    style={{ width: 6, height: 6, borderRadius: "50%",
                      background: p.status === "active" ? "var(--color-inprogress-text)" : p.status === "paused" ? "#7a6020" : "#3d5a7a" }} />
                  {statusLabel[p.status] || "Active"}
                </span>
                <button className="btn-icon" style={{ color: "#9b3535", fontSize: 13 }}
                  onClick={e => { e.stopPropagation(); setDeleteConfirm(p.id); }}
                  title="Delete project">✕</button>
              </div>
              <h4 className="project-name" onClick={() => onOpen(p)} style={{ cursor: "pointer" }}>{p.name}</h4>
              <p className="project-desc">{p.description || "No description."}</p>
              <div className="project-meta">
                <span className="project-task-count">
                  📋 {p.taskCount || 0} tasks
                </span>
                <span>{timeAgo(p.createdAt)}</span>
              </div>
              <button className="btn btn-ghost" style={{ marginTop: 14, width: "100%", justifyContent: "center" }}
                onClick={() => onOpen(p)}>
                Open board →
              </button>
            </div>
          ))}
        </div>
      )}

      {projects.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-text">No projects yet. Create your first one!</div>
        </div>
      )}

      {showCreate && (
        <NewProjectModal onClose={() => setShowCreate(false)} onSave={handleCreate} />
      )}
      {deleteConfirm && (
        <ConfirmModal
          title="Delete project"
          message="This project and all its data will be removed. Are you sure?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)} />
      )}
    </div>
  );
}

// shared/ui/Sidebar.jsx
function Sidebar({ activeNav, onNav }) {
  const navItems = [
    { id: "projects", icon: "📂", label: "Projects" },
    { id: "analytics", icon: "📊", label: "Analytics" },
    { id: "settings", icon: "⚙", label: "Settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Task<span>Flow</span></h1>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button key={item.id}
            className={`nav-item ${activeNav === item.id ? "active" : ""}`}
            onClick={() => onNav(item.id)}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">JS</div>
          <span className="user-name">Jamie S.</span>
        </div>
      </div>
    </aside>
  );
}

// Analytics stub page
function AnalyticsPage() {
  const { tasks } = useStore(tasksStore);
  const { projects } = useStore(projectsStore);

  const total = tasks.length;
  const done = tasks.filter(t => t.status === "done").length;
  const high = tasks.filter(t => t.priority === "high").length;

  return (
    <div className="projects-page">
      <div className="projects-header" style={{ marginBottom: 24 }}>
        <h2 className="projects-title">Analytics</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Projects", value: projects.length },
          { label: "Total Tasks", value: total },
          { label: "Completion Rate", value: total ? `${Math.round((done / total) * 100)}%` : "—" },
          { label: "High Priority", value: high },
          { label: "Completed", value: done },
          { label: "Pending", value: total - done },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ flex: "unset" }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 22 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{
        background: "var(--color-surface)", border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-xl)", padding: 24, color: "var(--color-text-muted)",
        textAlign: "center", fontSize: 13
      }}>
        Detailed charts and team reports coming soon.
      </div>
    </div>
  );
}

// Settings stub page
function SettingsPage() {
  return (
    <div className="projects-page">
      <div className="projects-header">
        <h2 className="projects-title">Settings</h2>
      </div>
      <div style={{
        background: "var(--color-surface)", border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-xl)", padding: 32, maxWidth: 480
      }}>
        <h3 style={{ fontWeight: 600, marginBottom: 16, fontSize: 14 }}>Workspace</h3>
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Workspace name</label>
          <input className="form-input" defaultValue="My Workspace" />
        </div>
        <div className="form-group">
          <label className="form-label">Default assignee</label>
          <select className="form-select">
            <option>JS — Jamie S.</option>
            <option>AK — Anita K.</option>
          </select>
        </div>
        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function Claude() {
  const toast = useToast();
  const [activeNav, setActiveNav] = useState("projects");
  const [activeProject, setActiveProject] = useState(null);

  const handleOpenProject = (project) => {
    setActiveProject(project);
    setActiveNav("board");
  };

  const handleBackToProjects = () => {
    setActiveProject(null);
    setActiveNav("projects");
  };

  const renderContent = () => {
    if (activeProject) {
      return <BoardPage project={activeProject} onBack={handleBackToProjects} toast={toast} />;
    }
    if (activeNav === "projects") return <ProjectsPage onOpen={handleOpenProject} toast={toast} />;
    if (activeNav === "analytics") return <AnalyticsPage />;
    if (activeNav === "settings") return <SettingsPage />;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="app-shell">
        <Sidebar activeNav={activeProject ? "board" : activeNav} onNav={nav => { setActiveNav(nav); setActiveProject(null); }} />
        <div className="main-area">
          {renderContent()}
        </div>
      </div>
      <ToastContainer toasts={toast.toasts} />
    </>
  );
}

/* ============================================================
   UTILITIES
   ============================================================ */
function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function formatDate(str) {
  if (!str) return "";
  const d = new Date(str);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function timeAgo(str) {
  if (!str) return "";
  const diff = Date.now() - new Date(str).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/* ============================================================
   SEED DATA
   ============================================================ */
function defaultProjects() {
  return [
    {
      id: "proj_1", name: "Website Redesign 2024",
      description: "Integrated marketing strategy for the upcoming holiday season.",
      status: "active", accent: "accent-green", taskCount: 24,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: "proj_2", name: "Mobile App Redesign",
      description: "Overhauling the user interface to improve onboarding conversion rates.",
      status: "planning", accent: "accent-blue", taskCount: 12,
      createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
    },
    {
      id: "proj_3", name: "Q4 Marketing Campaign",
      description: "End-of-year campaign planning for product launches and promotions.",
      status: "active", accent: "accent-amber", taskCount: 8,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
  ];
}

function defaultTasks(projectId) {
  const base = [
    { status: "todo", priority: "high", title: "Design system foundation — Typography & Colors", description: "Set up the core design tokens for the project.", assignee: "JS", dueDate: "2024-10-30" },
    { status: "todo", priority: "medium", title: "User interview scripts for stakeholder meeting", description: "Compile feedback from the last user testing session.", assignee: "AK", dueDate: "2024-10-24" },
    { status: "todo", priority: "low", title: "API documentation review", description: "", assignee: "ML", dueDate: "2024-10-26" },
    { status: "inprogress", priority: "high", title: "Homepage Hero Section Development", description: "Build the new hero with animation and CTA layout.", assignee: "ML", dueDate: "2024-10-22" },
    { status: "inprogress", priority: "medium", title: "Homepage Redesign", description: "", assignee: "RN", dueDate: "2024-10-22" },
    { status: "done", priority: "low", title: "Draft project timeline", description: "", assignee: "JS", dueDate: "2024-10-15" },
    { status: "done", priority: "medium", title: "Initial stakeholder kickoff", description: "Presented scope and goals to the team.", assignee: "AK", dueDate: "2024-10-10" },
  ];
  return base.map(t => ({ ...t, id: uid(), projectId, createdAt: new Date().toISOString() }));
}
