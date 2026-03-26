// Demo content for free trial page - MRCP PACES exam preparation samples

export interface DemoSpotDiagnosis {
  id: string
  image_url: string
  diagnosis: string
  description: string
  key_features: string[]
  exam_tips: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

export interface DemoStation {
  id: string
  station_number: 1 | 2 | 3 | 4 | 5
  station_type: string
  title: string
  scenario_text: string
  patient_info: string
  task_instructions: string
  time_limit_seconds: number
  model_answer: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

export interface DemoDifferential {
  id: string
  sign_name: string
  category: string
  differentials_list: {
    common: string[]
    less_common: string[]
    rare_but_important: string[]
  }
  memory_aid: string
  exam_relevance: string
}

export interface DemoSBA {
  id: string
  question_text: string
  options: { letter: string; text: string }[]
  correct_answer: string
  explanation: string
  key_points: string[]
  clinical_pearl: string
  exam_tip: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

export const demoSpotDiagnoses: DemoSpotDiagnosis[] = [
  {
    id: 'demo-spot-1',
    image_url: '/demo/psoriasis-placeholder.svg',
    diagnosis: 'Psoriasis',
    description: 'Well-demarcated erythematous plaques with silvery scales on extensor surfaces',
    key_features: [
      'Silvery scale on erythematous base',
      'Well-defined borders',
      'Extensor surface distribution (elbows, knees)',
      'Auspitz sign (pinpoint bleeding when scale removed)',
      'Koebner phenomenon'
    ],
    exam_tips: 'Always examine the nails for pitting, onycholysis, and subungual hyperkeratosis. Check scalp and umbilicus. Ask about joint pain for psoriatic arthritis.',
    difficulty: 'Easy'
  },
  {
    id: 'demo-spot-2',
    image_url: '/demo/clubbing-placeholder.svg',
    diagnosis: 'Finger Clubbing',
    description: 'Loss of nail bed angle with increased nail curvature and soft tissue swelling',
    key_features: [
      'Loss of angle at nail bed (>180 degrees)',
      'Increased nail curvature',
      'Fluctuant nail bed',
      'Drumstick appearance of fingers',
      'Schamroth sign positive'
    ],
    exam_tips: 'Demonstrate Schamroth sign by opposing thumbnails. Always proceed to examine for respiratory and cardiac causes. Consider IBD and hepatic causes.',
    difficulty: 'Easy'
  },
  {
    id: 'demo-spot-3',
    image_url: '/demo/butterfly-rash-placeholder.svg',
    diagnosis: 'Malar (Butterfly) Rash',
    description: 'Erythematous rash across the malar eminences and nasal bridge, sparing nasolabial folds',
    key_features: [
      'Bilateral malar distribution',
      'Nasolabial fold sparing',
      'Photosensitivity',
      'Erythematous, may be raised',
      'Associated with SLE'
    ],
    exam_tips: 'Examine for other SLE features: oral ulcers, alopecia, joint swelling, livedo reticularis. Ask about photosensitivity, arthralgia, and fatigue.',
    difficulty: 'Medium'
  },
  {
    id: 'demo-spot-4',
    image_url: '/demo/erythema-nodosum-placeholder.svg',
    diagnosis: 'Erythema Nodosum',
    description: 'Tender, red nodules on the anterior shins representing panniculitis',
    key_features: [
      'Tender subcutaneous nodules',
      'Bilateral anterior shins',
      'Initially bright red, becomes bruise-like',
      'Resolves over 2-6 weeks',
      'No ulceration'
    ],
    exam_tips: 'Consider underlying causes: sarcoidosis, IBD, streptococcal infection, TB, drugs (sulfonamides, OCP). Request CXR for hilar lymphadenopathy.',
    difficulty: 'Medium'
  },
  {
    id: 'demo-spot-5',
    image_url: '/demo/dupuytren-placeholder.svg',
    diagnosis: 'Dupuytren Contracture',
    description: 'Fibrosis and thickening of the palmar fascia causing flexion contracture',
    key_features: [
      'Palmar nodules and cords',
      'Fixed flexion at MCP and PIP joints',
      'Ring and little fingers most affected',
      'Cannot place hand flat on table (Hueston test)',
      'Bilateral in 50% of cases'
    ],
    exam_tips: 'Ask about alcohol use, diabetes, epilepsy medications, and family history. Check for Garrod knuckle pads and Peyronie disease associations.',
    difficulty: 'Easy'
  }
]

export const demoStations: DemoStation[] = [
  {
    id: 'demo-station-1',
    station_number: 2,
    station_type: 'history',
    title: 'Chest Pain History',
    scenario_text: 'A 55-year-old man presents to the acute medical unit with chest pain that started 2 hours ago while he was gardening. He describes the pain as a heavy pressure across his chest. He appears anxious but is haemodynamically stable.',
    patient_info: 'Mr. David Johnson, 55 years old, works as an accountant. He has a history of hypertension and type 2 diabetes. He smokes 20 cigarettes per day and drinks alcohol socially.',
    task_instructions: 'Take a focused history from this patient presenting with chest pain. You have 7 minutes for the history, after which the examiner will ask you to present your findings and differential diagnosis.',
    time_limit_seconds: 420,
    model_answer: `Key areas to cover in the history:

**Pain Characterisation (SOCRATES):**
- Site: Central/retrosternal
- Onset: Sudden while gardening (exertional)
- Character: Heavy, pressure, crushing, tight band
- Radiation: Left arm, jaw, neck, back
- Associated features: Sweating, nausea, SOB, palpitations
- Timing: Duration, constant vs intermittent
- Exacerbating/relieving: Rest, GTN, movement, respiration
- Severity: Scale 1-10

**Cardiac Risk Factors:**
- Hypertension (known)
- Diabetes (known)
- Smoking history (20/day)
- Hypercholesterolaemia
- Family history of IHD
- Previous cardiac history

**Differential Diagnosis to Consider:**
- Acute coronary syndrome (most likely given history)
- Stable angina
- Aortic dissection
- Pulmonary embolism
- Pericarditis
- Musculoskeletal
- GORD/oesophageal spasm

**Red Flags:**
- Tearing pain radiating to back (dissection)
- Pleuritic component with SOB (PE)
- Positional pain with viral prodrome (pericarditis)`,
    difficulty: 'Medium'
  },
  {
    id: 'demo-station-2',
    station_number: 4,
    station_type: 'communication',
    title: 'Breaking Bad News - New Cancer Diagnosis',
    scenario_text: 'You are the medical registrar. Mrs. Patricia Brown, a 62-year-old retired teacher, was admitted 3 days ago with jaundice and weight loss. CT scan results now show a pancreatic head mass with liver metastases, consistent with advanced pancreatic cancer. She is accompanied by her daughter.',
    patient_info: 'Mrs. Patricia Brown, 62 years old, retired primary school teacher. Previously fit and well with no significant past medical history. Married with two adult children. Her husband passed away 2 years ago.',
    task_instructions: 'The CT scan results are now available. Break the news to Mrs. Brown about her diagnosis. Her daughter is present and you have permission to discuss with both. You have 7 minutes for this consultation.',
    time_limit_seconds: 420,
    model_answer: `Key elements for breaking bad news (SPIKES framework):

**Setting:**
- Private, comfortable room
- Adequate time, no interruptions
- Appropriate people present
- Sit at same level, open body language

**Perception:**
- What does she understand about her admission?
- What has she been told about the tests?
- What are her expectations?

**Invitation:**
- How much information would she like?
- Would she like her daughter involved?
- Is she ready to hear the results?

**Knowledge:**
- Warning shot: "I'm afraid the results show something serious"
- Clear, simple language
- Avoid medical jargon
- Give information in small chunks
- Check understanding throughout

**Emotions:**
- Acknowledge and validate emotions
- Allow silence and time to process
- Empathetic responses
- Offer tissues, time, support

**Strategy and Summary:**
- Outline next steps (oncology referral, MDT discussion)
- Palliative care involvement
- Support services available
- Written information
- Follow-up appointment
- How to contact if concerns
- Involve Macmillan/CNS

**Important Points:**
- Be honest but compassionate
- Avoid false reassurance
- Check understanding
- Offer hope where appropriate (symptom control, support)
- Document the conversation`,
    difficulty: 'Hard'
  }
]

export const demoDifferentials: DemoDifferential[] = [
  {
    id: 'demo-diff-1',
    sign_name: 'Clubbing',
    category: 'Hands',
    differentials_list: {
      common: [
        'Lung cancer',
        'Bronchiectasis',
        'Cyanotic heart disease',
        'Infective endocarditis',
        'Idiopathic pulmonary fibrosis'
      ],
      less_common: [
        'Inflammatory bowel disease',
        'Cirrhosis',
        'Coeliac disease',
        'Mesothelioma',
        'Empyema'
      ],
      rare_but_important: [
        'Thyroid acropachy',
        'Familial/hereditary',
        'POEMS syndrome',
        'Atrial myxoma',
        'Pulmonary AV malformation'
      ]
    },
    memory_aid: 'CLUBBING: Cancer, Lung suppuration (bronchiectasis/empyema), Ulcerative colitis/Crohn\'s, Blue babies (cyanotic CHD), Benign mesothelioma/Byssinosis, Infective endocarditis, Neoplasm, Gut (IBD/coeliac)',
    exam_relevance: 'Very common PACES finding. Always demonstrate Schamroth sign. If clubbing present, perform focused respiratory and cardiac examination.'
  },
  {
    id: 'demo-diff-2',
    sign_name: 'Splenomegaly',
    category: 'Abdomen',
    differentials_list: {
      common: [
        'Chronic liver disease/portal hypertension',
        'Haematological malignancy (CML, CLL, lymphoma)',
        'Myelofibrosis',
        'Infective (EBV, malaria)',
        'Haemolytic anaemia'
      ],
      less_common: [
        'Polycythaemia vera',
        'Sarcoidosis',
        'Amyloidosis',
        'Storage disorders (Gaucher\'s)',
        'Splenic vein thrombosis'
      ],
      rare_but_important: [
        'Felty syndrome (RA + splenomegaly + neutropenia)',
        'Leishmaniasis',
        'Systemic mastocytosis',
        'Histiocytosis',
        'Splenic cysts/abscess'
      ]
    },
    memory_aid: 'CHICAGO: Cancer (haem malignancies), Haemolysis, Infection (EBV, malaria), Congestion (portal HTN), Autoimmune, Gaucher\'s/storage, Other (myelofibrosis)',
    exam_relevance: 'A massive spleen (crossing midline) strongly suggests CML, myelofibrosis, or malaria. Always examine for associated lymphadenopathy and hepatomegaly.'
  },
  {
    id: 'demo-diff-3',
    sign_name: 'Bilateral Basal Crackles',
    category: 'Respiratory',
    differentials_list: {
      common: [
        'Pulmonary fibrosis (IPF)',
        'Heart failure (pulmonary oedema)',
        'Bronchiectasis',
        'Pneumonia (bilateral)',
        'Pulmonary oedema'
      ],
      less_common: [
        'Connective tissue disease-associated ILD',
        'Drug-induced fibrosis (amiodarone, methotrexate)',
        'Hypersensitivity pneumonitis',
        'Asbestosis',
        'Sarcoidosis'
      ],
      rare_but_important: [
        'Alveolar proteinosis',
        'Lymphangitis carcinomatosis',
        'Radiation pneumonitis',
        'Eosinophilic pneumonia',
        'Langerhans cell histiocytosis'
      ]
    },
    memory_aid: 'Fine = Fibrosis; Coarse = Cardiac failure or infection. "Velcro-like" crackles that don\'t clear with coughing suggest IPF.',
    exam_relevance: 'Character of crackles matters: fine inspiratory crackles suggest fibrosis; coarse crackles suggest fluid or secretions. Check for clubbing, cyanosis, and signs of CTD.'
  },
  {
    id: 'demo-diff-4',
    sign_name: 'Papilloedema',
    category: 'Neurology',
    differentials_list: {
      common: [
        'Space-occupying lesion (tumour, abscess)',
        'Idiopathic intracranial hypertension',
        'Malignant hypertension',
        'Cerebral venous sinus thrombosis',
        'Hydrocephalus'
      ],
      less_common: [
        'Meningitis',
        'Subarachnoid haemorrhage',
        'Lead poisoning',
        'CO2 retention',
        'Guillain-Barre syndrome'
      ],
      rare_but_important: [
        'Vitamin A toxicity',
        'Spinal cord tumours',
        'Addison\'s disease',
        'Hypocalcaemia',
        'Foster Kennedy syndrome'
      ]
    },
    memory_aid: 'RAISED ICP: Raised intracranial pressure causes - Abscess, Idiopathic ICH, SOL, Encephalopathy, Drugs, Infection, Cerebral vein thrombosis, Pseudotumour',
    exam_relevance: 'Bilateral papilloedema is a medical emergency. Check visual acuity and fields. Note whether unilateral (consider optic neuritis) or bilateral (suggests raised ICP).'
  },
  {
    id: 'demo-diff-5',
    sign_name: 'Janeway Lesions',
    category: 'Hands',
    differentials_list: {
      common: [
        'Infective endocarditis'
      ],
      less_common: [
        'Gonococcal infection',
        'Marantic endocarditis',
        'SLE with Libman-Sacks endocarditis'
      ],
      rare_but_important: [
        'Haemolytic uraemic syndrome',
        'Systemic vasculitis'
      ]
    },
    memory_aid: 'JANEway = pAiNless (vs Osler nodes which are tender). Janeway lesions are painless erythematous macules on palms/soles. Osler nodes are painful nodules on fingers/toes.',
    exam_relevance: 'Highly specific for endocarditis. Always examine for splinter haemorrhages, murmurs, splenomegaly, and other stigmata. Check temperature and consider blood cultures.'
  }
]

export const demoSBAs: DemoSBA[] = [
  {
    id: 'demo-sba-1',
    question_text: 'A 65-year-old woman presents with progressive breathlessness and a dry cough over 6 months. She has never smoked. Examination reveals fine bibasal inspiratory crackles and finger clubbing. Her SpO2 is 94% on air. A CT chest shows bilateral reticular changes with honeycombing predominantly in the lower lobes.\n\nWhat is the MOST likely diagnosis?',
    options: [
      { letter: 'A', text: 'COPD' },
      { letter: 'B', text: 'Idiopathic pulmonary fibrosis' },
      { letter: 'C', text: 'Bronchiectasis' },
      { letter: 'D', text: 'Heart failure' },
      { letter: 'E', text: 'Hypersensitivity pneumonitis' }
    ],
    correct_answer: 'B',
    explanation: 'The combination of progressive breathlessness, dry cough, fine bibasal inspiratory crackles ("velcro" crackles), finger clubbing, and CT findings of bilateral reticular changes with honeycombing in a basal predominant pattern is classic for idiopathic pulmonary fibrosis (IPF).\n\nIPF is the most common idiopathic interstitial pneumonia, typically presenting in patients over 50 years. The CT pattern of usual interstitial pneumonia (UIP) with honeycombing is highly suggestive.',
    key_points: [
      'IPF presents with progressive dyspnoea and dry cough',
      'Fine "velcro-like" bibasal crackles are characteristic',
      'Clubbing occurs in 25-50% of patients',
      'CT shows basal predominant honeycombing in UIP pattern',
      'Prognosis is poor with median survival 3-5 years'
    ],
    clinical_pearl: 'The presence of honeycombing on HRCT in the appropriate clinical context can be sufficient for diagnosis without lung biopsy. Antifibrotic agents (pirfenidone, nintedanib) slow disease progression.',
    exam_tip: 'In PACES, fine bibasal crackles + clubbing without cardiac signs strongly suggests pulmonary fibrosis. Always auscultate sitting forward at the bases.',
    difficulty: 'Medium'
  },
  {
    id: 'demo-sba-2',
    question_text: 'A 45-year-old man with a history of alcohol excess presents with confusion. On examination, he has nystagmus, bilateral sixth nerve palsies, and ataxia. His blood glucose is normal.\n\nWhat is the MOST appropriate immediate management?',
    options: [
      { letter: 'A', text: 'Oral thiamine supplementation' },
      { letter: 'B', text: 'IV Pabrinex (thiamine) followed by glucose' },
      { letter: 'C', text: 'IV glucose followed by Pabrinex' },
      { letter: 'D', text: 'Oral vitamin B complex' },
      { letter: 'E', text: 'IV normal saline and observation' }
    ],
    correct_answer: 'B',
    explanation: 'This patient has Wernicke\'s encephalopathy, characterised by the classic triad of confusion, ophthalmoplegia (nystagmus, sixth nerve palsies), and ataxia. This is caused by thiamine (vitamin B1) deficiency, commonly seen in chronic alcohol excess.\n\nIt is CRITICAL to give thiamine BEFORE glucose, as glucose metabolism consumes thiamine and can precipitate or worsen Wernicke\'s encephalopathy. IV Pabrinex provides high-dose thiamine and other B vitamins.',
    key_points: [
      'Wernicke\'s triad: confusion, ophthalmoplegia, ataxia',
      'ALWAYS give thiamine BEFORE glucose',
      'IV Pabrinex given as 2 pairs of ampoules TDS for 3-5 days',
      'Only 10-20% show complete triad - high index of suspicion needed',
      'Untreated can progress to Korsakoff syndrome (irreversible)'
    ],
    clinical_pearl: 'If in doubt, give Pabrinex. It is safe and the consequences of missing Wernicke\'s are devastating. Korsakoff syndrome causes permanent anterograde amnesia with confabulation.',
    exam_tip: 'This is a classic PACES scenario. Remember: "Banana bag before sugar" - thiamine must come first to prevent Wernicke\'s.',
    difficulty: 'Easy'
  },
  {
    id: 'demo-sba-3',
    question_text: 'A 28-year-old woman presents with a 2-day history of right-sided facial weakness. She cannot close her right eye or raise her right eyebrow. Her symptoms started suddenly. She has no other neurological symptoms, no hearing loss, and no vesicles in the ear canal.\n\nWhat is the MOST likely diagnosis?',
    options: [
      { letter: 'A', text: 'Stroke' },
      { letter: 'B', text: 'Bell\'s palsy' },
      { letter: 'C', text: 'Ramsay Hunt syndrome' },
      { letter: 'D', text: 'Parotid tumour' },
      { letter: 'E', text: 'Multiple sclerosis' }
    ],
    correct_answer: 'B',
    explanation: 'Bell\'s palsy is an acute idiopathic lower motor neuron (LMN) facial nerve palsy. The key feature distinguishing LMN from upper motor neuron (UMN) lesions is involvement of the forehead - in LMN palsies, the patient cannot raise the eyebrow or close the eye on the affected side.\n\nThe sudden onset, isolated facial weakness without other neurological features, and absence of vesicles (which would suggest Ramsay Hunt syndrome) makes Bell\'s palsy most likely.',
    key_points: [
      'LMN palsy affects ALL facial muscles including forehead',
      'UMN palsy (stroke) spares the forehead due to bilateral cortical innervation',
      'Bell\'s palsy is a diagnosis of exclusion',
      'Peak incidence age 15-45, often post-viral',
      '85% recover fully within 3 months'
    ],
    clinical_pearl: 'In Bell\'s palsy, give prednisolone within 72 hours of onset (improves recovery rates). Eye care is essential - lubricating drops, tape eye closed at night to prevent exposure keratopathy.',
    exam_tip: 'The examiner may ask you to demonstrate UMN vs LMN differentiation. Always test: "Raise your eyebrows, close your eyes tightly, show me your teeth".',
    difficulty: 'Easy'
  },
  {
    id: 'demo-sba-4',
    question_text: 'A 72-year-old man with known atrial fibrillation presents with sudden onset severe headache, vomiting, and reduced consciousness. His INR is 4.8 (target 2-3). CT head shows a large intracerebral haemorrhage. He is on warfarin.\n\nWhat is the MOST appropriate immediate treatment to reverse the anticoagulation?',
    options: [
      { letter: 'A', text: 'Fresh frozen plasma alone' },
      { letter: 'B', text: 'Vitamin K alone' },
      { letter: 'C', text: 'Prothrombin complex concentrate (PCC) and IV vitamin K' },
      { letter: 'D', text: 'Tranexamic acid' },
      { letter: 'E', text: 'Stop warfarin and observe' }
    ],
    correct_answer: 'C',
    explanation: 'This patient has a life-threatening warfarin-associated intracerebral haemorrhage requiring urgent reversal. The recommended treatment is:\n\n1. Prothrombin complex concentrate (PCC) - provides immediate reversal by replacing clotting factors II, VII, IX, X\n2. IV Vitamin K (5-10mg) - provides sustained reversal as PCC effect is temporary\n\nPCC is preferred over FFP because it acts faster, requires smaller volume (reducing fluid overload risk), and achieves more complete reversal.',
    key_points: [
      'PCC provides rapid reversal within 10-15 minutes',
      'Vitamin K takes 4-6 hours for effect but provides sustained reversal',
      'FFP requires large volumes (15ml/kg) with associated risks',
      'Target INR <1.5 for life-threatening bleeding',
      'Neurosurgical opinion should be sought urgently'
    ],
    clinical_pearl: 'For DOAC-associated bleeding, specific reversal agents exist: idarucizumab for dabigatran, andexanet alfa for factor Xa inhibitors (rivaroxaban, apixaban). PCC can be used if specific agents unavailable.',
    exam_tip: 'Know the reversal protocols for warfarin and DOACs. PCC + vitamin K for warfarin major bleeding is a commonly tested combination.',
    difficulty: 'Medium'
  },
  {
    id: 'demo-sba-5',
    question_text: 'A 55-year-old woman with rheumatoid arthritis on methotrexate and prednisolone presents with progressive breathlessness over 3 months. Chest examination reveals fine bibasal crackles. Her HRCT shows ground-glass opacities and early fibrotic changes.\n\nWhich medication is MOST likely responsible?',
    options: [
      { letter: 'A', text: 'Prednisolone' },
      { letter: 'B', text: 'Methotrexate' },
      { letter: 'C', text: 'Paracetamol' },
      { letter: 'D', text: 'Folic acid' },
      { letter: 'E', text: 'Omeprazole' }
    ],
    correct_answer: 'B',
    explanation: 'Methotrexate pneumonitis is a well-recognised complication of methotrexate therapy. It typically presents with progressive dyspnoea, dry cough, and fever. HRCT findings include ground-glass opacities with or without fibrosis.\n\nThe pneumonitis can occur at any time during treatment (typically 6-12 months) and is not dose-dependent. It is thought to be a hypersensitivity reaction.',
    key_points: [
      'Methotrexate pneumonitis can occur at any dose and any time',
      'Symptoms: dyspnoea, dry cough, fever',
      'HRCT: ground-glass opacities +/- fibrosis',
      'Treatment: stop methotrexate, corticosteroids',
      'Usually reversible if caught early'
    ],
    clinical_pearl: 'Other drugs causing pulmonary fibrosis include amiodarone, nitrofurantoin, bleomycin, and busulfan. Always take a thorough drug history in any patient with new respiratory symptoms.',
    exam_tip: 'Drug-induced lung disease is a common PACES topic. Know the major culprits: methotrexate, amiodarone, nitrofurantoin, and the patterns they cause.',
    difficulty: 'Medium'
  }
]

// FAQ content for the demo page
export const demoFAQs = [
  {
    question: "What's included in the free demo?",
    answer: "The free demo includes sample content from all four MRCP PACES modules: 5 Spot Diagnoses, 2 PACES Stations, 5 Differential Diagnosis flashcards, and 5 SBA questions. This gives you a taste of our complete question bank without any commitment."
  },
  {
    question: "How is the full version different from the demo?",
    answer: "The full version includes 2,000+ questions across all modules, progress tracking, spaced repetition, mock exams, detailed analytics, and regular content updates. You also get access to our mobile-friendly platform and can study anytime, anywhere."
  },
  {
    question: "Do I need to create an account to try the demo?",
    answer: "No account or credit card is required for the free demo. Simply browse through the sample content. When you're ready for full access, you can create an account and subscribe."
  },
  {
    question: "How often is the content updated?",
    answer: "Our question bank is reviewed and updated regularly by practising physicians. We add new questions monthly and update existing content based on the latest guidelines and exam feedback."
  },
  {
    question: "Can I use this on my mobile device?",
    answer: "Yes! MRCPPACESPREP is fully responsive and works on all devices - desktop, tablet, and mobile. Study during your commute, during breaks, or whenever you have a few spare minutes."
  },
  {
    question: "What is the pass rate for users of your platform?",
    answer: "Our users have achieved a 94% pass rate on the MRCP PACES exam. The combination of comprehensive content, spaced repetition, and realistic practice scenarios prepares you effectively for exam day."
  }
]
