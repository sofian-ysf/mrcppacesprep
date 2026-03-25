export interface ConversionRow {
  from: string
  to: string
  factor: number | string
}

export interface ConversionTable {
  title: string
  rows: ConversionRow[]
}

export interface ConcentrationRow {
  expression: string
  meaning: string
}

export interface ConcentrationTable {
  title: string
  rows: ConcentrationRow[]
}

export interface DropFactorRow {
  setType: string
  dropsPerMl: number
}

export interface DropFactorTable {
  title: string
  rows: DropFactorRow[]
}

export const weightConversions: ConversionTable = {
  title: 'Weight',
  rows: [
    { from: '1 kg', to: 'g', factor: 1000 },
    { from: '1 g', to: 'mg', factor: 1000 },
    { from: '1 mg', to: 'mcg', factor: 1000 },
    { from: '1 grain', to: 'mg', factor: 65 },
    { from: '1 lb', to: 'kg', factor: 0.454 },
    { from: '1 oz', to: 'g', factor: 28.35 },
  ]
}

export const volumeConversions: ConversionTable = {
  title: 'Volume',
  rows: [
    { from: '1 L', to: 'mL', factor: 1000 },
    { from: '1 tsp', to: 'mL', factor: 5 },
    { from: '1 tbsp', to: 'mL', factor: 15 },
    { from: '1 fl oz', to: 'mL', factor: 29.57 },
    { from: '1 pint (UK)', to: 'mL', factor: 568 },
    { from: '1 gallon (UK)', to: 'L', factor: 4.546 },
  ]
}

export const concentrationTable: ConcentrationTable = {
  title: 'Concentration',
  rows: [
    { expression: '1% w/v', meaning: '1 g in 100 mL' },
    { expression: '1% w/w', meaning: '1 g in 100 g' },
    { expression: '1% v/v', meaning: '1 mL in 100 mL' },
    { expression: '1 in 1000', meaning: '0.1%' },
    { expression: '1 in 10000', meaning: '0.01%' },
    { expression: 'ppm', meaning: 'mg/L or mg/kg' },
  ]
}

export const dropFactorTable: DropFactorTable = {
  title: 'IV Drop Factors',
  rows: [
    { setType: 'Standard', dropsPerMl: 20 },
    { setType: 'Microdrip', dropsPerMl: 60 },
    { setType: 'Blood', dropsPerMl: 15 },
  ]
}

export const allConversionTables = {
  weight: weightConversions,
  volume: volumeConversions,
  concentration: concentrationTable,
  dropFactor: dropFactorTable,
}
