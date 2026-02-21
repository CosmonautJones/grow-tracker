// Cultivation guides with week-relevance data for context-sensitive display

export const CULTIVATION_GUIDES = [
  {
    id: 'lst',
    title: 'Low Stress Training (LST)',
    icon: '&#x1f4cf;',
    summary: 'Gently bend and tie branches to create an even canopy and increase light exposure to lower bud sites.',
    applicablePlantTypes: ['autoflower', 'photoperiod'],
    relevantWeeks: {
      autoflower: { start: 3, end: 5, peak: 3 },
      photoperiod: { start: 3, end: 8, peak: 4 }
    },
    sections: [
      {
        title: 'When to Start',
        type: 'paragraphs',
        content: [
          'Begin LST once your plant has 4-5 nodes (typically week 3 for autoflowers, weeks 3-4 for photoperiod).',
          'Autoflowers: Start early since they have a fixed lifecycle. Stop LST before flower stretch begins (around week 4-5).',
          'Photoperiod: You have more flexibility. Continue through veg and into early flower stretch.'
        ]
      },
      {
        title: 'How to LST',
        type: 'steps',
        content: [
          'Water your plant first — stems are more pliable when hydrated.',
          'Gently bend the main stem sideways at a 90-degree angle, securing with soft plant ties to the pot rim.',
          'As branches grow upward, continue bending them outward to create a flat, even canopy.',
          'Reposition ties every 2-3 days as the plant adjusts.',
          'Aim for an even canopy where all tops receive equal light.'
        ]
      },
      {
        title: 'Tips & Warnings',
        type: 'warnings',
        content: [
          'Never snap or crease stems — if you hear cracking, tape it immediately with plant tape.',
          'Use soft ties (pipe cleaners, garden wire with rubber coating) — avoid anything that can cut into stems.',
          'Stop all LST during late flower to avoid stressing buds.',
          'LST works especially well combined with topping in photoperiod plants.'
        ]
      }
    ]
  },
  {
    id: 'topping',
    title: 'Topping & FIMming',
    icon: '&#x2702;&#xfe0f;',
    summary: 'Remove or pinch the growing tip to create multiple colas instead of one dominant top.',
    applicablePlantTypes: ['autoflower', 'photoperiod'],
    relevantWeeks: {
      autoflower: { start: 3, end: 4, peak: 3 },
      photoperiod: { start: 4, end: 7, peak: 5 }
    },
    sections: [
      {
        title: 'Topping vs FIMming',
        type: 'paragraphs',
        content: [
          'Topping: Cut the main stem above the 4th or 5th node, removing the growing tip entirely. Creates two main colas.',
          'FIMming (F*** I Missed): Pinch or cut 75% of the new growth at the top. Less precise but can create 3-4 new tops.',
          'Topping is more reliable; FIMming is less stressful but results vary.'
        ]
      },
      {
        title: 'When to Top',
        type: 'paragraphs',
        content: [
          'Wait until your plant has at least 5-6 nodes before topping.',
          'Photoperiod: Top once in veg, wait 7-10 days for recovery, then top again if desired. Multiple toppings are fine.',
          'Autoflower: Only top once, early (around node 5, typically week 3). Autoflowers have limited recovery time — many experienced growers avoid topping autos and prefer LST instead.'
        ]
      },
      {
        title: 'How to Top',
        type: 'steps',
        content: [
          'Use clean, sharp scissors or a razor blade (sterilize with rubbing alcohol).',
          'Identify the newest node at the top of the plant.',
          'Cut the main stem cleanly just above the 5th node.',
          'The two branches at that node will now become your two main colas.',
          'Allow 5-10 days recovery before further training.'
        ]
      },
      {
        title: 'Warnings',
        type: 'warnings',
        content: [
          'Never top during flower — it causes too much stress and reduces yield.',
          'Avoid topping unhealthy or stressed plants.',
          'Autoflower growers: topping is controversial. If your plant is not growing vigorously, skip it and use LST instead.'
        ]
      }
    ]
  },
  {
    id: 'defoliation',
    title: 'Defoliation',
    icon: '&#x1f343;',
    summary: 'Strategic removal of fan leaves to improve airflow, light penetration, and redirect energy to bud sites.',
    applicablePlantTypes: ['autoflower', 'photoperiod'],
    relevantWeeks: {
      autoflower: { start: 4, end: 7, peak: 5 },
      photoperiod: { start: 4, end: 10, peak: 6 }
    },
    sections: [
      {
        title: 'Types of Defoliation',
        type: 'paragraphs',
        content: [
          'Light defoliation: Remove only leaves blocking bud sites or creating dense, humid pockets. Safe for all plants.',
          'Schwazzing (heavy defoliation): Remove most fan leaves at the start of flower and again around week 3 of flower. Controversial — only for experienced growers with healthy, vigorous plants.',
          'Lollipoping: Remove all growth from the bottom 1/3 of the plant. Redirects energy to top buds. Best done in late veg or early flower.'
        ]
      },
      {
        title: 'When to Defoliate',
        type: 'paragraphs',
        content: [
          'Light defoliation can be done throughout veg and flower as needed.',
          'Major defoliation: Do it in late veg or during the first 1-2 weeks of flower.',
          'Lollipoping: Best done before or during the first week of flower.',
          'Never heavily defoliate during peak flower (weeks 4-6 of flower).'
        ]
      },
      {
        title: 'What to Remove',
        type: 'steps',
        content: [
          'Large fan leaves that block light to lower bud sites.',
          'Leaves in the interior of the canopy creating humidity pockets.',
          'Small, yellowing, or damaged leaves at any time.',
          'Lower branches and growth that will never reach the canopy (lollipoping).',
          'Remove no more than 20-30% of foliage at once to avoid shock.'
        ]
      },
      {
        title: 'Warnings',
        type: 'warnings',
        content: [
          'Less is more — fan leaves are solar panels. Over-defoliation stunts growth.',
          'Autoflowers: Be very conservative. Remove only leaves clearly blocking bud sites.',
          'Never defoliate a stressed, sick, or underwatered plant.',
          'Allow 3-5 days recovery between defoliation sessions.'
        ]
      }
    ]
  },
  {
    id: 'deficiencies',
    title: 'Common Deficiency Identification',
    icon: '&#x1fa7a;',
    summary: 'Identify and fix nitrogen, phosphorus, potassium, calcium, and magnesium deficiencies by their leaf symptoms.',
    applicablePlantTypes: ['autoflower', 'photoperiod'],
    relevantWeeks: {
      autoflower: { start: 2, end: 10, peak: 5 },
      photoperiod: { start: 2, end: 14, peak: 6 }
    },
    sections: [
      {
        title: 'Nitrogen (N) Deficiency',
        type: 'deficiency',
        content: [
          'Symptoms: Lower/older leaves turn pale green, then yellow, starting from the tips. Slow growth, thin stems.',
          'Common cause: Underfeeding, especially in flower transition when plants are growing fast.',
          'Fix: Increase nitrogen-containing nutrients. In Flora Trio, raise FloraMicro and FloraGro.',
          'Note: Some yellowing of lower leaves is normal in late flower as the plant redirects energy.'
        ]
      },
      {
        title: 'Phosphorus (P) Deficiency',
        type: 'deficiency',
        content: [
          'Symptoms: Dark green leaves with purple/red stems. Lower leaves develop dark spots and curl downward.',
          'Common cause: pH lockout (pH too high or too low), cold root zone temperatures.',
          'Fix: Check pH first (5.8-6.2 hydro, 6.0-6.5 soil). If pH is correct, increase bloom nutrients.'
        ]
      },
      {
        title: 'Potassium (K) Deficiency',
        type: 'deficiency',
        content: [
          'Symptoms: Brown/burnt leaf edges and tips, especially on older leaves. Leaves may curl upward.',
          'Common cause: Overwatering, pH lockout, or high sodium levels in water.',
          'Fix: Check pH and drainage. Increase potassium (FloraBloom in GH, Tiger Bloom in Fox Farm).'
        ]
      },
      {
        title: 'Calcium (Ca) Deficiency',
        type: 'deficiency',
        content: [
          'Symptoms: Brown spots on new growth, distorted/curled new leaves, weak stems.',
          'Common cause: Very common in coco coir grows and with RO water. Low pH can also lock it out.',
          'Fix: Add CalMag supplement. Ensure pH is 6.0+ in coco/soil. RO water users should always supplement calcium.'
        ]
      },
      {
        title: 'Magnesium (Mg) Deficiency',
        type: 'deficiency',
        content: [
          'Symptoms: Interveinal chlorosis — leaf veins stay green but areas between turn yellow. Starts on lower leaves.',
          'Common cause: Low pH lockout, using RO/distilled water without CalMag.',
          'Fix: Add CalMag or Epsom salt (1 tsp/gal). Raise pH if below 6.0.'
        ]
      }
    ]
  },
  {
    id: 'drying-curing',
    title: 'Drying & Curing',
    icon: '&#x1f3fa;',
    summary: 'Proper drying and curing techniques for maximum flavor, potency, and smooth smoke.',
    applicablePlantTypes: ['autoflower', 'photoperiod'],
    relevantWeeks: {
      autoflower: { start: 9, end: 10, peak: 10 },
      photoperiod: { start: 10, end: 14, peak: 12 }
    },
    sections: [
      {
        title: 'Harvest Timing',
        type: 'paragraphs',
        content: [
          'Check trichomes with a jeweler\'s loupe or USB microscope (60x magnification).',
          'Clear trichomes = too early. Milky/cloudy = peak THC. Amber trichomes = more sedative/CBN effect.',
          'Most growers harvest when trichomes are 70-80% milky with 10-20% amber.',
          'Pistils (hairs) should be 70-90% darkened and curled in.'
        ]
      },
      {
        title: 'Wet Trimming vs Dry Trimming',
        type: 'paragraphs',
        content: [
          'Wet trim: Remove fan leaves and sugar leaves immediately after cutting. Faster drying, cleaner buds, easier to trim. Best for humid climates.',
          'Dry trim: Hang whole plants or branches, trim after drying. Slower drying preserves more terpenes. Best for dry climates.',
          'Most growers use a combination: remove fan leaves wet, trim sugar leaves dry.'
        ]
      },
      {
        title: 'Drying Process',
        type: 'steps',
        content: [
          'Hang branches upside down in a dark room with good airflow (not blowing directly on buds).',
          'Target: 60°F (15°C) temperature and 60% humidity ("60/60 rule"). Range: 55-65°F, 55-65% RH.',
          'Ensure complete darkness — light degrades THC.',
          'Drying should take 7-14 days. Do NOT speed-dry with fans or heat.',
          'Buds are ready when small stems snap cleanly instead of bending. Outer buds should feel dry but not crispy.'
        ]
      },
      {
        title: 'Jar Curing',
        type: 'steps',
        content: [
          'Trim buds (if dry trimming) and place loosely in glass mason jars — fill 75% full.',
          'Store jars in a cool, dark place. Target 60-65°F, 58-62% humidity inside jars.',
          'Week 1: "Burp" jars (open lids) for 15-30 minutes, 2-3 times daily. Check for ammonia smell (too wet).',
          'Week 2-3: Reduce burping to once daily for 10-15 minutes.',
          'Week 4+: Burp once every few days. Cure for minimum 2 weeks, ideally 4-8 weeks.',
          'Use Boveda 62% humidity packs to maintain optimal moisture without guesswork.'
        ]
      },
      {
        title: 'Warnings',
        type: 'warnings',
        content: [
          'If you smell ammonia when opening jars, buds are too wet. Remove and dry further before re-jarring.',
          'Mold is the biggest risk. Check buds regularly during the first week of curing.',
          'Too-fast drying locks in chlorophyll, causing harsh "hay" taste. Patience is key.',
          'Long-term storage: Once cured, store in airtight jars in a cool, dark place. Properly cured buds improve for 6+ months.'
        ]
      }
    ]
  }
];

/**
 * Get guides relevant to the current week and plant type.
 * Returns guides sorted by relevance, with "peak" weeks flagged.
 */
export function getRelevantGuides(plantType, weekNumber) {
  return CULTIVATION_GUIDES
    .filter(guide => {
      if (!guide.applicablePlantTypes.includes(plantType)) return false;
      const range = guide.relevantWeeks[plantType];
      if (!range) return false;
      return weekNumber >= range.start && weekNumber <= range.end;
    })
    .map(guide => ({
      ...guide,
      isPeak: guide.relevantWeeks[plantType]?.peak === weekNumber
    }))
    .sort((a, b) => (b.isPeak ? 1 : 0) - (a.isPeak ? 1 : 0));
}

/**
 * Get all guides applicable to a plant type.
 */
export function getAllGuides(plantType) {
  return CULTIVATION_GUIDES.filter(
    guide => guide.applicablePlantTypes.includes(plantType)
  );
}
