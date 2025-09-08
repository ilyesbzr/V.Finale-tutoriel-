/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@import './styles/print.css';

@tailwind base;
@tailwind components;
@tailwind utilities;


/* CSS Variables for Design System */
:root {
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  --color-secondary-50: #f0fdf4;
  --color-secondary-100: #dcfce7;
  --color-secondary-200: #bbf7d0;
  --color-secondary-300: #86efac;
  --color-secondary-400: #4ade80;
  --color-secondary-500: #22c55e;
  --color-secondary-600: #16a34a;
  --color-secondary-700: #15803d;
  --color-secondary-800: #166534;
  --color-secondary-900: #14532d;

  --color-accent-50: #eff6ff;
  --color-accent-100: #dbeafe;
  --color-accent-200: #bfdbfe;
  --color-accent-300: #93c5fd;
  --color-accent-400: #60a5fa;
  --color-accent-500: #3b82f6;
  --color-accent-600: #2563eb;
  --color-accent-700: #1d4ed8;
  --color-accent-800: #1e40af;
  --color-accent-900: #1e3a8a;

  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-200: #fde68a;
  --color-warning-300: #fcd34d;
  --color-warning-400: #fbbf24;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;
  --color-warning-800: #92400e;
  --color-warning-900: #78350f;

  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-200: #fecaca;
  --color-error-300: #fca5a5;
  --color-error-400: #f87171;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;
  --color-error-800: #991b1b;
  --color-error-900: #7f1d1d;

  --color-success-50: #ecfdf5;
  --color-success-100: #d1fae5;
  --color-success-200: #a7f3d0;
  --color-success-300: #6ee7b7;
  --color-success-400: #34d399;
  --color-success-500: #10b981;
  --color-success-600: #059669;
  --color-success-700: #047857;
  --color-success-800: #065f46;
  --color-success-900: #064e3b;

  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  --border-radius-sm: 6px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  --border-radius-2xl: 20px;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
}

/* Base styles */
* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

