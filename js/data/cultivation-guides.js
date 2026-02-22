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
    summary: 'Identify and fix nitrogen, phosphorus, potassium, calcium, magnesium, iron, sulfur, zinc, and manganese deficiencies by their leaf symptoms.',
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
      },
      {
        title: 'Iron (Fe) Deficiency',
        type: 'deficiency',
        content: [
          'Symptoms: Interveinal chlorosis on NEW growth (youngest leaves). Veins stay green while leaf tissue yellows. Unlike magnesium, iron deficiency affects the top of the plant first.',
          'Common cause: High pH (above 6.5 in soil, above 6.2 in hydro/coco). Iron becomes unavailable at high pH even if present.',
          'Fix: Lower pH to 6.0-6.5 in soil or 5.5-6.0 in hydro/coco. Foliar spray with chelated iron for fast correction. Check for overwatering, which reduces root uptake.'
        ]
      },
      {
        title: 'Sulfur (S) Deficiency',
        type: 'deficiency',
        content: [
          'Symptoms: Uniform yellowing of new leaves (entire leaf, not interveinal). Thin, woody stems. Slow overall growth. Rare but can occur.',
          'Common cause: Using coco coir with low-sulfur nutrients, very soft or RO water, or heavily leached soil.',
          'Fix: Most base nutrients contain sufficient sulfur. If using RO water, ensure your nutrient line includes sulfur. Epsom salt (magnesium sulfate) also provides sulfur.'
        ]
      },
      {
        title: 'Zinc (Zn) Deficiency',
        type: 'deficiency',
        content: [
          'Symptoms: Stunted new growth with short internodes. Small, thin, twisted new leaves. Interveinal chlorosis on young leaves. Leaf tips may die.',
          'Common cause: High pH (above 7.0), overuse of phosphorus (competes with zinc uptake), or alkaline water.',
          'Fix: Lower pH to optimal range. Reduce phosphorus if excessive. Most quality nutrient lines contain adequate zinc. Zinc sulfate foliar spray for immediate relief.'
        ]
      },
      {
        title: 'Manganese (Mn) Deficiency',
        type: 'deficiency',
        content: [
          'Symptoms: Interveinal chlorosis with scattered brown necrotic spots. Affects newer leaves. Often confused with calcium deficiency, but manganese shows more defined spotting pattern.',
          'Common cause: High pH (above 6.5), overwatering, or high iron levels that compete with manganese uptake.',
          'Fix: Lower pH to 6.0-6.5 in soil or 5.5-6.0 in hydro. Ensure proper drainage. Most balanced nutrient lines contain adequate manganese.'
        ]
      },
      {
        title: 'Quick Reference Chart',
        type: 'table',
        columns: ['Deficiency', 'Affects', 'Key Symptom', 'Common Fix'],
        rows: [
          ['Nitrogen (N)', 'Old leaves first', 'Yellowing from tips', 'Increase N nutrients'],
          ['Phosphorus (P)', 'Old leaves', 'Dark leaves, purple stems', 'Check pH, increase P'],
          ['Potassium (K)', 'Old leaves', 'Brown leaf edges', 'Check drainage, increase K'],
          ['Calcium (Ca)', 'New growth', 'Brown spots, curled leaves', 'Add CalMag, check pH'],
          ['Magnesium (Mg)', 'Old leaves', 'Yellow between green veins', 'CalMag or Epsom salt'],
          ['Iron (Fe)', 'New growth', 'Yellow between green veins', 'Lower pH below 6.5'],
          ['Sulfur (S)', 'New growth', 'Uniform leaf yellowing', 'Check nutrient sulfur content'],
          ['Zinc (Zn)', 'New growth', 'Stunted, twisted leaves', 'Lower pH, reduce excess P'],
          ['Manganese (Mn)', 'New growth', 'Chlorosis with brown spots', 'Lower pH, fix drainage']
        ]
      },
      {
        title: 'Optimal pH Ranges by Medium',
        type: 'ph-range',
        ranges: [
          { medium: 'Soil', min: 6.0, max: 7.0 },
          { medium: 'Coco Coir', min: 5.5, max: 6.5 },
          { medium: 'Hydro (DWC)', min: 5.5, max: 6.2 },
          { medium: 'Hydro (Ebb & Flow)', min: 5.5, max: 6.5 },
          { medium: 'Aeroponics', min: 5.5, max: 6.0 }
        ]
      }
    ]
  },
  {
    id: 'toxicities',
    title: 'Nutrient Toxicity & Burn',
    icon: '&#x1f525;',
    summary: 'Identify and fix nutrient burn, nitrogen toxicity, pH lockout, and light stress — common issues from overfeeding.',
    applicablePlantTypes: ['autoflower', 'photoperiod'],
    relevantWeeks: {
      autoflower: { start: 2, end: 10, peak: 6 },
      photoperiod: { start: 2, end: 14, peak: 7 }
    },
    sections: [
      {
        title: 'Nitrogen Toxicity',
        type: 'deficiency',
        content: [
          'Symptoms: Very dark green leaves with a glossy sheen. Leaf tips curl downward ("the claw"). Slow growth despite lush appearance. Stems may weaken.',
          'Common cause: Overfeeding nitrogen-heavy nutrients in veg, using hot soil (too much pre-amendment), or not reducing N when transitioning to flower.',
          'Fix: Flush medium with plain pH-balanced water (3x pot volume). Reduce nitrogen in next feeding by 25-50%. Switch to bloom nutrients if in flower.',
          'Note: Nitrogen toxicity is the most common toxicity in cannabis growing. Many beginners overfeed trying to speed up growth.'
        ]
      },
      {
        title: 'Nutrient Burn',
        type: 'deficiency',
        content: [
          'Symptoms: Brown, crispy leaf tips that progress inward along leaf edges. Affects ALL leaves uniformly, not just old or new growth. Tips look "burnt."',
          'Common cause: Overall EC/PPM too high. Adding too much of all nutrients, not just one. Common with concentrated liquid nutrients or when not measuring properly.',
          'Fix: Flush with plain water. Reduce next feeding strength by 25-50%. Check and calibrate EC/PPM meter. Start at lower strength and increase gradually.',
          'Prevention: Always start at 50% manufacturer strength and increase based on plant response. Measure EC/PPM of runoff — if runoff EC is much higher than input, reduce feeding.'
        ]
      },
      {
        title: 'pH Lockout',
        type: 'deficiency',
        content: [
          'Symptoms: Looks like deficiency symptoms even when feeding adequate nutrients. Multiple deficiency signs appearing simultaneously is the key indicator.',
          'Common cause: pH too high or too low. The #1 cause of "deficiency" symptoms in cannabis. Different nutrients become unavailable at different pH ranges.',
          'Fix: Test pH of input water AND runoff. Adjust input pH to correct range: soil 6.0-7.0, coco 5.5-6.5, hydro 5.5-6.2. Flush if necessary to reset the medium.',
          'Note: Always check pH before adding more nutrients. Adding nutrients to fix a "deficiency" that is actually pH lockout will make the problem worse.'
        ]
      },
      {
        title: 'Light Burn vs Nutrient Burn',
        type: 'paragraphs',
        content: [
          'Light burn and nutrient burn are often confused. Here is how to tell them apart:',
          'Light burn: Affects the TOP leaves closest to the light. Leaves bleach or yellow from the top down. Lower leaves remain healthy. Buds may foxtail (grow elongated).',
          'Nutrient burn: Affects leaf TIPS uniformly across the plant. Brown, crispy tips progress inward. Both top and bottom leaves are affected equally.',
          'Combined: If only the top leaves have burnt tips AND they are also yellowing, you may have both issues. Raise the light AND reduce nutrients.',
          'Fix for light burn: Raise lights 6-12 inches or reduce intensity/dimmer setting. Most LED manufacturers recommend 18-24 inches for flowering.'
        ]
      },
      {
        title: 'Quick Reference',
        type: 'table',
        columns: ['Issue', 'Key Indicator', 'First Step'],
        rows: [
          ['Nitrogen Toxicity', 'Dark clawing leaves', 'Flush and reduce N'],
          ['Nutrient Burn', 'Burnt tips on all leaves', 'Flush and reduce EC'],
          ['pH Lockout', 'Multiple deficiency signs', 'Check and correct pH'],
          ['Light Burn', 'Top leaves bleaching', 'Raise or dim lights']
        ]
      }
    ]
  },
  {
    id: 'pests',
    title: 'Pest & Disease Prevention',
    icon: '&#x1f41b;',
    summary: 'Identify, prevent, and treat common pests and diseases — spider mites, fungus gnats, powdery mildew, and bud rot.',
    applicablePlantTypes: ['autoflower', 'photoperiod'],
    relevantWeeks: {
      autoflower: { start: 1, end: 10, peak: 5 },
      photoperiod: { start: 1, end: 14, peak: 6 }
    },
    sections: [
      {
        title: 'Spider Mites',
        type: 'deficiency',
        content: [
          'Symptoms: Tiny white or yellow specks on leaf tops. Fine webbing on leaf undersides and between branches (advanced infestation). Leaves become stippled, then bronze and die.',
          'Prevention: Maintain humidity above 40% (they thrive in dry conditions). Inspect leaf undersides weekly with a magnifier. Quarantine any new plants for 1-2 weeks.',
          'Treatment: Neem oil spray (during veg only — never in flower). Insecticidal soap. Predatory mites (Phytoseiulus persimilis). For severe infestations, remove heavily affected leaves.',
          'Warning: Spider mites reproduce every 3-5 days. Treat aggressively at first sign. Multiple treatments are needed — eggs are resistant to most sprays.'
        ]
      },
      {
        title: 'Fungus Gnats',
        type: 'deficiency',
        content: [
          'Symptoms: Small black flies buzzing around soil surface. Larvae (tiny white worms) in top inch of soil. Slow growth, wilting despite adequate watering.',
          'Prevention: Allow top inch of soil to dry between waterings. Use fabric pots for better drainage. Avoid overwatering — gnats breed in consistently wet conditions.',
          'Treatment: Yellow sticky traps for adult gnats. Let soil dry out more between waterings. Top-dress with sand or diatomaceous earth. Mosquito bits (BTi) in water — safe and very effective.',
          'Note: Fungus gnats are more of a nuisance than a serious threat in small numbers. Larvae can damage seedling roots but rarely harm established plants.'
        ]
      },
      {
        title: 'Powdery Mildew',
        type: 'deficiency',
        content: [
          'Symptoms: White, powdery patches on leaf surfaces. Starts as small circles and spreads. Leaves may curl, yellow, and die. Affects any part of the plant.',
          'Prevention: Maintain good airflow (oscillating fan). Keep humidity below 60% in flower. Avoid crowding plants. Defoliate to improve air circulation.',
          'Treatment: Remove affected leaves immediately. Milk spray (40% milk, 60% water) as a preventive. Potassium bicarbonate spray. Neem oil in veg. Improve ventilation.',
          'Warning: Powdery mildew spores are systemic — they spread to buds. Buds with PM should not be consumed. Prevention is far easier than cure.'
        ]
      },
      {
        title: 'Bud Rot (Botrytis)',
        type: 'deficiency',
        content: [
          'Symptoms: Gray-brown mold inside dense buds. Affected buds turn mushy and dark. Surrounding sugar leaves yellow and pull away easily. Often noticed late.',
          'Prevention: Keep humidity below 50% during late flower. Ensure strong airflow through and around canopy. Avoid wet buds — no foliar spraying in flower.',
          'Treatment: Carefully remove ALL affected buds with clean scissors — cut well past the visible mold. Do NOT compost infected material. Increase airflow immediately.',
          'Warning: Bud rot is the most devastating late-flower problem. It can destroy an entire harvest in days. Dense indica-dominant buds are most susceptible. Harvest early if it is spreading.'
        ]
      },
      {
        title: 'Prevention Checklist',
        type: 'steps',
        content: [
          'Inspect plants daily — check leaf tops, undersides, stems, and soil surface.',
          'Maintain proper airflow with oscillating fans. Air should gently move all leaves.',
          'Control humidity: 60-70% seedling/veg, 40-50% flower, below 50% late flower.',
          'Keep grow space clean — remove dead leaves, clean spills, sterilize tools between plants.',
          'Quarantine any new plants or clones for 1-2 weeks before introducing to your grow.',
          'Monitor temperature: pests thrive in heat (above 85\u00b0F). Keep temps 70-80\u00b0F.',
          'Use preventive sprays (neem oil, insecticidal soap) during veg — never during flower.'
        ]
      },
      {
        title: 'Treatment Safety',
        type: 'warnings',
        content: [
          'Never spray pesticides or fungicides on buds during flower — residues are inhaled when smoked.',
          'Neem oil is safe for veg but should not be used within 2 weeks of harvest.',
          'When using any spray, test on one leaf first and wait 24 hours to check for burn.',
          'Biological controls (predatory mites, BTi) are the safest options for flower.'
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
          'Target: 60\u00b0F (15\u00b0C) temperature and 60% humidity ("60/60 rule"). Range: 55-65\u00b0F, 55-65% RH.',
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
          'Store jars in a cool, dark place. Target 60-65\u00b0F, 58-62% humidity inside jars.',
          'Week 1: "Burp" jars (open lids) for 15-30 minutes, 2-3 times daily. Check for ammonia smell (too wet).',
          'Week 2-3: Reduce burping to once daily for 10-15 minutes.',
          'Week 4+: Burp once every few days. Cure for minimum 2 weeks, ideally 4-8 weeks.',
          'Use Boveda 62% humidity packs to maintain optimal moisture without guesswork.'
        ]
      },
      {
        title: 'Drying & Curing Targets',
        type: 'table',
        columns: ['Phase', 'Temperature', 'Humidity', 'Duration'],
        rows: [
          ['Drying', '55-65\u00b0F (13-18\u00b0C)', '55-65% RH', '7-14 days'],
          ['Curing (Week 1)', '60-65\u00b0F (15-18\u00b0C)', '58-62% RH', 'Burp 2-3x daily'],
          ['Curing (Week 2-4)', '60-65\u00b0F (15-18\u00b0C)', '58-62% RH', 'Burp 1x daily'],
          ['Long-term Storage', '60-65\u00b0F (15-18\u00b0C)', '58-62% RH', 'Burp weekly']
        ]
      },
      {
        title: 'Trichome Color Guide',
        type: 'table',
        columns: ['Trichome Color', 'Ripeness', 'Expected Effect'],
        rows: [
          ['Clear/Transparent', 'Immature', 'Weak potency, racy/anxious high'],
          ['Milky/Cloudy', 'Peak THC', 'Strongest psychoactive effect, euphoric'],
          ['Amber', 'Degrading to CBN', 'More sedative, body-heavy, couch-lock'],
          ['Mixed (70% milky, 20% amber)', 'Most popular harvest', 'Balanced head/body effect']
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
