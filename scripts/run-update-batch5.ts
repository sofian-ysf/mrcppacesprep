import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const explanations = [
  {
    id: '5579575d-6f36-4a14-b07a-ff335b062e66',
    order: 81,
    structured: {
      summary: "Olanzapine is a first-line option for acute mania because it works rapidly (within days) to control manic symptoms, while mood stabilizers like lithium take longer to achieve full effect.",
      key_points: [
        "Antipsychotics (olanzapine, risperidone, quetiapine) work faster than lithium for acute mania",
        "Often combined with lithium or valproate for optimal control",
        "Olanzapine IM available for severe agitation",
        "Lamotrigine is for depression prevention, NOT acute mania"
      ],
      clinical_pearl: "In severe acute mania, consider olanzapine or haloperidol IM for rapid tranquilization while starting oral mood stabilizers for longer-term control.",
      why_wrong: {
        A: "Lithium is effective but takes 7-14 days for antimanic effect - not rapid enough for acute management.",
        C: "Fluoxetine (SSRI) can trigger or worsen mania - contraindicated.",
        D: "Valproate is effective but also takes several days - often combined with antipsychotic for acute management.",
        E: "Lamotrigine is for bipolar DEPRESSION prevention - has no antimanic properties."
      },
      exam_tip: "For ACUTE mania, think antipsychotics first (olanzapine, risperidone). For MAINTENANCE, think mood stabilizers (lithium, valproate).",
      related_topics: ["acute-mania", "olanzapine", "bipolar-management"]
    }
  },
  {
    id: 'ec3dfb7e-2ec0-4c1e-aa29-ef115de02012',
    order: 82,
    structured: {
      summary: "A lithium level of 1.0 mmol/L is at the upper end of the therapeutic range. The appropriate action is to maintain the current dose and continue regular monitoring.",
      key_points: [
        "Maintenance therapeutic range: 0.4-1.0 mmol/L",
        "Acute mania treatment range: may go up to 1.2 mmol/L temporarily",
        "Levels >1.5 mmol/L indicate toxicity",
        "Monitor lithium levels, renal function, and thyroid function regularly"
      ],
      clinical_pearl: "A level of 1.0 mmol/L is acceptable but 'running high'. Consider factors that might push it higher (dehydration, NSAIDs, ACE inhibitors). Ensure patient understands signs of toxicity.",
      why_wrong: {
        A: "Increasing the dose would risk toxicity - the level is already at the upper limit.",
        B: "Decreasing unnecessarily might destabilize the patient's mood.",
        D: "No indication to switch medications when lithium is working at therapeutic levels.",
        E: "Benzodiazepines don't have synergistic antimanic effects with lithium for maintenance."
      },
      exam_tip: "Lithium levels: <0.4 = subtherapeutic, 0.4-1.0 = therapeutic, >1.5 = toxic. At 1.0, maintain and monitor.",
      related_topics: ["lithium-levels", "therapeutic-monitoring", "bipolar-maintenance"]
    }
  },
  {
    id: 'bfdc3e62-ef7b-4296-9b95-5e224b353444',
    order: 83,
    structured: {
      summary: "Aripiprazole causes the least weight gain among atypical antipsychotics due to its unique partial D2 agonist mechanism. It's often chosen when metabolic effects are a major concern.",
      key_points: [
        "Aripiprazole: metabolically neutral (minimal weight gain, no diabetes risk)",
        "Unique mechanism: partial D2 agonist (unlike other atypicals)",
        "Olanzapine and clozapine: highest weight gain (7-10kg in first year)",
        "Other metabolically favorable options: lurasidone, ziprasidone"
      ],
      clinical_pearl: "If switching a patient from olanzapine to aripiprazole for metabolic reasons, warn them about possible akathisia - aripiprazole's most common bothersome side effect.",
      why_wrong: {
        A: "Clozapine has very high metabolic risk - reserved for treatment-resistant schizophrenia.",
        B: "Olanzapine has the highest weight gain risk among commonly used atypicals.",
        D: "Quetiapine has moderate metabolic risk - causes significant weight gain in many patients.",
        E: "Risperidone has moderate metabolic risk, plus high prolactin elevation."
      },
      exam_tip: "For 'least weight gain', Aripiprazole is almost always correct. For 'most weight gain', think Olanzapine or Clozapine.",
      related_topics: ["aripiprazole", "metabolic-side-effects", "antipsychotic-comparison"]
    }
  },
  {
    id: 'b1e4676e-5f51-4cee-a543-6e3a12021187',
    order: 84,
    structured: {
      summary: "When SSRIs fail for GAD, switching to an SNRI is the most appropriate pharmacological next step. SNRIs may help patients who don't respond to serotonin-only medications.",
      key_points: [
        "SNRI options: venlafaxine, duloxetine - both effective for GAD",
        "Ensure SSRI trial was adequate (dose and duration) before switching",
        "Benzodiazepines are NOT appropriate as long-term monotherapy",
        "Adding CBT can enhance medication response but doesn't replace medication"
      ],
      clinical_pearl: "Venlafaxine at doses below 150mg acts mainly as an SSRI. For the noradrenergic effect, ensure doses reach 150-225mg before declaring treatment failure.",
      why_wrong: {
        A: "Benzodiazepines shouldn't be monotherapy for GAD due to dependence risk.",
        B: "CBT is adjunctive but doesn't address medication optimization.",
        C: "Buspirone can be added but has modest efficacy compared to switching class.",
        E: "Increasing SSRI dose after non-response is less effective than switching class."
      },
      exam_tip: "After SSRI failure in anxiety: switch to SNRI. This applies to GAD, panic disorder, and social anxiety.",
      related_topics: ["gad-treatment", "snris", "treatment-resistant-anxiety"]
    }
  },
  {
    id: '70f18548-152e-4996-8d93-b2a65c826b39',
    order: 85,
    structured: {
      summary: "For acute agitation in schizophrenia, IM olanzapine is preferred because it addresses both the agitation AND the underlying psychotic symptoms. Lorazepam is an alternative for sedation only.",
      key_points: [
        "Olanzapine IM: addresses psychosis + provides sedation",
        "Lorazepam IM: sedation only, doesn't treat underlying psychosis",
        "Avoid combining IM olanzapine and IM benzodiazepines (respiratory depression risk)",
        "Haloperidol IM is another option but higher EPS risk"
      ],
      clinical_pearl: "Never give IM olanzapine and IM benzodiazepine together - there have been deaths from respiratory depression. Wait at least 1 hour between them if both needed.",
      why_wrong: {
        A: "Lorazepam provides sedation but doesn't treat the psychotic symptoms causing the agitation.",
        B: "Lithium is for bipolar disorder maintenance - not appropriate for acute agitation.",
        C: "Buspirone has slow onset and no role in acute agitation.",
        D: "Lamotrigine is for bipolar depression prevention - not for acute agitation."
      },
      exam_tip: "For acute psychotic agitation, antipsychotics are preferred over benzodiazepines because they treat both the behavior AND the underlying cause.",
      related_topics: ["acute-agitation", "im-antipsychotics", "rapid-tranquilization"]
    }
  },
  {
    id: '894544c1-3403-403a-959e-9650837b2eb2',
    order: 86,
    structured: {
      summary: "Sertraline is the preferred antidepressant for diabetic patients because it has neutral effects on glucose metabolism and weight, unlike mirtazapine, paroxetine, or TCAs which can worsen glycemic control.",
      key_points: [
        "Sertraline: weight-neutral, no significant glucose effects",
        "Mirtazapine causes weight gain → worsens insulin resistance",
        "Paroxetine has higher weight gain risk among SSRIs",
        "TCAs (amitriptyline) cause weight gain and anticholinergic effects"
      ],
      clinical_pearl: "Depression and diabetes frequently co-occur and worsen each other. Treating depression improves diabetes self-management and outcomes. Choose medications that don't compound metabolic issues.",
      why_wrong: {
        A: "Mirtazapine causes significant weight gain which worsens diabetes control.",
        C: "Paroxetine is associated with more weight gain than other SSRIs.",
        D: "Amitriptyline (TCA) causes weight gain and can affect glucose.",
        E: "Duloxetine is acceptable but has less evidence in diabetic depression than sertraline."
      },
      exam_tip: "For depression + diabetes, sertraline is the standard choice. It's weight-neutral and has good safety data in this population.",
      related_topics: ["diabetes-depression", "sertraline", "antidepressant-selection"]
    }
  },
  {
    id: '1c02bd68-fcdf-447e-ae7f-9b4094a7f174',
    order: 87,
    structured: {
      summary: "Pulmonary function tests are NOT part of routine baseline investigations for lithium. Lithium monitoring focuses on renal, thyroid, cardiac, and calcium - systems it actually affects.",
      key_points: [
        "Required baseline: renal function (eGFR, creatinine), TSH, ECG, calcium",
        "Lithium doesn't affect pulmonary function",
        "Also check: weight, FBC (lithium can cause leukocytosis)",
        "Ongoing monitoring: lithium levels, renal, thyroid every 6-12 months"
      ],
      clinical_pearl: "Remember lithium's effects with 'TRC': Thyroid (hypothyroidism), Renal (nephrogenic DI, chronic damage), Cardiac (T-wave changes). These guide your baseline tests.",
      why_wrong: {
        A: "Renal function IS required - lithium can cause long-term kidney damage.",
        B: "Thyroid function IS required - lithium commonly causes hypothyroidism.",
        C: "ECG IS recommended at baseline - lithium can cause T-wave changes.",
        E: "Calcium IS often checked - lithium can cause hyperparathyroidism."
      },
      exam_tip: "For 'NOT required' questions about lithium baseline tests, eliminate thyroid, renal, cardiac, and calcium. Pulmonary function has no relevance.",
      related_topics: ["lithium-baseline-tests", "drug-monitoring", "prescribing-safety"]
    }
  },
  {
    id: 'a07ee8b4-f1b6-4aed-99e7-1dd78559e38d',
    order: 88,
    structured: {
      summary: "Orthostatic hypotension is a major side effect of TCAs due to alpha-1 adrenergic blockade. This is particularly concerning in elderly patients who are at risk of falls.",
      key_points: [
        "TCAs block multiple receptors: alpha-1 (hypotension), muscarinic (anticholinergic), histamine (sedation, weight gain)",
        "Orthostatic hypotension: drop in BP when standing → dizziness, falls",
        "Worse with amitriptyline than nortriptyline (secondary amine)",
        "Warn patients to rise slowly from sitting/lying positions"
      ],
      clinical_pearl: "If a TCA is needed in an elderly patient, nortriptyline has fewer anticholinergic and hypotensive effects than amitriptyline. But SSRIs are still preferred.",
      why_wrong: {
        A: "TCAs cause weight GAIN, not weight loss.",
        C: "TCAs INCREASE appetite (via histamine blockade), not decrease it.",
        D: "TCAs cause INCREASED sweating as an anticholinergic effect, not reduced.",
        E: "TCAs are sedating and typically help sleep, not cause insomnia."
      },
      exam_tip: "TCA side effects: 'ABCD' - Alpha blockade (hypotension), Blockade of muscarinic (anticholinergic), Cardiac effects, D for Drowsiness.",
      related_topics: ["tca-side-effects", "orthostatic-hypotension", "elderly-prescribing"]
    }
  },
  {
    id: '79f01d8e-529c-46b6-8aff-a0b13b777243',
    order: 89,
    structured: {
      summary: "Nausea is the most common initial SSRI side effect, affecting up to 40% of patients. It typically improves within the first 1-2 weeks as tolerance develops.",
      key_points: [
        "Nausea results from serotonin stimulation of 5-HT3 receptors in GI tract",
        "Usually resolves within 1-2 weeks",
        "Taking SSRIs with food can help reduce nausea",
        "Sexual dysfunction is common but typically persists (doesn't resolve)"
      ],
      clinical_pearl: "Counsel patients that nausea is temporary - if they stop medication due to early nausea, they miss the benefits. Taking with food and starting at half-dose can minimize this.",
      why_wrong: {
        A: "SSRIs cause sexual DYSFUNCTION, not increased libido.",
        B: "Significant weight gain is more associated with mirtazapine/TCAs; SSRIs are weight-neutral.",
        D: "Polyuria is associated with lithium, not SSRIs.",
        E: "Constipation is an anticholinergic effect (TCAs), not typical of SSRIs."
      },
      exam_tip: "For 'common INITIAL SSRI side effect that resolves', nausea is the answer. Sexual dysfunction is common but PERSISTS.",
      related_topics: ["ssri-side-effects", "initial-therapy", "patient-counselling"]
    }
  },
  {
    id: '967caa52-23aa-4808-9c9d-a3ef423ef3fa',
    order: 90,
    structured: {
      summary: "Lamotrigine is the most appropriate choice for Bipolar II depression because it specifically prevents depressive episodes with minimal risk of triggering mania.",
      key_points: [
        "Bipolar II: characterized by depression + hypomania (not full mania)",
        "Lamotrigine: most effective for bipolar depression prevention",
        "Low risk of causing manic switching",
        "Requires slow titration due to Stevens-Johnson syndrome risk"
      ],
      clinical_pearl: "Bipolar II patients spend much more time in depression than hypomania. Lamotrigine addresses this pattern, while lithium and valproate are better for Bipolar I with significant manic episodes.",
      why_wrong: {
        A: "Lithium is more effective for mania prevention than depression in bipolar disorder.",
        C: "Haloperidol is for acute mania/psychosis - not appropriate for bipolar depression.",
        D: "Risperidone is for mania/psychosis - not first-line for bipolar depression.",
        E: "Carbamazepine is better for mania prevention than depression."
      },
      exam_tip: "Bipolar II + depression focus = Lamotrigine. Bipolar I + mania focus = Lithium. Match the medication to the dominant pole.",
      related_topics: ["bipolar-ii", "lamotrigine", "bipolar-depression"]
    }
  },
  {
    id: 'a6363ac3-d84f-4b77-af37-68ffa6c6f9c5',
    order: 91,
    structured: {
      summary: "After 12 weeks of no response to an SSRI, augmenting with bupropion is an effective strategy. Bupropion adds noradrenergic and dopaminergic effects that may help treatment-resistant patients.",
      key_points: [
        "Bupropion augmentation: adds NE and DA mechanisms to SSRI's serotonin effect",
        "Advantages: doesn't worsen sexual dysfunction, may help fatigue and concentration",
        "Other augmentation options: lithium, atypical antipsychotics (aripiprazole, quetiapine)",
        "Ensure original SSRI trial was adequate before augmenting"
      ],
      clinical_pearl: "Bupropion + SSRI is one of the most common antidepressant combinations. It's well-tolerated and addresses different symptom clusters (bupropion helps energy/focus, SSRI helps mood/anxiety).",
      why_wrong: {
        A: "Doubling the dose after no response at 12 weeks is unlikely to help.",
        B: "CBT is valuable but doesn't address the medication non-response directly.",
        C: "Switching SSRIs is an option but augmentation is often tried first after 12+ weeks.",
        E: "Lithium augmentation is effective but bupropion is often tried first due to fewer monitoring requirements."
      },
      exam_tip: "For 'no response to SSRI after adequate trial', augmentation options include bupropion, lithium, and atypical antipsychotics. Bupropion is often preferred for tolerability.",
      related_topics: ["augmentation-strategies", "treatment-resistant-depression", "bupropion"]
    }
  },
  {
    id: '9a9a7166-72e1-4beb-8abb-67198b4aff76',
    order: 92,
    structured: {
      summary: "Olanzapine is a first-line option for acute mania in bipolar disorder. It works rapidly to control manic symptoms and is often combined with mood stabilizers.",
      key_points: [
        "Atypical antipsychotics (olanzapine, risperidone, quetiapine) are first-line for acute mania",
        "Faster onset than lithium (days vs weeks)",
        "Often combined with lithium or valproate for optimal control",
        "Antidepressants are CONTRAINDICATED in acute mania"
      ],
      clinical_pearl: "For acute mania, the combination of an antipsychotic + mood stabilizer works better than either alone. Start both early rather than waiting to see if one works.",
      why_wrong: {
        A: "Fluoxetine (SSRI) can trigger or worsen mania - contraindicated in acute mania.",
        C: "Escitalopram (SSRI) same as fluoxetine - can worsen mania.",
        D: "Amitriptyline (TCA) has highest mania-switching risk - absolutely contraindicated.",
        E: "Buspirone is for anxiety disorders - no role in mania treatment."
      },
      exam_tip: "For acute mania, think 'antipsychotic + mood stabilizer'. Never antidepressants alone - they can trigger or worsen mania.",
      related_topics: ["acute-mania", "olanzapine", "bipolar-treatment"]
    }
  },
  {
    id: 'e5f1f678-c7e3-4838-a83a-b945fe1e5318',
    order: 93,
    structured: {
      summary: "SSRIs take 2-4 weeks to show initial benefit, with full effect at 8-12 weeks. After only 2 weeks with minimal improvement, the appropriate action is to continue and reassess.",
      key_points: [
        "Initial response: 2-4 weeks",
        "Full response: 8-12 weeks",
        "Don't make changes before adequate trial (6-8 weeks at therapeutic dose)",
        "Counsel patients about delayed onset to prevent early discontinuation"
      ],
      clinical_pearl: "Setting realistic expectations is crucial. Tell patients: 'You may feel some side effects in the first week or two, but the benefits take longer - usually 4-6 weeks. Let's give it a proper chance.'",
      why_wrong: {
        A: "Switching to benzodiazepines after 2 weeks doesn't give the SSRI a proper trial.",
        B: "Increasing dose at 2 weeks is premature - the current dose hasn't had time to work.",
        D: "Adding CBT is reasonable but doesn't address the medication timing question.",
        E: "Switching medication classes at 2 weeks is premature - wait for adequate trial."
      },
      exam_tip: "For 'minimal improvement at 2 weeks on SSRI', the answer is almost always 'continue and reassess'. Don't abandon treatment prematurely.",
      related_topics: ["ssri-onset", "treatment-expectations", "patient-counselling"]
    }
  },
  {
    id: '60f52618-3dd6-4e4c-ad8e-54aeea39ab3c',
    order: 94,
    structured: {
      summary: "Bupropion should be avoided in patients with seizure history because it significantly lowers the seizure threshold. This is a key contraindication that must be screened for.",
      key_points: [
        "Bupropion lowers seizure threshold in dose-dependent manner",
        "Risk factors: seizure history, eating disorders, alcohol withdrawal, head trauma",
        "Also avoid if taking drugs that lower seizure threshold (antipsychotics, tramadol)",
        "SSRIs and SNRIs are generally safe in seizure patients"
      ],
      clinical_pearl: "Bupropion is also contraindicated in eating disorders (bulimia, anorexia) because electrolyte disturbances lower seizure threshold further. Always screen for these before prescribing.",
      why_wrong: {
        A: "Duloxetine (SNRI) is generally safe in seizure patients.",
        B: "Fluoxetine (SSRI) is safe in seizure patients.",
        D: "Venlafaxine (SNRI) is safe in seizure patients.",
        E: "Escitalopram (SSRI) is safe in seizure patients."
      },
      exam_tip: "Bupropion contraindications: seizures, eating disorders (bulimia/anorexia), and concurrent MAOIs. This is frequently tested.",
      related_topics: ["bupropion-contraindications", "seizure-risk", "antidepressant-safety"]
    }
  },
  {
    id: '85a483df-54f3-423d-8ea0-0c4eb44d1267',
    order: 95,
    structured: {
      summary: "Risperidone causes significant prolactin elevation, requiring annual monitoring for hyperprolactinaemia-related symptoms: galactorrhoea, gynaecomastia, menstrual irregularities, and sexual dysfunction.",
      key_points: [
        "Risperidone has highest prolactin elevation among atypicals",
        "Symptoms: galactorrhoea, gynaecomastia, amenorrhoea, sexual dysfunction",
        "Long-term: reduced bone density due to hypogonadism",
        "Alternatives with lower prolactin effects: aripiprazole, quetiapine"
      ],
      clinical_pearl: "Young women on risperidone should be monitored closely for menstrual changes and sexual dysfunction. High prolactin suppresses gonadotropins, affecting fertility and bone health.",
      why_wrong: {
        B: "Urine output monitoring is relevant to lithium (nephrogenic DI), not risperidone.",
        C: "Serum sodium is relevant to carbamazepine (SIADH), not risperidone.",
        D: "HbA1c is for metabolic monitoring - relevant to olanzapine more than risperidone.",
        E: "Platelet count monitoring is for valproate, not risperidone."
      },
      exam_tip: "Risperidone = Raised Prolactin. This is the most commonly tested prolactin-related question. Aripiprazole is the opposite - can lower prolactin.",
      related_topics: ["risperidone-monitoring", "hyperprolactinaemia", "antipsychotic-side-effects"]
    }
  },
  {
    id: 'ba111df3-905d-41e0-892e-bdf536970d3f',
    order: 96,
    structured: {
      summary: "Benzodiazepines like lorazepam provide rapid relief for acute panic attacks (within 30 minutes) but should only be used short-term due to dependence risk.",
      key_points: [
        "Lorazepam onset: 15-30 minutes orally, faster sublingual",
        "Effective for acute panic but not for long-term management",
        "Limit use to 2-4 weeks to avoid dependence",
        "SSRIs are for long-term panic disorder management"
      ],
      clinical_pearl: "Prescribe benzodiazepines for panic as 'PRN for acute attacks' while SSRI takes effect, with a clear endpoint. Having a rescue medication available can paradoxically reduce panic frequency.",
      why_wrong: {
        B: "Sertraline takes 2-4 weeks to work - not suitable for ACUTE panic relief.",
        C: "Buspirone has slow onset (2-4 weeks) and is better for GAD than panic disorder.",
        D: "Duloxetine takes weeks to work - not for acute panic.",
        E: "Lithium is for bipolar disorder - no role in panic disorder."
      },
      exam_tip: "For 'acute' or 'rapid relief' of panic, benzodiazepines are correct. For 'long-term management', SSRIs are correct. The timing word determines the answer.",
      related_topics: ["acute-panic", "benzodiazepines", "panic-disorder"]
    }
  },
  {
    id: '1243e8c0-590d-4085-b4a5-181a51ed3a5d',
    order: 97,
    structured: {
      summary: "Extrapyramidal symptoms (EPS) from first-generation antipsychotics are best treated by adding an anticholinergic medication like procyclidine or benztropine, which restores dopamine-acetylcholine balance.",
      key_points: [
        "EPS: dystonia, parkinsonism (rigidity, tremor, bradykinesia), akathisia",
        "Caused by dopamine D2 blockade in nigrostriatal pathway",
        "Anticholinergics restore balance: procyclidine, benztropine, orphenadrine",
        "Alternative: switch to atypical antipsychotic with lower EPS risk"
      ],
      clinical_pearl: "Some clinicians prescribe anticholinergics prophylactically with high-dose typical antipsychotics. However, they add anticholinergic burden - use only when EPS actually develops if possible.",
      why_wrong: {
        A: "Discontinuing immediately leaves the patient's psychosis untreated - not appropriate without alternative plan.",
        B: "Switching to an atypical is an option but not the immediate management of EPS.",
        C: "Beta-blockers help akathisia specifically but not parkinsonism/dystonia.",
        D: "Benzodiazepines may help dystonia but anticholinergics are first-line for drug-induced parkinsonism."
      },
      exam_tip: "EPS from antipsychotics = add anticholinergic. Akathisia specifically = consider beta-blocker or benzodiazepine.",
      related_topics: ["extrapyramidal-symptoms", "anticholinergics", "antipsychotic-management"]
    }
  },
  {
    id: '7fae8658-358c-4dd4-806e-933ef089c6a4',
    order: 98,
    structured: {
      summary: "Mirtazapine is the best choice for depression with severe insomnia because its sedating properties (via H1 blockade) improve sleep while also treating depression.",
      key_points: [
        "Mirtazapine: strong sedation via histamine H1 receptor blockade",
        "Sedation is more prominent at lower doses (7.5-15mg) - take at bedtime",
        "Also helps appetite in patients with depression-related weight loss",
        "SSRIs and bupropion can worsen insomnia"
      ],
      clinical_pearl: "For depression with insomnia, mirtazapine is often the answer. For depression with anxiety and agitation, sertraline or escitalopram. Match the antidepressant's side effect profile to the patient's symptom profile.",
      why_wrong: {
        A: "Fluoxetine is activating and can worsen insomnia.",
        B: "Sertraline can cause insomnia in some patients.",
        D: "Bupropion is the most activating antidepressant - would significantly worsen insomnia.",
        E: "Citalopram is neutral but doesn't specifically help insomnia."
      },
      exam_tip: "Depression + insomnia = Mirtazapine. Depression + weight loss = Mirtazapine. Depression + concerns about weight gain = Fluoxetine or Bupropion.",
      related_topics: ["mirtazapine", "depression-insomnia", "antidepressant-selection"]
    }
  },
  {
    id: '96335c77-a997-4575-b2d8-76ff85f48db7',
    order: 99,
    structured: {
      summary: "For acute mania, the combination of lithium (mood stabilizer) plus olanzapine (antipsychotic) is more effective than either alone. This addresses both rapid symptom control and long-term stabilization.",
      key_points: [
        "Combination therapy is standard for acute mania",
        "Antipsychotic provides rapid symptom control (days)",
        "Mood stabilizer provides long-term stabilization (weeks)",
        "Antidepressants are CONTRAINDICATED in acute mania"
      ],
      clinical_pearl: "The 'mania triad' of treatment: antipsychotic for rapid control, mood stabilizer for maintenance, and NEVER an antidepressant during the manic episode.",
      why_wrong: {
        A: "Lithium + valproate: both mood stabilizers but misses rapid antipsychotic benefit.",
        C: "Valproate + sertraline: sertraline (SSRI) can worsen mania - dangerous combination.",
        D: "Olanzapine + fluoxetine: this combination is for bipolar DEPRESSION, not acute mania.",
        E: "Aripiprazole + bupropion: bupropion can trigger mania - inappropriate combination."
      },
      exam_tip: "Acute mania = mood stabilizer + antipsychotic. Any combination including an antidepressant for ACUTE MANIA is wrong.",
      related_topics: ["acute-mania-treatment", "combination-therapy", "bipolar-pharmacotherapy"]
    }
  },
  {
    id: '851fc3e1-e87e-43ca-88e7-14908750d6af',
    order: 100,
    structured: {
      summary: "SSRIs carry a black box warning for increased suicidality in young adults under 25, particularly during the first weeks of treatment. Close monitoring is essential during this period.",
      key_points: [
        "Black box warning: applies to all antidepressants in under-25s",
        "Risk is highest in first 1-4 weeks and during dose changes",
        "Mechanism: energy improves before mood, enabling action on suicidal thoughts",
        "Benefits still outweigh risks - untreated depression carries higher suicide risk"
      ],
      clinical_pearl: "The paradox: antidepressants reduce suicide risk overall but may temporarily increase it early in treatment. The solution is close monitoring, not avoiding treatment.",
      why_wrong: {
        A: "Increased bleeding risk is real but not the PRIMARY safety consideration in young adults.",
        B: "SSRIs have delayed onset (2-4 weeks), not immediate effect.",
        C: "Serotonin syndrome risk is from drug combinations, not SSRIs alone.",
        D: "Suicidality warning is for YOUNG adults under 25, not adults over 65."
      },
      exam_tip: "When starting SSRIs in under-25s: close monitoring (weekly initially), family involvement, crisis contact plan. This is the most important safety consideration.",
      related_topics: ["ssri-safety", "suicidality-warning", "antidepressant-monitoring"]
    }
  }
]

async function main() {
  console.log('Starting batch 5 update (questions 81-100)...')

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

  console.log(`\nBatch 5 complete! Updated: ${updated}, Failed: ${failed}`)
  console.log(`\n🎉 All 100 trial questions have been enhanced!`)
}

main()
