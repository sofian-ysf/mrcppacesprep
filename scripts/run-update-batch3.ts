import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const explanations = [
  {
    id: 'a7c72e2c-f235-45c6-94a8-9dcf3ceb4294',
    order: 41,
    structured: {
      summary: "The best approach for potential SSRI-related sexual dysfunction is to monitor and discuss options if it occurs - not all patients experience it, and there are management strategies if it develops.",
      key_points: [
        "Sexual dysfunction affects 25-73% of SSRI users but varies significantly between individuals",
        "Management options if it occurs: dose reduction, drug holidays, switching agents, adding medications",
        "Bupropion and mirtazapine have lower sexual dysfunction rates than SSRIs",
        "Sildenafil may help SSRI-induced erectile dysfunction but doesn't address other aspects"
      ],
      clinical_pearl: "Many patients stop antidepressants due to sexual side effects without telling their doctor. Proactively discussing this possibility and having a management plan increases adherence and treatment success.",
      why_wrong: {
        A: "Switching to benzodiazepines is inappropriate as they don't treat GAD long-term and carry dependence risks - this sacrifices effective treatment for a potential side effect.",
        B: "Adding sildenafil preemptively is premature - the patient may not experience dysfunction, and sildenafil only helps erectile function, not libido or anorgasmia.",
        C: "Switching to bupropion immediately denies the patient a potentially effective treatment without knowing if they'll experience the side effect.",
        E: "Switching to mirtazapine immediately is premature - it also has side effects (weight gain, sedation) and the patient may do well on sertraline."
      },
      exam_tip: "For 'concerned about potential side effect' questions, monitoring first is usually correct unless the side effect is dangerous. Don't abandon effective treatment preemptively.",
      related_topics: ["ssri-side-effects", "sexual-dysfunction", "antidepressant-management"]
    }
  },
  {
    id: 'b630dd53-6bb9-4ac6-ab1e-9f5b572c7d8f',
    order: 42,
    structured: {
      summary: "Prolactin monitoring is not required for lithium as it doesn't affect prolactin levels. Lithium monitoring focuses on thyroid (TSH), renal function, electrolytes, and cardiac (ECG).",
      key_points: [
        "Lithium monitoring: TSH, renal function (eGFR, creatinine), electrolytes, ECG",
        "Prolactin monitoring is for antipsychotics, especially risperidone",
        "Lithium affects thyroid via inhibiting T4 to T3 conversion",
        "ECG monitors for lithium effects on cardiac conduction"
      ],
      clinical_pearl: "Use 'TRE' for lithium monitoring: Thyroid, Renal, Electrolytes. Add ECG at baseline. Lithium levels should be checked weekly until stable, then every 3-6 months.",
      why_wrong: {
        A: "Thyroid function tests ARE relevant - lithium commonly causes hypothyroidism and rarely hyperthyroidism.",
        B: "Renal function tests ARE essential - lithium can cause nephrogenic diabetes insipidus and long-term renal impairment.",
        C: "Electrolyte levels ARE relevant - sodium depletion increases lithium toxicity risk.",
        E: "ECG IS relevant at baseline - lithium can cause T-wave flattening and rarely arrhythmias."
      },
      exam_tip: "When asked what's LEAST relevant for drug monitoring, eliminate what you know IS monitored. Prolactin = antipsychotics (especially risperidone), not lithium.",
      related_topics: ["lithium-monitoring", "bipolar-disorder", "drug-monitoring"]
    }
  },
  {
    id: '45c6c416-1392-42ba-91c2-83e0f76b5d8a',
    order: 43,
    structured: {
      summary: "Risperidone requires serum prolactin monitoring due to its strong D2 receptor blockade in the pituitary, which causes the highest prolactin elevation among atypical antipsychotics.",
      key_points: [
        "Risperidone has strongest prolactin-elevating effect among atypicals",
        "Symptoms: galactorrhoea, gynaecomastia, amenorrhoea, sexual dysfunction, osteoporosis (long-term)",
        "Check prolactin if symptoms develop; routine monitoring in young women on long-term therapy",
        "Alternatives with lower prolactin effects: aripiprazole, quetiapine"
      ],
      clinical_pearl: "If a young woman on risperidone develops amenorrhoea, check prolactin and pregnancy test. High prolactin can cause infertility - consider switching to aripiprazole which can even lower prolactin.",
      why_wrong: {
        A: "Urine glucose is not specifically indicated for risperidone - fasting blood glucose is more appropriate for metabolic monitoring.",
        C: "Platelet count monitoring is for valproate (thrombocytopenia risk) and clozapine (neutropenia), not risperidone.",
        D: "INR is for warfarin monitoring - risperidone doesn't affect coagulation.",
        E: "Hematocrit monitoring is not specific to risperidone - clozapine requires FBC monitoring but not hematocrit specifically."
      },
      exam_tip: "Risperidone = 'R for Raised Prolactin'. It's the atypical most associated with hyperprolactinaemia. Aripiprazole is the opposite - it can lower prolactin.",
      related_topics: ["risperidone", "hyperprolactinaemia", "antipsychotic-monitoring"]
    }
  },
  {
    id: '695438b6-d830-4ffb-a89f-3f67ad989068',
    order: 44,
    structured: {
      summary: "Bradykinesia (slowed movements) is NOT a feature of serotonin syndrome - it's associated with Parkinson's disease and parkinsonism. Serotonin syndrome causes hyperkinetic symptoms like tremor, myoclonus, and hyperreflexia.",
      key_points: [
        "Serotonin syndrome: autonomic instability, neuromuscular hyperactivity, mental status changes",
        "Neuromuscular signs: tremor, clonus, hyperreflexia, muscle rigidity - all hyperkinetic",
        "Bradykinesia is hypokinetic - opposite of serotonin syndrome presentation",
        "Key differentiator from NMS: serotonin syndrome has clonus and hyperreflexia; NMS has 'lead-pipe' rigidity"
      ],
      clinical_pearl: "To differentiate serotonin syndrome from NMS: serotonin syndrome has hyperreflexia and clonus (especially lower limbs), while NMS has normal or decreased reflexes. Both have hyperthermia and rigidity.",
      why_wrong: {
        A: "Hypertension IS a feature of serotonin syndrome due to sympathetic activation.",
        B: "Hyperreflexia IS characteristic - reflexes are exaggerated, not diminished.",
        C: "Muscle rigidity IS seen, though it's different from NMS rigidity (more hypertonicity than 'lead-pipe').",
        E: "Agitation IS a prominent feature due to CNS serotonin excess."
      },
      exam_tip: "Serotonin syndrome = 'Speedy Syndrome' - everything is hyperactive and fast. Bradykinesia means slow movements, which doesn't fit this hyperkinetic picture.",
      related_topics: ["serotonin-syndrome", "neuroleptic-malignant-syndrome", "drug-toxicity"]
    }
  },
  {
    id: 'e2bae10f-9c8c-43cd-80fa-63447347899a',
    order: 45,
    structured: {
      summary: "When SSRIs fail for panic disorder, switching to or adding an SNRI is appropriate as they have similar efficacy for anxiety disorders but work on both serotonin and noradrenaline pathways.",
      key_points: [
        "First-line for panic disorder: SSRIs (paroxetine, sertraline, fluoxetine)",
        "If SSRI fails: switch to another SSRI, try SNRI (venlafaxine, duloxetine), or add CBT",
        "SNRIs may benefit patients who don't respond to serotonin-only treatments",
        "Benzodiazepines only for short-term use due to dependence risk"
      ],
      clinical_pearl: "Before declaring treatment failure, ensure the SSRI trial was adequate: appropriate dose (often higher than for depression) for at least 8-12 weeks. Many panic disorder patients need longer trials than depression patients.",
      why_wrong: {
        A: "Immediately switching to benzodiazepines abandons disease-modifying treatment for symptomatic control with dependence risk.",
        B: "CBT is valuable but the question asks about medication management - it should be added, not used instead of medication.",
        C: "Exceeding maximum recommended doses increases side effect risk without proven additional benefit.",
        D: "Adding a second SSRI provides no benefit and increases serotonin syndrome risk."
      },
      exam_tip: "For 'poor response to SSRI' questions, think: optimise current treatment → switch class (to SNRI) → augment. Never add two SSRIs together.",
      related_topics: ["panic-disorder", "treatment-resistant-anxiety", "snris"]
    }
  },
  {
    id: 'fb3ab407-1fa8-403d-9664-cc8bcdecda46',
    order: 46,
    structured: {
      summary: "For fluoxetine-induced insomnia, the simplest first intervention is changing administration time to morning. Fluoxetine has activating properties that can disrupt sleep if taken later in the day.",
      key_points: [
        "Fluoxetine is one of the most 'activating' SSRIs - can cause insomnia, anxiety, agitation initially",
        "Taking in the morning allows effects to diminish by bedtime",
        "If timing change doesn't help, consider adding low-dose mirtazapine or switching SSRIs",
        "Avoid long-term hypnotics (zolpidem) - treat the cause, not just the symptom"
      ],
      clinical_pearl: "Paroxetine and fluvoxamine are more sedating SSRIs - if a patient needs an SSRI but fluoxetine is too activating even with morning dosing, these may be better tolerated.",
      why_wrong: {
        A: "Paroxetine can also cause insomnia - switching SSRIs without trying simple interventions first is premature.",
        B: "Adding mirtazapine is effective but adds another medication when a simple timing change might work.",
        D: "Increasing the dose would likely worsen insomnia as the effect is dose-related.",
        E: "Adding zolpidem treats the symptom without addressing the cause and adds dependence risk."
      },
      exam_tip: "For SSRI side effect questions, think about simple interventions first: timing changes, dose adjustments, taking with food. Switching or adding medications comes later.",
      related_topics: ["ssri-side-effects", "insomnia-management", "fluoxetine"]
    }
  },
  {
    id: 'cedcdf47-d041-45c4-809f-02fbb2b4a69a',
    order: 47,
    structured: {
      summary: "Persistent depressive disorder (dysthymia) is best treated with a combination of psychotherapy (especially CBT) and SSRIs, as the chronic nature benefits from addressing both biological and psychological factors.",
      key_points: [
        "Dysthymia: chronic low-grade depression lasting ≥2 years",
        "Combination therapy (SSRI + psychotherapy) is more effective than either alone",
        "SSRIs are first-line pharmacotherapy due to tolerability",
        "CBT and interpersonal therapy (IPT) are evidence-based psychotherapies"
      ],
      clinical_pearl: "Dysthymia often goes undiagnosed because patients adapt to chronic low mood. Screen for it in patients who say they've 'always been this way' or have been 'mildly depressed for years'.",
      why_wrong: {
        A: "TCAs are not first-line due to side effects and overdose risk - SSRIs are preferred.",
        B: "Psychotherapy alone is less effective than combination therapy for dysthymia.",
        D: "ECT is reserved for severe, treatment-resistant depression, not first-line for mild-moderate chronic depression.",
        E: "Atypical antipsychotics are not first-line for dysthymia - they're adjunctive for treatment-resistant depression."
      },
      exam_tip: "For chronic depression (dysthymia), think 'combination first': SSRI + psychotherapy. The chronic nature means both biological and psychological interventions are needed.",
      related_topics: ["dysthymia", "chronic-depression", "combination-therapy"]
    }
  },
  {
    id: '923643fa-cb54-4d20-98c9-81004b53e4aa',
    order: 48,
    structured: {
      summary: "Olanzapine requires routine blood glucose monitoring because it has the highest risk of causing diabetes and metabolic syndrome among commonly used antipsychotics.",
      key_points: [
        "Olanzapine and clozapine have highest metabolic risk",
        "Monitor: fasting glucose/HbA1c, lipids, weight, waist circumference at baseline and regularly",
        "Risk of new-onset diabetes: 3x higher with olanzapine than general population",
        "Metabolically favorable alternatives: aripiprazole, lurasidone, ziprasidone"
      ],
      clinical_pearl: "Consider prescribing metformin prophylactically or early if significant weight gain occurs on olanzapine. Some evidence suggests metformin can attenuate antipsychotic-induced metabolic effects.",
      why_wrong: {
        B: "Haloperidol is a typical antipsychotic with lower metabolic risk - main concerns are EPS and tardive dyskinesia.",
        C: "Aripiprazole has one of the most favorable metabolic profiles among atypicals.",
        D: "Lurasidone has minimal metabolic effects - often chosen specifically to avoid weight gain.",
        E: "Chlorpromazine (typical) has lower metabolic risk than olanzapine, though it does have other side effects."
      },
      exam_tip: "For metabolic monitoring questions, think 'O for Olanzapine, O for Obesity and diabetes'. Clozapine has similar risks but is reserved for treatment-resistant cases.",
      related_topics: ["olanzapine", "metabolic-syndrome", "diabetes-screening"]
    }
  },
  {
    id: 'adbf2330-791f-4f30-b773-93d01be1193f',
    order: 49,
    structured: {
      summary: "Escitalopram has a maximum dose of 10mg in patients over 60 years due to age-related QT prolongation risk. Citalopram has the same restriction (max 20mg in elderly).",
      key_points: [
        "Escitalopram max dose >65 years: 10mg daily (vs 20mg in younger adults)",
        "Citalopram max dose >65 years: 20mg daily (vs 40mg in younger adults)",
        "Both drugs prolong QT interval in dose-dependent manner",
        "Older adults have reduced hepatic metabolism and increased cardiac sensitivity"
      ],
      clinical_pearl: "If an elderly patient needs more antidepressant effect than 10mg escitalopram provides, switch to sertraline or mirtazapine rather than exceeding the maximum dose. The QT risk is real.",
      why_wrong: {
        A: "Sertraline doesn't have specific age-related dose restrictions for cardiac reasons.",
        B: "Citalopram DOES have age-related restrictions but the question asks which requires adjustment - escitalopram is the most specific answer as it has the lowest absolute maximum in elderly.",
        D: "Fluoxetine doesn't have specific QT-related age restrictions.",
        E: "Paroxetine doesn't have specific age-related maximum dose restrictions for cardiac reasons."
      },
      exam_tip: "Remember 'Cit-alo-pram and Es-cit-alo-pram = QT concerns'. Both require dose limits in elderly. Escitalopram's max of 10mg in elderly is a commonly tested point.",
      related_topics: ["escitalopram", "qt-prolongation", "elderly-prescribing"]
    }
  },
  {
    id: '6cc017b1-a389-49d0-b8d7-d42e0dc0841c',
    order: 50,
    structured: {
      summary: "SSRIs like sertraline are first-line for GAD due to proven efficacy, safety, and tolerability. They address the underlying anxiety rather than just providing symptomatic relief.",
      key_points: [
        "First-line for GAD: SSRIs (sertraline, escitalopram, paroxetine) or SNRIs (duloxetine, venlafaxine)",
        "SSRIs take 2-4 weeks for anxiolytic effect - counsel patients on delayed onset",
        "Benzodiazepines: effective short-term but not for maintenance due to dependence",
        "Pregabalin is second-line if SSRIs/SNRIs fail"
      ],
      clinical_pearl: "Start SSRIs at half the usual dose for anxiety disorders - anxious patients are often sensitive to initial 'activation' side effects. Titrate slowly to minimise dropout.",
      why_wrong: {
        A: "Lorazepam provides quick relief but is not first-line due to dependence, tolerance, and withdrawal risks.",
        B: "Buspirone is non-addictive but has modest efficacy compared to SSRIs - typically second-line or adjunctive.",
        D: "Duloxetine is a valid option but SSRIs are generally preferred as initial choice in UK guidelines.",
        E: "Amitriptyline is rarely used for anxiety due to anticholinergic side effects and toxicity in overdose."
      },
      exam_tip: "For GAD first-line treatment, think 'SSRI = Safe, Sustained anxiety relief'. Benzodiazepines are for short-term bridging only.",
      related_topics: ["generalized-anxiety", "ssris", "anxiety-treatment"]
    }
  },
  {
    id: 'ae6b7fcf-0ad8-4988-85a5-17ed72a3cf8b',
    order: 51,
    structured: {
      summary: "Lithium commonly causes hypothyroidism (5-35% of patients) by inhibiting thyroid hormone synthesis and release. Regular TSH monitoring is essential to detect this treatable complication.",
      key_points: [
        "Hypothyroidism is the most common lithium-induced endocrine effect",
        "Mechanism: lithium inhibits thyroid hormone release and T4 to T3 conversion",
        "Women and those with pre-existing thyroid antibodies at higher risk",
        "Treatment: levothyroxine supplementation; lithium doesn't need to be stopped"
      ],
      clinical_pearl: "If a patient on lithium develops fatigue, weight gain, and worsening depression, check thyroid function before assuming treatment failure. Hypothyroidism mimics depression and is easily treated.",
      why_wrong: {
        A: "Hypernatremia is not caused by lithium - lithium can cause nephrogenic diabetes insipidus which may lead to dehydration but not typically hypernatremia.",
        B: "Leukopenia is not associated with lithium - actually lithium can cause leukocytosis (elevated WBC).",
        D: "Hypocalcemia is not a lithium effect - lithium can cause hyperparathyroidism leading to hypercalcemia, not hypocalcemia.",
        E: "Hyperkalemia is not a lithium effect - lithium is a monovalent cation that doesn't significantly affect potassium."
      },
      exam_tip: "Lithium thyroid effects: 'Li-THY-um' = LiTHYroid problems. Monitor TSH every 6 months. Treat hypothyroidism with levothyroxine - don't stop effective lithium therapy.",
      related_topics: ["lithium-monitoring", "hypothyroidism", "thyroid-function"]
    }
  },
  {
    id: '108946da-5a57-420f-80a9-2720a29febb7',
    order: 52,
    structured: {
      summary: "Risperidone, like all atypical antipsychotics, requires metabolic monitoring including fasting glucose and lipids due to the risk of metabolic syndrome, weight gain, and diabetes.",
      key_points: [
        "All atypical antipsychotics require metabolic monitoring at baseline and regularly",
        "Monitor: fasting glucose/HbA1c, lipid profile, weight, waist circumference, blood pressure",
        "Risperidone has moderate metabolic risk (less than olanzapine, more than aripiprazole)",
        "Additionally monitor prolactin for risperidone specifically"
      ],
      clinical_pearl: "UK guidelines recommend metabolic monitoring at baseline, 3 months, 12 months, then annually for all antipsychotics. Don't forget lifestyle advice - diet and exercise are important interventions.",
      why_wrong: {
        A: "Serum calcium is not routinely affected by risperidone.",
        C: "Urine drug screens are not part of routine risperidone monitoring - used for different purposes.",
        D: "Serum magnesium is not specifically indicated for risperidone monitoring.",
        E: "Platelet count is not routinely monitored for risperidone - it's important for valproate and clozapine."
      },
      exam_tip: "For antipsychotic monitoring, remember 'MWGLP': Metabolic (glucose, lipids), Weight, Glucose (fasting/HbA1c), Lipids, Prolactin (especially risperidone).",
      related_topics: ["antipsychotic-monitoring", "metabolic-syndrome", "risperidone"]
    }
  },
  {
    id: 'c6c523cc-2120-43d3-ab27-fc82a635fdee',
    order: 53,
    structured: {
      summary: "SSRIs like fluoxetine have the highest rates of sexual dysfunction among antidepressants, affecting 25-73% of patients. Bupropion and mirtazapine have notably lower rates.",
      key_points: [
        "SSRIs cause sexual dysfunction via serotonin effects on sexual arousal and orgasm",
        "Manifestations: reduced libido, erectile dysfunction, delayed/absent orgasm",
        "Paroxetine and fluoxetine typically have highest rates among SSRIs",
        "Low-risk alternatives: bupropion, mirtazapine, vortioxetine"
      ],
      clinical_pearl: "Sexual dysfunction is a leading cause of antidepressant non-adherence. Proactively discuss it when prescribing and have a plan: dose reduction, drug holidays (weekends), switching, or adding bupropion.",
      why_wrong: {
        A: "Mirtazapine has low sexual dysfunction rates - it's sometimes used to counter SSRI-induced dysfunction.",
        B: "Bupropion has the lowest sexual dysfunction rate of common antidepressants - often added to counter SSRI effects.",
        D: "Trazodone can cause priapism (rare but serious) but has low rates of typical sexual dysfunction like anorgasmia.",
        E: "Duloxetine (SNRI) causes sexual dysfunction but generally at lower rates than SSRIs."
      },
      exam_tip: "For 'which causes most sexual dysfunction': SSRIs (especially paroxetine, fluoxetine). For 'which causes least': bupropion, mirtazapine.",
      related_topics: ["ssri-side-effects", "sexual-dysfunction", "antidepressant-selection"]
    }
  },
  {
    id: '7dda9a30-f3b3-47ad-852a-ebe4c9dcb933',
    order: 54,
    structured: {
      summary: "After achieving remission from depression, maintenance therapy should continue for 6-12 months to consolidate recovery and reduce relapse risk. Patients with recurrent episodes may need longer.",
      key_points: [
        "Continue antidepressant 6-12 months after remission (first episode)",
        "Multiple episodes or risk factors: continue 2+ years or indefinitely",
        "Tapering should be gradual over weeks to months when discontinuing",
        "50% of patients relapse within 6 months if medication stopped too early"
      ],
      clinical_pearl: "Use the '2 and 2' rule: after 2 episodes, consider 2 years of maintenance; after 3+ episodes with severe symptoms, consider indefinite treatment.",
      why_wrong: {
        A: "1-2 months is far too short - relapse risk is highest in the first 6 months after remission.",
        B: "3-4 months is still too short for adequate relapse prevention.",
        D: "12-24 months may be appropriate for recurrent depression but isn't the standard first recommendation.",
        E: "Indefinite treatment is reserved for patients with 3+ episodes or very high relapse risk factors."
      },
      exam_tip: "Standard answer for 'how long to continue after remission' is 6-12 months. Longer for recurrent depression. Always taper gradually when stopping.",
      related_topics: ["depression-maintenance", "relapse-prevention", "antidepressant-duration"]
    }
  },
  {
    id: '3ed9ce1c-a93c-4049-9b65-0f3ff2ef4ba5',
    order: 55,
    structured: {
      summary: "Valproate requires routine LFT monitoring due to hepatotoxicity risk, especially in the first 6 months. Serious hepatic failure is rare but potentially fatal.",
      key_points: [
        "Check LFTs at baseline, then regularly (especially first 6 months)",
        "Risk factors for hepatotoxicity: young children, polytherapy, metabolic disorders",
        "Also monitor FBC (thrombocytopenia risk) and signs of pancreatitis",
        "Warning signs: nausea, vomiting, anorexia, jaundice, lethargy - stop and investigate"
      ],
      clinical_pearl: "If LFTs rise more than 3x upper limit of normal with symptoms, stop valproate. Asymptomatic mild elevations can often be monitored with more frequent testing.",
      why_wrong: {
        A: "Lithium requires thyroid and renal monitoring, not LFTs - it doesn't cause hepatotoxicity.",
        C: "Lamotrigine's main concern is skin reactions (Stevens-Johnson syndrome), not hepatotoxicity. LFTs not routinely required.",
        D: "Carbamazepine requires FBC monitoring (agranulocytosis risk) and can affect LFTs, but hepatotoxicity is less prominent than with valproate.",
        E: "Gabapentin doesn't require LFT monitoring - it's renally excreted and doesn't cause hepatotoxicity."
      },
      exam_tip: "Valproate = 'Very important to check Liver'. Also remember: Pregnancy Prevention Programme for females due to teratogenicity.",
      related_topics: ["valproate-monitoring", "hepatotoxicity", "mood-stabilizers"]
    }
  },
  {
    id: '9eeea699-a892-485c-a031-b9cb0372fd98',
    order: 56,
    structured: {
      summary: "Neuroleptic malignant syndrome (NMS) is a rare but life-threatening reaction to antipsychotics characterised by muscle rigidity, fever, altered consciousness, and autonomic instability. It requires immediate treatment.",
      key_points: [
        "NMS tetrad: Fever, Rigidity, Autonomic instability, Altered mental status",
        "Can occur at any time but usually within first 2 weeks of starting antipsychotic",
        "Risk factors: dehydration, high doses, rapid titration, previous NMS",
        "Treatment: stop antipsychotic, supportive care, dantrolene/bromocriptine in severe cases"
      ],
      clinical_pearl: "NMS has 'lead-pipe rigidity' and normal/decreased reflexes. Serotonin syndrome has hyperreflexia and clonus. Both cause hyperthermia - the neurological signs differentiate them.",
      why_wrong: {
        A: "Serotonin syndrome has similar features but occurs with serotonergic drugs and has hyperreflexia/clonus rather than lead-pipe rigidity.",
        C: "Tardive dyskinesia involves involuntary movements after long-term use - not acute rigidity and fever.",
        D: "Akathisia is restlessness and inability to sit still - not rigidity, fever, or altered consciousness.",
        E: "Anticholinergic toxicity causes hyperthermia and confusion but not muscle rigidity - causes dry/flushed skin, urinary retention."
      },
      exam_tip: "NMS = 'FARM': Fever, Autonomic instability, Rigidity, Mental status changes. It's a medical emergency requiring immediate intervention.",
      related_topics: ["neuroleptic-malignant-syndrome", "antipsychotic-emergencies", "drug-reactions"]
    }
  },
  {
    id: 'df9cbbfb-cb2f-45ca-857b-de60a7c01db0',
    order: 57,
    structured: {
      summary: "SSRIs like paroxetine are first-line pharmacological treatment for panic disorder due to proven efficacy, safety, and the ability to address the underlying disorder rather than just symptoms.",
      key_points: [
        "First-line SSRIs for panic: paroxetine, sertraline, fluoxetine, escitalopram",
        "Start at low dose and titrate slowly to minimise initial anxiety worsening",
        "Benzodiazepines for short-term relief while SSRI takes effect (2-4 weeks)",
        "Venlafaxine (SNRI) is also first-line but SSRIs often tried first"
      ],
      clinical_pearl: "Paroxetine and sertraline have the best evidence for panic disorder. Start at half the depression dose - panic patients are sensitive to initial activation.",
      why_wrong: {
        A: "Clonazepam provides quick relief but isn't first-line due to dependence, tolerance, and withdrawal risks.",
        B: "Buspirone is less effective for panic disorder than for GAD - not considered first-line.",
        C: "Venlafaxine is a valid first-line option but SSRIs are generally preferred initially.",
        E: "Diazepam has same limitations as clonazepam - effective short-term but not for maintenance."
      },
      exam_tip: "For panic disorder first-line, think 'Paroxetine for Panic' (but other SSRIs work too). Benzodiazepines are 'bridges', not 'buildings'.",
      related_topics: ["panic-disorder", "ssris", "anxiety-pharmacotherapy"]
    }
  },
  {
    id: 'a755d573-a3cf-444f-98a1-9e545682a88d',
    order: 58,
    structured: {
      summary: "For acute mania, atypical antipsychotics like quetiapine are effective and often used alongside mood stabilizers. Antidepressants must be avoided as they can worsen mania.",
      key_points: [
        "Acute mania options: antipsychotics (quetiapine, olanzapine, risperidone), valproate, lithium",
        "Antipsychotics work faster than mood stabilizers for acute symptoms",
        "Antidepressants are CONTRAINDICATED in acute mania - can trigger/worsen mania",
        "Quetiapine also has antidepressant properties useful in bipolar depression"
      ],
      clinical_pearl: "Quetiapine is particularly useful in bipolar disorder because it works for both poles - treats acute mania and bipolar depression, making it valuable for maintenance too.",
      why_wrong: {
        A: "Lithium is effective but works slower than antipsychotics - often used together, not lithium alone for acute mania.",
        B: "Amitriptyline is a TCA that can trigger or worsen mania - absolutely contraindicated.",
        C: "Venlafaxine (SNRI) can trigger mania - antidepressants are not used in acute mania.",
        E: "Escitalopram (SSRI) can also trigger mania - antidepressants are contraindicated."
      },
      exam_tip: "For acute mania, think 'Antipsychotic + Mood stabilizer'. Never antidepressants alone. Quetiapine, olanzapine, and risperidone are rapid-acting options.",
      related_topics: ["acute-mania", "antipsychotics", "bipolar-disorder"]
    }
  },
  {
    id: 'e4579eac-3dd3-4392-8a5f-7434cc1c6859',
    order: 59,
    structured: {
      summary: "After 8 weeks of inadequate response to an SSRI for GAD, switching to an SNRI like venlafaxine is appropriate. SNRIs may benefit patients who don't respond to serotonin-only medications.",
      key_points: [
        "Ensure SSRI trial was adequate: appropriate dose for at least 8-12 weeks",
        "Options after SSRI failure: switch to SNRI, switch to different SSRI, add buspirone, add pregabalin",
        "SNRIs (venlafaxine, duloxetine) are first-line alternatives",
        "Benzodiazepines only for short-term crisis management"
      ],
      clinical_pearl: "Before switching, check: Was the dose adequate? Was adherence good? Were there substance use or other factors affecting response? Many 'failures' are actually suboptimal trials.",
      why_wrong: {
        A: "Increasing sertraline dose may help if current dose is subtherapeutic, but after 8 weeks at adequate dose, switching is preferred.",
        B: "Benzodiazepines are not appropriate for long-term GAD management due to dependence risk.",
        D: "Buspirone can be added but has modest efficacy - switching class is usually more effective.",
        E: "Stopping medication and using psychotherapy only isn't appropriate if medication is indicated - combination is better."
      },
      exam_tip: "After SSRI failure in anxiety: 'Switch to SNRI' is usually the best answer. Same principle as depression - change mechanism, not just molecule.",
      related_topics: ["treatment-resistant-anxiety", "snris", "gad-management"]
    }
  },
  {
    id: 'ed51be0c-9850-4b69-b390-a32135b1e394',
    order: 60,
    structured: {
      summary: "For acute mania in bipolar disorder, lithium (mood stabilizer) plus olanzapine (antipsychotic) is an effective combination. Antidepressants must be avoided as they can trigger or worsen mania.",
      key_points: [
        "Mood stabilizer + antipsychotic is standard for acute mania",
        "Lithium: gold standard mood stabilizer but takes 1-2 weeks for effect",
        "Olanzapine: rapid antimanic effect within days",
        "Never use antidepressants in acute mania - they can trigger 'switching' to mania"
      ],
      clinical_pearl: "If a patient has a history of rapid cycling or mixed features, avoid antidepressants even in bipolar depression - the risk of triggering mania is too high.",
      why_wrong: {
        B: "Valproate + sertraline is dangerous - sertraline (SSRI) can trigger/worsen mania.",
        C: "Lamotrigine + fluoxetine: lamotrigine is for bipolar depression prevention, not acute mania; fluoxetine could worsen mania.",
        D: "Carbamazepine + bupropion: bupropion (antidepressant) can trigger mania.",
        E: "Amitriptyline + risperidone: amitriptyline (TCA) has high risk of triggering mania."
      },
      exam_tip: "For acute mania combinations: 'Mood stabilizer + Antipsychotic'. Antidepressants are 'Anti-indicated' in mania.",
      related_topics: ["bipolar-mania", "combination-therapy", "lithium"]
    }
  }
]

async function main() {
  console.log('Starting batch 3 update (questions 41-60)...')

  let updated = 0
  let failed = 0

  for (const item of explanations) {
    const { error } = await supabase
      .from('questions')
      .update({
        is_trial_featured: true,
        trial_display_order: item.order,
        explanation_structured: item.structured
      })
      .eq('id', item.id)

    if (error) {
      console.error(`Failed to update ${item.id}:`, error.message)
      failed++
    } else {
      console.log(`Updated question ${item.order}: ${item.id}`)
      updated++
    }
  }

  console.log(`\nBatch 3 complete! Updated: ${updated}, Failed: ${failed}`)
}

main()