body {
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Animations globales */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromRight {
  from {
    transform: translateX(30px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInFromLeft {
  from {
    transform: translateX(-30px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInFromTop {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }

  100% {
    background-position: calc(200px + 100%) 0;
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }

  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {

  0%,
  100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  }

  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6);
  }
}

/* Classes d'animation réutilisables */
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-in-right {
  animation: slideInFromRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-in-left {
  animation: slideInFromLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-in-top {
  animation: slideInFromTop 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-scale-in {
  animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-shimmer {
  animation: shimmer 2s infinite;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200px 100%;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite alternate;
}

/* Enhanced Card Styles */
.card-modern {
  background: rgb(255, 255, 255);
  border: 1px solid #e5e7eb;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-modern:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-2xl);
  border-color: #3b82f6;
}

/* Enhanced Button Styles */
.btn-modern {
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius-lg);
  font-weight: 600;
  letter-spacing: 0.025em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.btn-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-modern:hover::before {
  left: 100%;
}

.btn-modern:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-modern:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* Enhanced Input Styles */
.input-modern {
  border-radius: var(--border-radius-lg);
  border: 2px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.input-modern:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: rgba(255, 255, 255, 1);
}

/* Enhanced Progress Bars */
.progress-modern {
  background: linear-gradient(90deg, #f1f5f9, #e2e8f0);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.progress-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

.progress-fill-modern {
  border-radius: 9999px;
  position: relative;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-400));
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  will-change: transform, width;
  -webkit-transform: translate3d(0, 0, 0);
  image-rendering: crisp-edges;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.progress-fill-success {
  background: linear-gradient(90deg, var(--color-success-500), var(--color-success-400));
  transform: translate3d(0, 0, 0);
  will-change: transform, width;
  -webkit-transform: translate3d(0, 0, 0);
  image-rendering: crisp-edges;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.progress-fill-warning {
  background: linear-gradient(90deg, var(--color-warning-500), var(--color-warning-400));
  transform: translate3d(0, 0, 0);
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  will-change: transform, width;
  -webkit-transform: translate3d(0, 0, 0);
  image-rendering: crisp-edges;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
.progress-fill-error {
  background: linear-gradient(90deg, var(--color-error-500), var(--color-error-400));
  transform: translate3d(0, 0, 0);
  will-change: transform, width;
  -webkit-transform: translate3d(0, 0, 0);
  image-rendering: crisp-edges;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  image-rendering: crisp-edges;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Enhanced Table Styles */
.table-modern {
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  background: white;
}

.table-modern thead {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
}

.table-modern th {
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 16px 20px;
}

.table-modern td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
}

.table-modern tbody tr:hover {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.02), rgba(59, 130, 246, 0.05));
}

/* Enhanced Sidebar */
.sidebar-modern {
  background: linear-gradient(180deg, #1e3a8a 0%, #1e293b 100%);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-item {
  position: relative;
  margin: 4px 8px;
  border-radius: var(--border-radius-lg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.sidebar-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.sidebar-item:hover::before {
  left: 100%;
}

.sidebar-item:hover {
  transform: translateX(4px);
  background: rgba(59, 130, 246, 0.1);
  border-left: 3px solid var(--color-primary-400);
}

.sidebar-item.active {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  box-shadow: var(--shadow-lg);
  transform: translateX(4px);
}

/* Enhanced Modal Styles */
.modal-modern {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-2xl);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-backdrop {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
}

/* Enhanced Tooltip Styles */
.tooltip-modern {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 12px 16px;
  max-width: 280px;
}

/* Enhanced Chart Container */
.chart-container {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Enhanced Header */
.header-modern {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: var(--shadow-sm);
}

/* Enhanced Navigation Tabs */
.nav-tabs-modern {
  background: rgba(241, 245, 249, 0.8);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius-xl);
  padding: 6px;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.nav-tab-modern {
  position: relative;
  border-radius: var(--border-radius-lg);
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.nav-tab-modern.active {
  background: white;
  box-shadow: var(--shadow-md);
  color: var(--color-primary-700);
}

.nav-tab-modern.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-accent-500));
  border-radius: 2px;
}

.nav-tab-modern:not(.active):hover {
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-1px);
}

/* Enhanced Metric Cards */
.metric-card-modern {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.metric-card-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--color-primary-500);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.metric-card-modern:hover::before {
  opacity: 1;
}


/* Enhanced Status Indicators */
.status-success {
  background: linear-gradient(135deg, var(--color-success-500), var(--color-success-400));
  color: white;
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: var(--shadow-sm);
}

.status-warning {
  background: linear-gradient(135deg, var(--color-warning-500), var(--color-warning-400));
  color: white;
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: var(--shadow-sm);
}

.status-error {
  background: linear-gradient(135deg, var(--color-error-500), var(--color-error-400));
  color: white;
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: var(--shadow-sm);
}

/* Enhanced Loading States */
.skeleton {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--border-radius-md);
}

.loading-spinner-modern {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.1);
  border-top: 3px solid var(--color-primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: var(--shadow-md);
}

/* Transitions fluides */
.page-transition {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced Menu Items */
.menu-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.menu-item:hover {
  transform: translateX(4px) scale(1.02);
  background: rgba(59, 130, 246, 0.1);
}

.menu-item::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 60%;
  background: linear-gradient(180deg, var(--color-primary-500), var(--color-accent-500));
  border-radius: 0 4px 4px 0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item.active::after {
  width: 4px;
}

.button-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.button-hover:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: var(--shadow-lg);
}

/* Enhanced Form Elements */
.form-group-modern {
  position: relative;
  margin-bottom: 24px;
}

.form-label-modern {
  position: absolute;
  left: 16px;
  top: 16px;
  color: #64748b;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  background: white;
  padding: 0 8px;
  border-radius: 4px;
}

.form-input-modern:focus+.form-label-modern,
.form-input-modern:not(:placeholder-shown)+.form-label-modern {
  transform: translateY(-32px) scale(0.85);
  color: var(--color-primary-600);
  font-weight: 600;
}

/* Enhanced Dropdown */
.dropdown-modern {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.dropdown-item-modern {
  padding: 12px 20px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 3px solid transparent;
}

.dropdown-item-modern:hover {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  border-left-color: var(--color-primary-500);
  transform: translateX(4px);
}

/* Enhanced Calendar */
.calendar-modern {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.calendar-day {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: var(--border-radius-md);
  position: relative;
}

.calendar-day:hover {
  transform: scale(1.1);
  background: var(--color-primary-100);
  box-shadow: var(--shadow-md);
}

.calendar-day.selected {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  box-shadow: var(--shadow-lg);
}

/* Enhanced Chat Widget */
.chat-widget-modern {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  border-radius: 50%;
  box-shadow: var(--shadow-xl);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.chat-widget-modern::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: spin 3s linear infinite;
}

.chat-widget-modern:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-2xl);
}

.chat-window-modern {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
}

/* Enhanced Notification */
.notification-modern {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  border-left: 4px solid var(--color-primary-500);
}

/* Enhanced Badge */
.badge-modern {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.badge-modern:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

/* Enhanced Search */
.search-modern {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: var(--border-radius-xl);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-modern:focus-within {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: white;
}

/* Enhanced Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--color-primary-400), var(--color-primary-500));
  border-radius: 4px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, var(--color-primary-500), var(--color-primary-600));
}

/* Enhanced Focus States */
.focus-modern:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  border-color: var(--color-primary-500);
}

/* Enhanced Grid Layout */
.grid-modern {
  display: grid;
  gap: 24px;
  padding: 24px;
}

/* Enhanced Typography */
.heading-modern {
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.text-gradient {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-accent-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Enhanced Glassmorphism */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-dark {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Animation du loader */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Enhanced Utility Classes */
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.text-shadow-lg {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.backdrop-blur-xs {
  backdrop-filter: blur(2px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.backdrop-blur-md {
  backdrop-filter: blur(8px);
}

.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

/* Enhanced Interactive Elements */
.interactive {
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive:hover {
  transform: translateY(-1px);
}

.interactive:active {
  transform: translateY(0);
}

/* Enhanced Dividers */
.divider-modern {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(226, 232, 240, 0.8), transparent);
  margin: 24px 0;
}

.divider-gradient {
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-accent-500), var(--color-secondary-500));
  border-radius: 1px;
  margin: 16px 0;
}

/* Print-specific display utilities */
.print-only {
  display: none;
}

@media print {
  .print-only {
    display: block;
  }

  .no-print {
    display: none !important;
  }
}

/* Styles d'impression */
@media print {

  /* Configuration de base */
  @page {
    size: landscape;
    margin: 0.5cm;
  }

  /* Styles généraux pour l'impression */
  body {
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    background: white !important;
    color: black !important;
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    font-size: 8pt !important;
  }

  /* Cacher les éléments non imprimables */
  .no-print,
  button:not(.print-button),
  nav,
  header {
    display: none !important;
  }

  /* Styles pour les tableaux */
  table {
    width: 100% !important;
    border-collapse: collapse !important;
    break-inside: auto !important;
    font-size: 8pt !important;
  }

  tr {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  td,
  th {
    padding: 2px 4px !important;
    border: 1px solid #e2e8f0 !important;
    white-space: nowrap !important;
  }

  th {
    font-weight: 600 !important;
    text-transform: uppercase !important;
    color: #4a5568 !important;
    background-color: #f7fafc !important;
  }

  /* Styles pour les titres */
  h1 {
    font-size: 14pt !important;
    margin-bottom: 0.3cm !important;
    break-after: avoid !important;
  }

  h2 {
    font-size: 12pt !important;
    margin-top: 0.3cm !important;
    margin-bottom: 0.2cm !important;
    break-after: avoid !important;
  }

  h3 {
    font-size: 10pt !important;
    margin-top: 0.2cm !important;
    margin-bottom: 0.1cm !important;
    break-after: avoid !important;
  }

  /* Forcer les sauts de page appropriés */
  .print-page-break {
    break-before: page !important;
    page-break-before: always !important;
  }

  /* Empêcher les sauts de page indésirables */
  .print-keep-together {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  /* Styles spécifiques pour PrintableSummary */
  .print-summary {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Grille pour Crescendo */
  .grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 0.3cm !important;
    break-inside: avoid !important;
  }

  /* Ajustements de mise en page */
  .print\:p-0 {
    padding: 0 !important;
  }

  .print\:m-0 {
    margin: 0 !important;
  }

  .print\:shadow-none {
    box-shadow: none !important;
  }

  /* Assurer que le contenu est visible */
  .print\:block {
    display: block !important;
  }

  .print\:hidden {
    display: none !important;
  }

  /* Styles pour la barre de défilement */
  ::-webkit-scrollbar {
    display: none !important;
  }

  /* Styles pour les conteneurs */
  .container {
    max-width: none !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Ajustements spécifiques pour les tableaux de données */
  .print-summary table {
    margin-bottom: 0.3cm !important;
  }

  .print-summary td,
  .print-summary th {
    font-size: 7pt !important;
    line-height: 1.2 !important;
  }

  /* Optimisation de l'espace pour Crescendo */
  .print-summary .grid {
    margin-top: 0.5cm !important;
  }

  .print-summary .grid table {
    font-size: 7pt !important;
  }

  /* Styles spécifiques pour la vue d'impression */
  .print-container {
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .print-friendly {
    margin-bottom: 0.5cm !important;
    break-inside: avoid !important;
  }

  .print-header {
    margin-bottom: 0.5cm !important;
  }

  .print-footer {
    margin-top: 0.5cm !important;
  }

  /* Styles spécifiques pour le planning */
  .print-break-before-page {
    break-before: page !important;
  }
}

/* Styles pour les vidéos tutoriels */
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%;
}

.aspect-h-9 {
  position: relative;
}

.aspect-w-16 iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Styles pour le tutoriel d'accueil */
.tutorial-highlight {
  position: relative;
  z-index: 51;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2) !important;
  border-radius: 8px !important;
  animation: tutorial-pulse 2s infinite;
}

@keyframes tutorial-pulse {

  0%,
  100% {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2);
  }

  50% {
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.7), 0 0 0 12px rgba(59, 130, 246, 0.3);
  }
}

/* Responsive styles */
@media (max-width: 640px) {
  .card-grid {
    grid-template-columns: 1fr;
  }

  .table-container {
    overflow-x: auto;
  }

  .mobile-full-width {
    width: 100%;
  }

  .mobile-stack {
    flex-direction: column;
  }

  .mobile-hidden {
    display: none;
  }
}