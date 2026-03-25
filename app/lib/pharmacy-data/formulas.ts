export interface Formula {
  name: string
  formula: string        // LaTeX notation for KaTeX rendering
  formulaText: string    // Plain text fallback
  description: string
  variables?: { symbol: string; meaning: string }[]
  example?: string
}

export const pharmacyFormulas: Formula[] = [
  {
    name: 'Dose by Weight',
    formula: '\\text{Dose} = \\text{Weight (kg)} \\times \\text{Dose per kg}',
    formulaText: 'Dose = Weight (kg) × Dose per kg',
    description: 'Calculate total dose based on patient weight',
    variables: [
      { symbol: 'Weight', meaning: 'Patient weight in kilograms' },
      { symbol: 'Dose per kg', meaning: 'Prescribed dose per kilogram' },
    ],
    example: '70 kg patient, 5 mg/kg = 350 mg'
  },
  {
    name: 'Dilution Formula',
    formula: 'C_1V_1 = C_2V_2',
    formulaText: 'C₁V₁ = C₂V₂',
    description: 'Calculate concentration or volume when diluting solutions',
    variables: [
      { symbol: 'C₁', meaning: 'Initial concentration' },
      { symbol: 'V₁', meaning: 'Initial volume' },
      { symbol: 'C₂', meaning: 'Final concentration' },
      { symbol: 'V₂', meaning: 'Final volume' },
    ],
    example: '10% × 50mL = 5% × V₂, V₂ = 100mL'
  },
  {
    name: 'IV Rate (mL/hr)',
    formula: '\\text{Rate} = \\frac{\\text{Volume (mL)}}{\\text{Time (hrs)}}',
    formulaText: 'Rate = Volume (mL) ÷ Time (hrs)',
    description: 'Calculate infusion rate in millilitres per hour',
    variables: [
      { symbol: 'Volume', meaning: 'Total volume to infuse in mL' },
      { symbol: 'Time', meaning: 'Duration in hours' },
    ],
    example: '1000 mL over 8 hours = 125 mL/hr'
  },
  {
    name: 'Drops per Minute',
    formula: '\\text{Drops/min} = \\frac{\\text{Volume} \\times \\text{Drop factor}}{\\text{Time (min)}}',
    formulaText: 'Drops/min = (Volume × Drop factor) ÷ Time (min)',
    description: 'Calculate IV drop rate',
    variables: [
      { symbol: 'Volume', meaning: 'Total volume in mL' },
      { symbol: 'Drop factor', meaning: 'Drops per mL (20, 60, or 15)' },
      { symbol: 'Time', meaning: 'Duration in minutes' },
    ],
    example: '500 mL × 20 drops/mL over 240 min = 42 drops/min'
  },
  {
    name: 'Creatinine Clearance (Male)',
    formula: '\\text{CrCl} = \\frac{(140 - \\text{age}) \\times \\text{weight}}{72 \\times \\text{SCr}}',
    formulaText: 'CrCl = [(140 - age) × weight] ÷ (72 × SCr)',
    description: 'Cockcroft-Gault equation for males',
    variables: [
      { symbol: 'age', meaning: 'Patient age in years' },
      { symbol: 'weight', meaning: 'Actual body weight in kg' },
      { symbol: 'SCr', meaning: 'Serum creatinine in mg/dL' },
    ],
    example: 'Age 60, 70kg, SCr 1.2 = 58 mL/min'
  },
  {
    name: 'Creatinine Clearance (Female)',
    formula: '\\text{CrCl}_{\\text{female}} = \\text{CrCl}_{\\text{male}} \\times 0.85',
    formulaText: 'CrCl (female) = Male CrCl × 0.85',
    description: 'Cockcroft-Gault equation for females (multiply male result by 0.85)',
    example: 'Male CrCl 58 × 0.85 = 49 mL/min'
  },
  {
    name: 'Body Surface Area (BSA)',
    formula: '\\text{BSA} = \\sqrt{\\frac{\\text{height} \\times \\text{weight}}{3600}}',
    formulaText: 'BSA = √[(height × weight) ÷ 3600]',
    description: 'Mosteller formula for BSA in m²',
    variables: [
      { symbol: 'height', meaning: 'Height in cm' },
      { symbol: 'weight', meaning: 'Weight in kg' },
    ],
    example: '170 cm, 70 kg = 1.81 m²'
  },
  {
    name: 'Displacement Value',
    formula: 'V_{\\text{diluent}} = V_{\\text{final}} - V_{\\text{displacement}}',
    formulaText: 'Volume of diluent = Final volume - Displacement',
    description: 'Calculate diluent needed when reconstituting powders',
    variables: [
      { symbol: 'V final', meaning: 'Desired total volume' },
      { symbol: 'V displacement', meaning: 'Volume displaced by powder' },
    ],
    example: '10 mL final, 0.8 mL displacement = 9.2 mL diluent'
  },
  {
    name: 'Ideal Body Weight (Male)',
    formula: '\\text{IBW}_{\\text{male}} = 50 + 2.3 \\times (\\text{height in inches} - 60)',
    formulaText: 'IBW (male) = 50 + 2.3 × (height in inches - 60)',
    description: 'Devine formula for ideal body weight in kg (males)',
    variables: [
      { symbol: 'height', meaning: 'Height in inches (or cm ÷ 2.54)' },
    ],
    example: '70 inches = 50 + 2.3 × 10 = 73 kg'
  },
  {
    name: 'Ideal Body Weight (Female)',
    formula: '\\text{IBW}_{\\text{female}} = 45.5 + 2.3 \\times (\\text{height in inches} - 60)',
    formulaText: 'IBW (female) = 45.5 + 2.3 × (height in inches - 60)',
    description: 'Devine formula for ideal body weight in kg (females)',
    variables: [
      { symbol: 'height', meaning: 'Height in inches (or cm ÷ 2.54)' },
    ],
    example: '65 inches = 45.5 + 2.3 × 5 = 57 kg'
  },
]
