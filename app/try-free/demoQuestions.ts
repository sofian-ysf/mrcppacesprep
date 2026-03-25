export interface DemoQuestion {
  id: string
  category: string
  type: 'calculation' | 'clinical'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  question_text: string
  options: { letter: string; text: string }[]
  correct_answer: string
  explanation: {
    summary: string
    key_points: string[]
    clinical_pearl: string
    why_wrong: Record<string, string>
    exam_tip: string
    study_tip: string
    calculation_steps?: string[]
  }
}

export const demoQuestions: DemoQuestion[] = [
  // ========== CALCULATION QUESTIONS (5) ==========
  {
    id: 'calc-1',
    category: 'Dosage Calculations',
    type: 'calculation',
    difficulty: 'Medium',
    question_text: 'A patient weighing 72 kg requires gentamicin at a dose of 5 mg/kg once daily. Gentamicin is available as 80 mg/2 mL ampoules. What volume should be administered?',
    options: [
      { letter: 'A', text: '4.5 mL' },
      { letter: 'B', text: '9 mL' },
      { letter: 'C', text: '7.2 mL' },
      { letter: 'D', text: '8 mL' },
    ],
    correct_answer: 'B',
    explanation: {
      summary: 'The dose required is 360 mg (72 kg × 5 mg/kg). With a concentration of 40 mg/mL, the volume needed is 9 mL.',
      key_points: [
        'Always calculate the total dose first: weight × dose per kg',
        'Determine the concentration: 80 mg ÷ 2 mL = 40 mg/mL',
        'Calculate volume: dose needed ÷ concentration = 360 mg ÷ 40 mg/mL = 9 mL',
        'Gentamicin requires therapeutic drug monitoring due to narrow therapeutic index'
      ],
      clinical_pearl: 'Aminoglycosides like gentamicin have concentration-dependent killing - higher peak concentrations improve bacterial killing. Once-daily dosing achieves this while reducing nephrotoxicity risk.',
      why_wrong: {
        'A': '4.5 mL would only provide 180 mg - this is half the required dose. You may have divided instead of multiplied somewhere.',
        'C': '7.2 mL (288 mg) appears to use the weight directly without considering the concentration correctly.',
        'D': '8 mL would provide 320 mg, which doesn\'t match any logical calculation step.'
      },
      exam_tip: 'Write out each step clearly. Many errors come from rushing. Calculate dose first, then convert to volume as a separate step.',
      study_tip: 'Remember: Dose (mg) = Weight (kg) × Dose per kg. Volume (mL) = Dose (mg) ÷ Concentration (mg/mL)',
      calculation_steps: [
        'Step 1: Calculate total dose needed',
        '72 kg × 5 mg/kg = 360 mg',
        'Step 2: Determine concentration of gentamicin',
        '80 mg ÷ 2 mL = 40 mg/mL',
        'Step 3: Calculate volume to administer',
        '360 mg ÷ 40 mg/mL = 9 mL'
      ]
    }
  },
  {
    id: 'calc-2',
    category: 'IV Infusion Rates',
    type: 'calculation',
    difficulty: 'Medium',
    question_text: 'A patient requires 1 litre of sodium chloride 0.9% to be infused over 8 hours. The giving set delivers 20 drops per mL. What is the infusion rate in drops per minute?',
    options: [
      { letter: 'A', text: '42 drops/min' },
      { letter: 'B', text: '21 drops/min' },
      { letter: 'C', text: '25 drops/min' },
      { letter: 'D', text: '32 drops/min' },
    ],
    correct_answer: 'A',
    explanation: {
      summary: 'The infusion rate is calculated as (1000 mL × 20 drops/mL) ÷ (8 hours × 60 min) = 20,000 ÷ 480 = 41.67, rounded to 42 drops/min.',
      key_points: [
        'Convert volume to mL: 1 litre = 1000 mL',
        'Convert time to minutes: 8 hours × 60 = 480 minutes',
        'Formula: (Volume × Drop factor) ÷ Time in minutes',
        'Always round to a practical whole number'
      ],
      clinical_pearl: 'Standard giving sets are 20 drops/mL for clear fluids. Blood giving sets use 15 drops/mL due to the larger drop size needed for blood cells.',
      why_wrong: {
        'B': '21 drops/min is exactly half - you may have used 16 hours instead of 8, or made a division error.',
        'C': '25 drops/min doesn\'t correspond to the correct calculation.',
        'D': '32 drops/min would result from calculation errors in the drop factor or time conversion.'
      },
      exam_tip: 'Memorise the formula: Drops/min = (Volume in mL × Drops/mL) ÷ Time in minutes. Write it at the start of your answer.',
      study_tip: 'Create flashcards for common drop factors: 20 drops/mL (standard), 15 drops/mL (blood), 60 drops/mL (paediatric burette).',
      calculation_steps: [
        'Step 1: Convert units',
        '1 litre = 1000 mL',
        '8 hours = 480 minutes',
        'Step 2: Apply the formula',
        'Drops/min = (Volume × Drop factor) ÷ Time',
        'Drops/min = (1000 × 20) ÷ 480',
        'Drops/min = 20,000 ÷ 480 = 41.67',
        'Step 3: Round appropriately',
        'Answer: 42 drops/min'
      ]
    }
  },
  {
    id: 'calc-3',
    category: 'Dilutions',
    type: 'calculation',
    difficulty: 'Hard',
    question_text: 'You need to prepare 500 mL of a 1 in 10,000 adrenaline solution from adrenaline 1 in 1,000. How much adrenaline 1 in 1,000 do you need?',
    options: [
      { letter: 'A', text: '5 mL' },
      { letter: 'B', text: '50 mL' },
      { letter: 'C', text: '0.5 mL' },
      { letter: 'D', text: '0.05 mL' },
    ],
    correct_answer: 'B',
    explanation: {
      summary: 'To dilute from 1:1,000 to 1:10,000 requires a 10-fold dilution. For 500 mL final volume: 500 mL ÷ 10 = 50 mL of the concentrated solution.',
      key_points: [
        '1 in 1,000 means 1 g in 1000 mL = 1 mg/mL',
        '1 in 10,000 means 1 g in 10,000 mL = 0.1 mg/mL',
        'Dilution factor = 1,000 ÷ 10,000 = 1/10 (10-fold dilution)',
        'Volume of concentrate = Final volume × (Final concentration ÷ Initial concentration)'
      ],
      clinical_pearl: 'Adrenaline 1:1,000 (1 mg/mL) is used for IM injection in anaphylaxis. Adrenaline 1:10,000 (0.1 mg/mL) is used IV in cardiac arrest. Never give 1:1,000 IV - it can cause fatal arrhythmias.',
      why_wrong: {
        'A': '5 mL would create a 1:100,000 solution - 100 times too dilute.',
        'C': '0.5 mL is far too little and would result in an extremely dilute solution.',
        'D': '0.05 mL is impractical to measure and would give negligible concentration.'
      },
      exam_tip: 'With ratio strengths, a larger second number means MORE dilute. 1:10,000 is 10× more dilute than 1:1,000.',
      study_tip: 'Remember: C1V1 = C2V2. Convert ratios to mg/mL first to avoid confusion with the "1 in X" notation.',
      calculation_steps: [
        'Step 1: Understand the concentrations',
        '1:1,000 = 1 mg/mL (initial)',
        '1:10,000 = 0.1 mg/mL (final)',
        'Step 2: Calculate dilution factor',
        '1 mg/mL ÷ 0.1 mg/mL = 10-fold dilution',
        'Step 3: Calculate volume needed',
        'Volume of concentrate = 500 mL ÷ 10 = 50 mL',
        'Add 50 mL of 1:1,000 to 450 mL diluent'
      ]
    }
  },
  {
    id: 'calc-4',
    category: 'Paediatric Dosing',
    type: 'calculation',
    difficulty: 'Medium',
    question_text: 'A 3-year-old child weighing 15 kg requires amoxicillin for acute otitis media. The recommended dose is 40 mg/kg/day in 3 divided doses. Amoxicillin suspension is 250 mg/5 mL. What volume should be given per dose?',
    options: [
      { letter: 'A', text: '2 mL' },
      { letter: 'B', text: '4 mL' },
      { letter: 'C', text: '6 mL' },
      { letter: 'D', text: '8 mL' },
    ],
    correct_answer: 'B',
    explanation: {
      summary: 'Daily dose = 15 kg × 40 mg/kg = 600 mg. Divided by 3 doses = 200 mg per dose. At 250 mg/5 mL concentration, 200 mg requires 4 mL.',
      key_points: [
        'Calculate total daily dose first: 15 × 40 = 600 mg/day',
        'Divide by number of doses: 600 ÷ 3 = 200 mg per dose',
        'Convert to volume: (200 mg × 5 mL) ÷ 250 mg = 4 mL',
        'Always double-check paediatric doses are within safe ranges'
      ],
      clinical_pearl: 'For acute otitis media, NICE recommends amoxicillin first-line if antibiotics are needed. Many cases resolve without antibiotics - consider delayed prescribing.',
      why_wrong: {
        'A': '2 mL would only provide 100 mg - half the required dose per administration.',
        'C': '6 mL (300 mg) is the result if you divided by 2 instead of 3.',
        'D': '8 mL (400 mg) might result from not dividing the daily dose correctly.'
      },
      exam_tip: 'For "divided doses", always divide the daily total by the number of doses BEFORE calculating the volume.',
      study_tip: 'Write the formula: Volume = (Dose required × Volume of stock) ÷ Amount in stock volume',
      calculation_steps: [
        'Step 1: Calculate daily dose',
        '15 kg × 40 mg/kg = 600 mg/day',
        'Step 2: Calculate dose per administration',
        '600 mg ÷ 3 doses = 200 mg per dose',
        'Step 3: Calculate volume per dose',
        '(200 mg × 5 mL) ÷ 250 mg = 4 mL'
      ]
    }
  },
  {
    id: 'calc-5',
    category: 'Unit Conversions',
    type: 'calculation',
    difficulty: 'Easy',
    question_text: 'A patient\'s blood test shows potassium of 3.2 mmol/L. The doctor wants to prescribe potassium chloride to raise this by 0.5 mmol/L. If 1 g of potassium chloride contains 13.4 mmol of potassium, how many grams are needed to provide 40 mmol?',
    options: [
      { letter: 'A', text: '2.0 g' },
      { letter: 'B', text: '2.5 g' },
      { letter: 'C', text: '3.0 g' },
      { letter: 'D', text: '3.5 g' },
    ],
    correct_answer: 'C',
    explanation: {
      summary: 'To provide 40 mmol of potassium when 1 g contains 13.4 mmol: 40 ÷ 13.4 = 2.99 g, rounded to 3.0 g.',
      key_points: [
        'The clinical context about raising potassium is a distractor - focus on the calculation asked',
        'Grams needed = mmol required ÷ mmol per gram',
        '40 mmol ÷ 13.4 mmol/g = 2.99 g ≈ 3.0 g',
        'Normal serum potassium is 3.5-5.0 mmol/L'
      ],
      clinical_pearl: 'Oral potassium is preferred for mild hypokalaemia. IV potassium should not exceed 10 mmol/hour in peripheral lines due to risk of phlebitis and arrhythmias.',
      why_wrong: {
        'A': '2.0 g would only provide 26.8 mmol (2 × 13.4), which is insufficient.',
        'B': '2.5 g would provide 33.5 mmol (2.5 × 13.4), still short of 40 mmol.',
        'D': '3.5 g would provide 46.9 mmol - more than required.'
      },
      exam_tip: 'Read the question carefully - sometimes clinical information is included as context but the actual calculation is straightforward.',
      study_tip: 'Know common conversion factors: KCl contains 13.4 mmol K+ per gram; NaCl contains 17.1 mmol Na+ per gram.',
      calculation_steps: [
        'Step 1: Identify what\'s needed',
        'Need to provide 40 mmol potassium',
        '1 g KCl = 13.4 mmol potassium',
        'Step 2: Calculate grams required',
        'Grams = 40 mmol ÷ 13.4 mmol/g',
        'Grams = 2.985 ≈ 3.0 g'
      ]
    }
  },

  // ========== CLINICAL QUESTIONS (10) ==========
  {
    id: 'clin-1',
    category: 'Drug Interactions',
    type: 'clinical',
    difficulty: 'Medium',
    question_text: 'A 68-year-old patient on warfarin for atrial fibrillation presents with a suspected urinary tract infection. Which antibiotic would be MOST appropriate to prescribe?',
    options: [
      { letter: 'A', text: 'Ciprofloxacin' },
      { letter: 'B', text: 'Trimethoprim' },
      { letter: 'C', text: 'Nitrofurantoin' },
      { letter: 'D', text: 'Co-amoxiclav' },
    ],
    correct_answer: 'C',
    explanation: {
      summary: 'Nitrofurantoin has minimal interaction with warfarin and is first-line for uncomplicated UTI. Other options significantly increase bleeding risk.',
      key_points: [
        'Nitrofurantoin works locally in the urinary tract with minimal systemic absorption',
        'Ciprofloxacin inhibits CYP1A2, significantly increasing warfarin effect',
        'Trimethoprim inhibits CYP2C9, the main enzyme metabolising S-warfarin',
        'Any antibiotic can affect gut flora and vitamin K synthesis, but some have direct CYP interactions'
      ],
      clinical_pearl: 'If a fluoroquinolone or trimethoprim must be used with warfarin, reduce warfarin dose by 25-50% and check INR within 3-5 days.',
      why_wrong: {
        'A': 'Ciprofloxacin significantly potentiates warfarin through CYP1A2 inhibition - INR can double or triple.',
        'B': 'Trimethoprim inhibits CYP2C9 and can increase INR by 50-100%, risking serious bleeding.',
        'D': 'Co-amoxiclav disrupts gut flora affecting vitamin K synthesis and has moderate interaction potential.'
      },
      exam_tip: 'Warfarin interactions are a MRCP PACES favourite. Know which drugs inhibit CYP2C9 (S-warfarin) and CYP1A2/3A4 (R-warfarin).',
      study_tip: 'Mnemonic for warfarin potentiators: "SICKFACES.COM" - Sulfonamides, Isoniazid, Cimetidine, Ketoconazole, Fluconazole, Amiodarone, Ciprofloxacin, Erythromycin, SSRIs, Co-trimoxazole, Omeprazole, Metronidazole'
    }
  },
  {
    id: 'clin-2',
    category: 'Contraindications',
    type: 'clinical',
    difficulty: 'Easy',
    question_text: 'A 28-year-old woman who is 12 weeks pregnant presents with mild-moderate acne. Which of the following is absolutely contraindicated?',
    options: [
      { letter: 'A', text: 'Topical benzoyl peroxide' },
      { letter: 'B', text: 'Oral isotretinoin' },
      { letter: 'C', text: 'Topical azelaic acid' },
      { letter: 'D', text: 'Topical clindamycin' },
    ],
    correct_answer: 'B',
    explanation: {
      summary: 'Isotretinoin is absolutely contraindicated in pregnancy as it is a known teratogen causing severe birth defects in up to 35% of exposed pregnancies.',
      key_points: [
        'Isotretinoin causes craniofacial, cardiac, thymic, and CNS malformations',
        'The Pregnancy Prevention Programme is mandatory for all patients who could become pregnant',
        'Pregnancy must be excluded before starting and monthly during treatment',
        'Two forms of contraception are required during treatment and for 1 month after'
      ],
      clinical_pearl: 'Topical retinoids (tretinoin, adapalene) are also avoided in pregnancy as a precaution, though systemic absorption is minimal. Benzoyl peroxide and azelaic acid are considered safe.',
      why_wrong: {
        'A': 'Benzoyl peroxide is safe in pregnancy - minimal systemic absorption and no evidence of teratogenicity.',
        'C': 'Azelaic acid is safe in pregnancy and is often first-line for acne in pregnant women.',
        'D': 'Topical clindamycin is safe in pregnancy with minimal systemic absorption.'
      },
      exam_tip: 'Absolute contraindications are common exam topics. Know: isotretinoin, methotrexate, warfarin, ACE inhibitors, statins in pregnancy.',
      study_tip: 'Remember "ISOTRETINOIN = IS OUT" in pregnancy. The drug requires a specific pregnancy prevention programme for a reason.'
    }
  },
  {
    id: 'clin-3',
    category: 'Adverse Effects',
    type: 'clinical',
    difficulty: 'Medium',
    question_text: 'A patient started on amiodarone 6 months ago for atrial fibrillation reports new-onset fatigue, weight gain, and feeling cold. Which investigation is MOST appropriate?',
    options: [
      { letter: 'A', text: 'Liver function tests' },
      { letter: 'B', text: 'Thyroid function tests' },
      { letter: 'C', text: 'Chest X-ray' },
      { letter: 'D', text: 'Pulmonary function tests' },
    ],
    correct_answer: 'B',
    explanation: {
      summary: 'The symptoms describe hypothyroidism, a common adverse effect of amiodarone. Thyroid function tests are essential - amiodarone can cause both hypo- and hyperthyroidism.',
      key_points: [
        'Amiodarone is 37% iodine by weight and affects thyroid function in up to 15-20% of patients',
        'Hypothyroidism symptoms: fatigue, weight gain, cold intolerance, constipation, bradycardia',
        'Hyperthyroidism can also occur: weight loss, tremor, palpitations, heat intolerance',
        'Baseline TFTs should be done before starting amiodarone, then every 6 months'
      ],
      clinical_pearl: 'Amiodarone has an extremely long half-life (40-55 days) due to extensive tissue distribution. Thyroid effects can occur months after starting or even after stopping the drug.',
      why_wrong: {
        'A': 'LFTs are important for amiodarone monitoring but don\'t explain these specific symptoms.',
        'C': 'Chest X-ray is useful for pulmonary toxicity (cough, dyspnoea) but not these symptoms.',
        'D': 'PFTs assess pulmonary fibrosis, which presents with dyspnoea, not fatigue and cold intolerance.'
      },
      exam_tip: 'Amiodarone side effects are high-yield: thyroid, pulmonary fibrosis, hepatotoxicity, corneal deposits, photosensitivity, blue-grey skin. Use the mnemonic "CHECK TFTs".',
      study_tip: 'Amiodarone monitoring: TFTs and LFTs every 6 months, chest X-ray annually, eye exam if visual symptoms.'
    }
  },
  {
    id: 'clin-4',
    category: 'Therapeutics',
    type: 'clinical',
    difficulty: 'Medium',
    question_text: 'A 55-year-old man with type 2 diabetes and an eGFR of 45 mL/min/1.73m² has inadequate glycaemic control on metformin. Which add-on therapy is MOST appropriate?',
    options: [
      { letter: 'A', text: 'Pioglitazone' },
      { letter: 'B', text: 'Gliclazide' },
      { letter: 'C', text: 'Empagliflozin' },
      { letter: 'D', text: 'Sitagliptin' },
    ],
    correct_answer: 'C',
    explanation: {
      summary: 'Empagliflozin (an SGLT2 inhibitor) is preferred as it provides cardiovascular and renal protection, which is especially important in this patient with CKD stage 3b.',
      key_points: [
        'SGLT2 inhibitors have proven cardiovascular and renal benefits in major trials (EMPA-REG, DAPA-CKD)',
        'They can be used down to eGFR 20 mL/min for cardiorenal protection, though glycaemic efficacy reduces',
        'Additional benefits: weight loss, blood pressure reduction, low hypoglycaemia risk',
        'NICE recommends SGLT2 inhibitors early if cardiovascular disease or high CV risk'
      ],
      clinical_pearl: 'SGLT2 inhibitors reduce heart failure hospitalisations by ~30% and slow CKD progression. This makes them first-choice add-on therapy for patients with established CVD, heart failure, or CKD.',
      why_wrong: {
        'A': 'Pioglitazone causes fluid retention and is contraindicated in heart failure - a common comorbidity in diabetic CKD patients.',
        'B': 'Gliclazide is effective but increases hypoglycaemia risk, especially with reduced renal function.',
        'D': 'Sitagliptin is safe but lacks the cardiovascular and renal protective benefits of SGLT2 inhibitors.'
      },
      exam_tip: 'Know the hierarchy for type 2 diabetes add-on therapy: SGLT2i if CVD/CKD/HF, then GLP-1 RA, then DPP-4i or sulfonylurea.',
      study_tip: 'SGLT2 inhibitors end in "-gliflozin" (empagliflozin, dapagliflozin, canagliflozin). Their benefits extend beyond glucose control.'
    }
  },
  {
    id: 'clin-5',
    category: 'Monitoring',
    type: 'clinical',
    difficulty: 'Easy',
    question_text: 'A patient is started on lithium for bipolar disorder. Which parameter requires regular monitoring throughout treatment?',
    options: [
      { letter: 'A', text: 'Serum sodium levels' },
      { letter: 'B', text: 'Serum lithium levels' },
      { letter: 'C', text: 'Blood glucose levels' },
      { letter: 'D', text: 'Serum calcium levels' },
    ],
    correct_answer: 'B',
    explanation: {
      summary: 'Lithium has a narrow therapeutic index (0.4-1.0 mmol/L) and requires regular monitoring of serum levels to ensure efficacy and prevent toxicity.',
      key_points: [
        'Target range: 0.4-1.0 mmol/L (0.6-0.8 mmol/L for most patients, up to 1.0 for acute episodes)',
        'Levels taken 12 hours post-dose for consistency',
        'Frequency: weekly until stable, then every 3 months',
        'Additional monitoring: renal function, thyroid function every 6 months'
      ],
      clinical_pearl: 'Lithium toxicity (>1.5 mmol/L) presents with coarse tremor, confusion, ataxia, nausea, and diarrhoea. Severe toxicity can cause seizures, arrhythmias, and renal failure.',
      why_wrong: {
        'A': 'Sodium levels affect lithium but aren\'t routinely monitored - dehydration/low sodium increases lithium levels.',
        'C': 'Blood glucose is not routinely affected by lithium.',
        'D': 'Calcium may increase with lithium-induced hyperparathyroidism but is not the primary monitoring parameter.'
      },
      exam_tip: 'Drugs requiring therapeutic drug monitoring: lithium, digoxin, aminoglycosides, vancomycin, phenytoin, carbamazepine, theophylline.',
      study_tip: 'Lithium mnemonic for monitoring: "LITHIUM" - Levels (serum), I (thyroid/TSH), Tremor assessment, Height/weight, Urea/creatinine, eGFR, More fluids needed (hydration advice)'
    }
  },
  {
    id: 'clin-6',
    category: 'OTC Counselling',
    type: 'clinical',
    difficulty: 'Easy',
    question_text: 'A 45-year-old man requests ibuprofen for back pain. He mentions he takes "water tablets" for his blood pressure. What is your MAIN concern?',
    options: [
      { letter: 'A', text: 'Increased sedation' },
      { letter: 'B', text: 'Reduced antihypertensive effect' },
      { letter: 'C', text: 'Increased risk of hypoglycaemia' },
      { letter: 'D', text: 'Reduced absorption of ibuprofen' },
    ],
    correct_answer: 'B',
    explanation: {
      summary: 'NSAIDs like ibuprofen antagonise the effects of diuretics and most antihypertensives by causing sodium and water retention and reducing renal prostaglandins.',
      key_points: [
        'NSAIDs cause sodium and water retention, opposing diuretic action',
        'Prostaglandin inhibition reduces renal blood flow, affecting antihypertensive efficacy',
        'The combination may also increase risk of acute kidney injury',
        'This interaction applies to all NSAIDs, not just ibuprofen'
      ],
      clinical_pearl: 'The "triple whammy" combination (NSAID + ACE inhibitor/ARB + diuretic) significantly increases AKI risk, especially in elderly or dehydrated patients. Avoid if possible.',
      why_wrong: {
        'A': 'Sedation is not a known interaction between NSAIDs and diuretics.',
        'C': 'Hypoglycaemia is not associated with this combination.',
        'D': 'Absorption is not affected - the interaction is pharmacodynamic, not pharmacokinetic.'
      },
      exam_tip: 'OTC counselling questions often focus on NSAIDs - they interact with antihypertensives, anticoagulants, lithium, methotrexate, and SSRIs.',
      study_tip: 'NSAID cautions: "ABCDE" - Asthma, BP (hypertension), Cardiovascular disease, Dyspepsia/GI bleeds, Elderly/renal impairment'
    }
  },
  {
    id: 'clin-7',
    category: 'Law & Ethics',
    type: 'clinical',
    difficulty: 'Medium',
    question_text: 'A prescription for morphine sulfate tablets (60 tablets, 10 mg) has been written on an FP10. The prescriber has written the quantity in words but not in figures. What should you do?',
    options: [
      { letter: 'A', text: 'Dispense the prescription as written' },
      { letter: 'B', text: 'Add the figures yourself and dispense' },
      { letter: 'C', text: 'Contact the prescriber to amend the prescription' },
      { letter: 'D', text: 'Return the prescription to the patient to get it rewritten' },
    ],
    correct_answer: 'A',
    explanation: {
      summary: 'For Schedule 2 controlled drugs, the quantity must be in words OR figures. Since words are present, the legal requirement is met and the prescription can be dispensed.',
      key_points: [
        'The Misuse of Drugs Regulations 2001 requires quantity in words OR figures for Schedule 2 and 3 CDs',
        'Best practice is both, but legally only one form is required',
        'The prescription must include: patient name/address, drug form/strength, total quantity, dose, prescriber signature and date',
        'CD prescriptions are valid for 28 days from the appropriate date'
      ],
      clinical_pearl: 'While technically legal, prescriptions with quantity in only one format are more prone to errors. As a professional, you may wish to suggest to prescribers they use both formats as best practice.',
      why_wrong: {
        'B': 'Pharmacists cannot add figures themselves - this would be altering a prescription, which is not permitted.',
        'C': 'There is no legal requirement to contact the prescriber as the prescription meets minimum legal requirements.',
        'D': 'Returning the prescription is unnecessary as it is legally valid.'
      },
      exam_tip: 'Know the CD prescription requirements: patient name/address, date, prescriber signature, form, strength, quantity (words OR figures), dose instructions.',
      study_tip: 'CD Schedule 2 examples: morphine, oxycodone, fentanyl, methylphenidate, amphetamines, cocaine. These have the strictest requirements.'
    }
  },
  {
    id: 'clin-8',
    category: 'Adverse Drug Reactions',
    type: 'clinical',
    difficulty: 'Medium',
    question_text: 'A patient taking carbamazepine for epilepsy develops a widespread maculopapular rash with fever, facial swelling, and lymphadenopathy 3 weeks after starting treatment. What is the MOST likely diagnosis?',
    options: [
      { letter: 'A', text: 'Simple drug rash' },
      { letter: 'B', text: 'Stevens-Johnson syndrome' },
      { letter: 'C', text: 'DRESS syndrome' },
      { letter: 'D', text: 'Urticaria' },
    ],
    correct_answer: 'C',
    explanation: {
      summary: 'DRESS (Drug Reaction with Eosinophilia and Systemic Symptoms) syndrome is characterised by rash, fever, facial oedema, and lymphadenopathy 2-8 weeks after starting the causative drug. Carbamazepine is a classic cause.',
      key_points: [
        'DRESS typically occurs 2-8 weeks after starting the drug (later than other drug reactions)',
        'Features: rash, fever, lymphadenopathy, facial oedema, eosinophilia, organ involvement (liver, kidney, lung)',
        'Common causes: carbamazepine, phenytoin, lamotrigine, allopurinol, sulfonamides, dapsone',
        'Mortality is 5-10%, mainly from liver failure'
      ],
      clinical_pearl: 'HLA-B*15:02 testing is recommended before starting carbamazepine in patients of Han Chinese or Thai origin due to increased risk of severe cutaneous reactions including DRESS and SJS/TEN.',
      why_wrong: {
        'A': 'Simple drug rashes lack systemic features like fever, lymphadenopathy, and facial swelling.',
        'B': 'Stevens-Johnson syndrome presents with mucosal involvement (mouth, eyes, genitals) and skin blistering/sloughing, not the features described.',
        'D': 'Urticaria is hives (wheals) without systemic symptoms and occurs within hours of exposure.'
      },
      exam_tip: 'DRESS timing is key: 2-8 weeks post-drug. SJS/TEN is usually 1-3 weeks. Simple rashes are often within days.',
      study_tip: 'DRESS mnemonic: "DRESS" - Drug Rash, Eosinophilia, Systemic Symptoms. Remember the "face" involvement - facial oedema is characteristic.'
    }
  },
  {
    id: 'clin-9',
    category: 'Pharmacology',
    type: 'clinical',
    difficulty: 'Medium',
    question_text: 'By what mechanism do ACE inhibitors reduce blood pressure?',
    options: [
      { letter: 'A', text: 'Block calcium channels in vascular smooth muscle' },
      { letter: 'B', text: 'Reduce conversion of angiotensin I to angiotensin II' },
      { letter: 'C', text: 'Block angiotensin II at the AT1 receptor' },
      { letter: 'D', text: 'Inhibit renin release from the kidney' },
    ],
    correct_answer: 'B',
    explanation: {
      summary: 'ACE inhibitors block angiotensin-converting enzyme, preventing conversion of angiotensin I to the potent vasoconstrictor angiotensin II, thereby reducing blood pressure.',
      key_points: [
        'Angiotensin II causes vasoconstriction and aldosterone release (sodium/water retention)',
        'ACE also breaks down bradykinin - ACE inhibition increases bradykinin, causing cough in 10-15% of patients',
        'Effects: reduced peripheral resistance, reduced aldosterone, natriuresis',
        'Examples: ramipril, lisinopril, enalapril, perindopril'
      ],
      clinical_pearl: 'The dry cough from ACE inhibitors is due to bradykinin accumulation in the lungs, not angiotensin effects. ARBs don\'t cause this because they don\'t affect bradykinin metabolism.',
      why_wrong: {
        'A': 'This describes calcium channel blockers (amlodipine, nifedipine).',
        'C': 'This describes angiotensin receptor blockers/ARBs (losartan, candesartan).',
        'D': 'This describes direct renin inhibitors (aliskiren).'
      },
      exam_tip: 'Know the RAAS pathway: Renin → Angiotensinogen → Angiotensin I → (ACE) → Angiotensin II → AT1 receptor. Know where each drug class acts.',
      study_tip: 'ACE inhibitors end in "-pril". ARBs end in "-sartan". Don\'t confuse their mechanisms - it\'s a common exam trick.'
    }
  },
  {
    id: 'clin-10',
    category: 'Patient Counselling',
    type: 'clinical',
    difficulty: 'Easy',
    question_text: 'A patient is prescribed prednisolone 40 mg daily for an acute exacerbation of COPD. Which counselling point is MOST important?',
    options: [
      { letter: 'A', text: 'Take with food to reduce stomach irritation' },
      { letter: 'B', text: 'Avoid grapefruit juice' },
      { letter: 'C', text: 'Do not stop the tablets suddenly if taken for more than 3 weeks' },
      { letter: 'D', text: 'Take the tablets at bedtime for best effect' },
    ],
    correct_answer: 'C',
    explanation: {
      summary: 'Corticosteroids suppress the hypothalamic-pituitary-adrenal (HPA) axis. Abrupt discontinuation after prolonged use (>3 weeks) can cause adrenal insufficiency, which can be life-threatening.',
      key_points: [
        'HPA axis suppression occurs with doses ≥7.5 mg prednisolone for >3 weeks',
        'Symptoms of adrenal insufficiency: weakness, fatigue, hypotension, hypoglycaemia, collapse',
        'Gradual dose reduction allows the adrenal glands to recover',
        'Patients should carry a steroid card if on prolonged treatment'
      ],
      clinical_pearl: 'For COPD exacerbations, short courses (5-7 days) of 30-40 mg prednisolone usually don\'t require tapering. However, always check the intended duration and counsel appropriately.',
      why_wrong: {
        'A': 'Taking with food is good advice for GI protection but is less critical than preventing adrenal crisis.',
        'B': 'Grapefruit interaction is significant for some drugs but not a major concern with prednisolone.',
        'D': 'Morning dosing is preferred to mimic natural cortisol rhythm and reduce insomnia - not bedtime.'
      },
      exam_tip: 'The 3-week rule for steroid tapering is commonly tested. Also know when steroid cards are needed: treatment >3 weeks, repeated courses, doses ≥7.5 mg prednisolone equivalent.',
      study_tip: 'Steroid equivalence: Prednisolone 5 mg = Hydrocortisone 20 mg = Dexamethasone 0.75 mg. Know these for conversion questions.'
    }
  }
]
