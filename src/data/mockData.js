export const mockData = {
  departments: {
    mechanical: {
      hoursTarget: 739,
      hoursSold: 520,  // ~70% completion (orange)
      progress: 70,
      previousDayBilling: 15.40,
      revenueTarget: 162679,
      revenue: 110000,  // ~68% completion (orange)
      revenueProgress: 68,
      revenuePerHour: 220.59,
      target: 739,
      actual: 520
    },
    bodywork: {
      hoursTarget: 203,
      hoursSold: 140,  // ~69% completion (orange)
      progress: 69,
      previousDayBilling: 8.2,
      revenueTarget: 85000,
      revenue: 58000,  // ~68% completion (orange)
      revenueProgress: 68,
      revenuePerHour: 418.18,
      target: 203,
      actual: 140
    },
    quickService: {
      hoursTarget: 546,
      hoursSold: 505,  // ~92% completion (vert)
      progress: 92,
      previousDayBilling: 27.90,
      revenueTarget: 144569,
      revenue: 102000,  // ~71% completion (orange)
      revenueProgress: 71,
      revenuePerHour: 76.92,
      target: 546,
      actual: 505
    }
  },
  videoCheck: {
    target: 25000,
    entries: 165,
    completed: 76,
    identifiedRevenue: 27994.22,
    actualRevenue: 19372.11,
    completionRate: 77,
    theoreticalProgress: 19.06,
    revenuePerVideo: 254.90
  },
  sales: {
    mechanical: {
      tires: { target: 40, actual: 8, delta: -32 },  // Reduced from 23 to 8 (20% completion - red)
      shockAbsorbers: { target: 10, actual: 6, delta: -4 },  // 60% (orange)
      wipers: { target: 28, actual: 18, delta: -10 },  // 64.3% (vert)
      brakePads: { target: 18, actual: 12, delta: -6 },  // 66.7% (vert)
      batteries: { target: 9, actual: 7, delta: -2 },  // 77.8% (vert)
      windshields: { target: 0, actual: 0, delta: 0 },
      oilFilters: { count: 32 },
      additives: { count: 15 },
      discs: { count: 8 },
      acSterilization: { count: 5 }
    },
    quickService: {
      tires: { target: 50, actual: 12, delta: -38 },  // Reduced from 37 to 12 (24% completion - red)
      batteries: { target: 10, actual: 6, delta: -4 },  // 60% (orange)
      wipers: { target: 186, actual: 125, delta: -61 },  // 67.2% (vert)
      brakePads: { target: 40, actual: 25, delta: -15 },  // 62.5% (orange)
      shockAbsorbers: { target: 10, actual: 8, delta: -2 },  // 80% (vert)
      windshields: { target: 0, actual: 0, delta: 0 },
      oilFilters: { count: 76 },
      acSterilization: { count: 18 },
      discs: { count: 14 },
      additives: { count: 22 }
    },
    bodywork: {
      tires: { target: 0, actual: 0, delta: 0 },
      batteries: { target: 0, actual: 0, delta: 0 },
      wipers: { target: 0, actual: 0, delta: 0 },
      brakePads: { target: 0, actual: 0, delta: 0 },
      shockAbsorbers: { target: 0, actual: 0, delta: 0 },
      windshields: { target: 15, actual: 8, delta: -7 },  // 53.3% (orange)
      oilFilters: { count: 0 },
      acSterilization: { count: 0 },
      discs: { count: 0 },
      additives: { count: 0 }
    }
  }
};