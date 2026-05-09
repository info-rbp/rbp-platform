export const designTokens = {
  colors: {
    brand: {
      primary: "blue",
      secondary: "slate",
      accent: "amber",
      danger: "red",
      success: "emerald",
      warning: "amber",
      info: "sky",
    },
    text: {
      primary: "text-slate-950",
      secondary: "text-slate-700",
      muted: "text-slate-500",
      inverse: "text-white",
      link: "text-blue-700",
      danger: "text-red-700",
      success: "text-emerald-700",
      warning: "text-amber-700",
    },
    background: {
      page: "bg-white",
      subtle: "bg-slate-50",
      card: "bg-white",
      dark: "bg-slate-950",
      primary: "bg-blue-600",
      primarySoft: "bg-blue-50",
      dangerSoft: "bg-red-50",
      successSoft: "bg-emerald-50",
      warningSoft: "bg-amber-50",
    },
    border: {
      default: "border-slate-200",
      strong: "border-slate-300",
      primary: "border-blue-600",
      danger: "border-red-200",
      success: "border-emerald-200",
      warning: "border-amber-200",
    },
  },

  typography: {
    pageEyebrow: "text-sm font-semibold uppercase tracking-wide",
    pageTitle: "text-3xl font-bold tracking-tight md:text-4xl",
    sectionTitle: "text-2xl font-bold tracking-tight",
    cardTitle: "text-lg font-semibold",
    body: "text-base leading-7",
    bodySmall: "text-sm leading-6",
    caption: "text-xs font-medium",
    button: "text-sm font-semibold",
    badge: "text-xs font-semibold",
  },

  spacing: {
    pageX: "px-4 sm:px-6 lg:px-8",
    pageY: "py-8 md:py-12",
    sectionY: "py-12 md:py-16",
    cardPadding: "p-5 md:p-6",
    formGap: "space-y-4",
    stackGap: "space-y-6",
    gridGap: "gap-4 md:gap-6",
  },

  radius: {
    small: "rounded-lg",
    medium: "rounded-xl",
    large: "rounded-2xl",
    panel: "rounded-3xl",
    full: "rounded-full",
  },

  shadow: {
    none: "shadow-none",
    card: "shadow-sm",
    panel: "shadow-sm",
    elevated: "shadow-lg",
  },

  layout: {
    pageMaxWidth: "max-w-7xl",
    contentMaxWidth: "max-w-5xl",
    narrowMaxWidth: "max-w-3xl",
    wizardGrid: "grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]",
    dashboardGrid: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
    cardGrid: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
  },

  breakpoints: {
    mobileSmall: "360px",
    mobile: "390px",
    mobileLarge: "430px",
    tablet: "768px",
    tabletLarge: "1024px",
    desktop: "1280px",
    desktopLarge: "1440px",
    wide: "1920px",
  },

  zIndex: {
    base: "z-0",
    raised: "z-10",
    sticky: "z-30",
    overlay: "z-40",
    modal: "z-50",
  },
} as const;

export type DesignTokens = typeof designTokens;
export type DesignColorGroup = keyof typeof designTokens.colors;
export type DesignBreakpoint = keyof typeof designTokens.breakpoints;
