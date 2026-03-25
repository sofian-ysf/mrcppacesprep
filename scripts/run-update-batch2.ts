import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const explanations = [
  {
    id: '1ae4276b-e602-4201-b40a-9e62e1b61128',
    order: 21,
    structured: {
      summary: "ACE inhibitors like ramipril are first-line for hypertension in CKD patients because they provide renal protection by reducing intraglomerular pressure and proteinuria, slowing disease progression.",
      key_points: [
        "ACE inhibitors reduce proteinuria and slow CKD progression",
        "NICE recommends ACE inhibitors (or ARBs if intolerant) as first-line for CKD with hypertension",
        "Monitor serum creatinine and potassium within 2 weeks of starting ACE inhibitors",
        "Avoid ACE inhibitors if bilateral renal artery stenosis is suspected"
      ],
      clinical_pearl: "A rise in creatinine of up to 30% after starting an ACE inhibitor is acceptable and expected - only stop if it rises more than 30% or potassium exceeds 6 mmol/L.",
      why_wrong: {
        A: "Amlodipine is effective for blood pressure control but doesn't provide the renal protective benefits of ACE inhibitors in CKD patients.",
        B: "Thiazide diuretics like bendroflumethiazide are less effective in patients with reduced renal function (eGFR <30) and don't slow CKD progression.",
        D: "Beta-blockers like atenolol are not first-line for hypertension in CKD unless there's a compelling indication like heart failure or post-MI.",
        E: "Hydrochlorothiazide, like bendroflumethiazide, becomes ineffective in advanced CKD and lacks renoprotective properties."
      },
      exam_tip: "Remember 'ACE = Albumin Conservation in Every nephron' - ACE inhibitors protect kidneys by reducing protein loss in urine.",
      related_topics: ["ace-inhibitors", "chronic-kidney-disease", "hypertension-management"]
    }
  },
  {
    id: 'ef953353-0f70-4d4e-8b4a-92cad75d26ca',
    order: 22,
    structured: {
      summary: "All diabetes medications listed require annual renal function monitoring because they are either renally cleared, contraindicated in renal impairment, or have dose adjustments based on eGFR.",
      key_points: [
        "Metformin: Contraindicated if eGFR <30, dose reduction at 30-45",
        "SGLT2 inhibitors: Reduced efficacy at lower eGFR, contraindicated if eGFR <20",
        "DPP-4 inhibitors: Most require dose reduction in renal impairment (except linagliptin)",
        "Sulfonylureas: Increased hypoglycaemia risk in renal impairment due to accumulation"
      ],
      clinical_pearl: "When checking eGFR for diabetes medications, always use a recent (within 3 months) value - renal function can change rapidly, especially with concurrent illness or dehydration.",
      why_wrong: {
        A: "Metformin alone requires monitoring, but so do all the other options listed.",
        B: "Gliclazide requires monitoring as it can accumulate in renal impairment causing prolonged hypoglycaemia.",
        C: "Sitagliptin requires dose reduction: 50mg if eGFR 30-45, 25mg if eGFR <30.",
        D: "Empagliflozin requires monitoring as its glucose-lowering efficacy is reduced at lower eGFR levels."
      },
      exam_tip: "For MRCP PACES questions about diabetes medications, always consider renal function. If the question mentions 'which requires monitoring', think about ALL drugs requiring renal assessment.",
      related_topics: ["diabetes-management", "renal-dosing", "metformin-safety"]
    }
  },
  {
    id: 'df2515ed-623b-4b7b-bc01-5d32e50ce284',
    order: 23,
    structured: {
      summary: "NICE recommends ACE inhibitor + beta-blocker + MRA as first-line triple therapy for heart failure with reduced ejection fraction (HFrEF), as each component independently reduces mortality.",
      key_points: [
        "Start ACE inhibitor first (or ARB if intolerant), then add beta-blocker",
        "Add MRA (spironolactone/eplerenone) once stable on ACE inhibitor and beta-blocker",
        "Loop diuretics are used for symptom relief but don't improve mortality",
        "SGLT2 inhibitors are now also recommended as fourth-line regardless of diabetes status"
      ],
      clinical_pearl: "Titrate heart failure medications slowly - 'start low, go slow'. Beta-blockers may initially worsen symptoms but provide long-term mortality benefit. Allow 2 weeks between dose increases.",
      why_wrong: {
        A: "ACE inhibitor and beta-blocker are essential but incomplete without MRA for optimal mortality reduction.",
        B: "Beta-blocker and MRA without an ACE inhibitor misses the foundational therapy that should be started first.",
        D: "Diuretics provide symptom relief but don't reduce mortality - they're used as needed alongside disease-modifying therapy.",
        E: "Beta-blocker and diuretic combination doesn't include the essential ACE inhibitor and MRA components."
      },
      exam_tip: "Remember 'A-B-M' for heart failure: ACE inhibitor, Beta-blocker, MRA - this is the foundation before considering SGLT2 inhibitors.",
      related_topics: ["heart-failure", "ace-inhibitors", "beta-blockers", "mineralocorticoid-antagonists"]
    }
  },
  {
    id: 'cc470a10-48ad-40d1-85a9-0d06bbeabd62',
    order: 24,
    structured: {
      summary: "Fluoxetine is the most weight-neutral SSRI option for depression, making it suitable for patients concerned about weight gain. Mirtazapine and TCAs have the highest weight gain risk.",
      key_points: [
        "Fluoxetine and bupropion are considered most weight-neutral antidepressants",
        "Mirtazapine causes significant weight gain via histamine H1 receptor antagonism",
        "Paroxetine is the SSRI most associated with weight gain",
        "TCAs like amitriptyline commonly cause weight gain and sedation"
      ],
      clinical_pearl: "If a patient on mirtazapine for insomnia and depression complains of weight gain, switching to fluoxetine may help - though they may need a separate sleep aid.",
      why_wrong: {
        A: "Mirtazapine increases appetite significantly through histamine blockade - it's sometimes deliberately used for underweight patients.",
        B: "Paroxetine has the highest weight gain potential among SSRIs due to its anticholinergic effects.",
        D: "Amitriptyline causes weight gain and also has sedating and anticholinergic side effects.",
        E: "Sertraline is relatively weight-neutral but has more reports of weight changes than fluoxetine."
      },
      exam_tip: "For weight-conscious patients: Fluoxetine First! Remember it's also the longest-acting SSRI, which can help if patients occasionally miss doses.",
      related_topics: ["antidepressants", "ssris", "medication-side-effects"]
    }
  },
  {
    id: '8fe80d19-5927-49f5-b5c5-2f63b05b472e',
    order: 25,
    structured: {
      summary: "To prevent relapse in recurrent depression, antidepressant therapy should continue for at least 6-12 months after symptoms resolve - longer continuation reduces relapse risk significantly.",
      key_points: [
        "Continue antidepressants for 6-12 months after remission for first episode",
        "Consider 2+ years continuation for patients with multiple episodes or risk factors",
        "Tapering should be gradual (over weeks to months) to avoid discontinuation symptoms",
        "Risk factors for relapse: multiple episodes, residual symptoms, comorbidities"
      ],
      clinical_pearl: "Patients often want to stop antidepressants when they feel better - explain that continuing treatment is like taking the full course of antibiotics, even though you feel better before finishing.",
      why_wrong: {
        A: "Stopping at 6 months when symptoms improve misses the crucial continuation phase - this is when relapse risk is highest.",
        C: "Switching medications yearly has no evidence base and would disrupt effective treatment unnecessarily.",
        D: "Using medication only during episodes (intermittent therapy) leads to higher relapse rates than maintenance therapy.",
        E: "Arbitrary dose increases don't prevent relapse - the effective dose that achieved remission should be maintained."
      },
      exam_tip: "Think '6-12 after remission' for depression continuation. For patients with 2+ episodes or high-risk features, think 'at least 2 years'.",
      related_topics: ["depression-treatment", "relapse-prevention", "antidepressant-duration"]
    }
  },
  {
    id: 'cc78744c-a969-4aee-b042-124588874aa8',
    order: 26,
    structured: {
      summary: "Risperidone causes significant prolactin elevation due to strong D2 receptor blockade in the pituitary, leading to symptoms like galactorrhoea, gynaecomastia, and menstrual irregularities.",
      key_points: [
        "Risperidone has the highest prolactin-elevating effect among atypical antipsychotics",
        "Symptoms of hyperprolactinaemia: breast enlargement, milk secretion, amenorrhoea, sexual dysfunction",
        "Long-term hyperprolactinaemia can reduce bone density due to oestrogen/testosterone suppression",
        "Aripiprazole is an alternative with minimal prolactin effects (partial D2 agonist)"
      ],
      clinical_pearl: "If a patient on risperidone develops sexual dysfunction or breast symptoms, check prolactin levels. Consider switching to aripiprazole, which may even reduce prolactin levels.",
      why_wrong: {
        A: "Antipsychotics typically cause weight GAIN, not loss. Risperidone has moderate weight gain potential.",
        B: "Antipsychotics more commonly cause orthostatic hypotension, not hypertension.",
        D: "Hypothyroidism is not a typical side effect of risperidone - this is more associated with lithium.",
        E: "Urinary retention is more associated with medications with anticholinergic effects like clozapine or olanzapine."
      },
      exam_tip: "Remember 'R for Raised prolactin with Risperidone'. It's the most likely antipsychotic to cause prolactin-related side effects in exam questions.",
      related_topics: ["antipsychotics", "risperidone", "hyperprolactinaemia"]
    }
  },
  {
    id: '9764e27b-e731-450c-bec6-a066c0f75a15',
    order: 27,
    structured: {
      summary: "Valproate is effective in treating acute mania in bipolar disorder - this is its primary use as a mood stabilizer, particularly when lithium is unsuitable or additional rapid control is needed.",
      key_points: [
        "Valproate is effective for acute mania and maintenance in bipolar disorder",
        "Works faster than lithium in acute mania (days vs weeks)",
        "Requires monitoring: LFTs, FBC, and signs of pancreatitis",
        "Absolutely contraindicated in pregnancy (teratogenic) - Pregnancy Prevention Programme required"
      ],
      clinical_pearl: "Valproate is preferred over lithium when rapid control of mania is needed, in mixed episodes, or when the patient cannot reliably attend for lithium monitoring. However, always consider the Pregnancy Prevention Programme for females of childbearing potential.",
      why_wrong: {
        A: "Valproate has significant side effects including weight gain, hair loss, tremor, and teratogenicity - not necessarily fewer than lithium.",
        C: "Valproate DOES require monitoring - liver function tests, FBC, and weight should be checked regularly.",
        D: "Valproate carries risks of hepatotoxicity, pancreatitis, and severe teratogenic effects - it has real toxicity risks.",
        E: "Valproate is primarily used for mania prevention, not depression - different agents are used for bipolar depression."
      },
      exam_tip: "For acute mania questions, think 'Valproate = Very Fast for Mania'. But always flag pregnancy concerns - valproate is the anticonvulsant with the strongest teratogenic warnings.",
      related_topics: ["bipolar-disorder", "mood-stabilizers", "valproate"]
    }
  },
  {
    id: 'e1d6c049-ad30-4550-83b3-dd4356d86e48',
    order: 28,
    structured: {
      summary: "Benzodiazepines like lorazepam provide rapid relief for acute panic attacks due to their fast onset of action (within minutes), making them ideal for as-needed use during acute episodes.",
      key_points: [
        "Lorazepam onset: 15-30 minutes (oral), faster if sublingual",
        "SSRIs take 2-4 weeks to show benefit - not suitable for acute relief",
        "Benzodiazepines should be short-term only (2-4 weeks) due to dependence risk",
        "CBT is first-line long-term but doesn't provide immediate symptom relief"
      ],
      clinical_pearl: "Prescribe benzodiazepines for panic disorder with a clear time limit and exit strategy. PRN use for acute attacks while SSRIs take effect is appropriate, but reassess regularly to avoid dependence.",
      why_wrong: {
        A: "Fluoxetine is excellent for long-term panic disorder management but takes weeks to work - not suitable for acute attacks.",
        B: "CBT is the most effective long-term treatment for panic disorder but requires multiple sessions over weeks to months.",
        D: "Buspirone takes 2-4 weeks to work and is better for generalized anxiety than panic disorder.",
        E: "Duloxetine, like other SNRIs/SSRIs, has a delayed onset and is used for maintenance, not acute relief."
      },
      exam_tip: "For 'acute' or 'rapid relief' questions about anxiety, benzodiazepines are almost always the answer. But remember they're for short-term use only.",
      related_topics: ["panic-disorder", "benzodiazepines", "anxiety-management"]
    }
  },
  {
    id: '94c71ef5-0469-410a-b50a-cd14d2e98106',
    order: 29,
    structured: {
      summary: "Atypical antipsychotics are most effective for preventing schizophrenia relapse because they treat both positive symptoms (hallucinations, delusions) and negative symptoms (apathy, social withdrawal) with fewer movement disorder side effects.",
      key_points: [
        "Atypicals target positive and negative symptoms; typicals mainly target positive symptoms",
        "Lower risk of extrapyramidal side effects (EPS) and tardive dyskinesia with atypicals",
        "Long-acting injectable formulations improve adherence and reduce relapse",
        "Examples: risperidone, olanzapine, quetiapine, aripiprazole"
      ],
      clinical_pearl: "For patients with poor medication adherence, consider long-acting injectable (LAI) antipsychotics - options include risperidone LAI, paliperidone palmitate, and aripiprazole LAI. They significantly reduce relapse rates.",
      why_wrong: {
        A: "SSRIs treat depression, not schizophrenia. They may be added for comorbid depression but aren't primary treatment.",
        B: "Typical antipsychotics work but have higher rates of EPS, tardive dyskinesia, and are less effective for negative symptoms.",
        D: "TCAs are antidepressants with no role in schizophrenia maintenance - their anticholinergic effects could worsen cognition.",
        E: "Mood stabilizers (lithium, valproate) are for bipolar disorder, not schizophrenia maintenance therapy."
      },
      exam_tip: "Remember 'Atypicals = All symptoms' - they treat both positive AND negative symptoms. 'Typicals = Traditional' but with more movement side effects.",
      related_topics: ["schizophrenia", "antipsychotics", "relapse-prevention"]
    }
  },
  {
    id: '3589cae9-a3ce-44bd-86e7-2efe8f66d19b',
    order: 30,
    structured: {
      summary: "SSRIs carry a black box warning for increased suicidality in young adults under 25, particularly during the first weeks of treatment. Close monitoring is essential when initiating treatment.",
      key_points: [
        "Black box warning applies to all antidepressants in under-25s, but SSRIs are most commonly prescribed",
        "Risk is highest in first 1-4 weeks and during dose changes",
        "Weekly monitoring recommended for first 4 weeks, then fortnightly",
        "Benefits generally outweigh risks - treatment reduces overall suicide risk"
      ],
      clinical_pearl: "The paradox: untreated depression carries higher suicide risk than treated. Monitor closely but don't avoid prescribing - just ensure appropriate safety netting and follow-up.",
      why_wrong: {
        A: "TCAs like amitriptyline are more dangerous in overdose but don't carry the specific black box warning for increased suicidality in young adults.",
        C: "Lithium actually has anti-suicidal properties - it's one of few medications shown to reduce suicide risk.",
        D: "Bupropion carries the same antidepressant class warning but isn't specifically highlighted for young adults.",
        E: "Venlafaxine carries the class warning but sertraline is the example that best demonstrates SSRI-specific concerns."
      },
      exam_tip: "Black box warning + young adult + depression = think SSRIs. Remember to advise patients about the 'activation' risk in early weeks and ensure follow-up is arranged.",
      related_topics: ["ssri-safety", "depression-young-adults", "antidepressant-monitoring"]
    }
  },
  {
    id: '13ef69bc-e08c-4f67-83dc-961c3cab6007',
    order: 31,
    structured: {
      summary: "Serotonin syndrome presents with autonomic hyperactivity (tachycardia, hypertension, hyperthermia), neuromuscular excitation (tremor, clonus, rigidity), and mental status changes. Bradycardia is NOT a feature - tachycardia is expected.",
      key_points: [
        "Triad: autonomic dysfunction, neuromuscular abnormalities, altered mental status",
        "Key signs: hyperthermia, agitation, tremor, clonus, hyperreflexia, diaphoresis",
        "Caused by excessive serotonergic activity - often from drug combinations",
        "Management: stop offending drugs, supportive care, cyproheptadine if severe"
      ],
      clinical_pearl: "The mnemonic 'SHIVERS' helps remember serotonin syndrome: Shivering, Hyperreflexia, Increased temperature, Vital sign instability (tachycardia, hypertension), Encephalopathy, Restlessness, Sweating.",
      why_wrong: {
        A: "Hypertension IS a feature of serotonin syndrome due to sympathetic overactivation.",
        B: "Hyperthermia IS a key feature - temperature can exceed 40°C in severe cases.",
        C: "Clonus (rhythmic muscle contractions) IS a characteristic finding, especially in lower limbs.",
        E: "Agitation and altered mental status ARE features due to CNS serotonin excess."
      },
      exam_tip: "Serotonin syndrome = everything is 'UP' and 'FAST': high temperature, high heart rate, high blood pressure, hyperreflexia. Bradycardia doesn't fit this picture.",
      related_topics: ["serotonin-syndrome", "drug-interactions", "ssri-complications"]
    }
  },
  {
    id: '017c9dd8-543a-42f0-b13a-67e5b64f94e0',
    order: 32,
    structured: {
      summary: "Lithium therapy requires annual TSH monitoring because lithium inhibits thyroid hormone synthesis and release, commonly causing hypothyroidism (5-35% of patients).",
      key_points: [
        "Check TSH and renal function (eGFR, creatinine) at baseline, then every 6-12 months",
        "Lithium-induced hypothyroidism is often subclinical initially",
        "Women and those with thyroid antibodies are at higher risk",
        "Hypothyroidism is treatable with levothyroxine - lithium doesn't need to be stopped"
      ],
      clinical_pearl: "A patient on lithium presenting with fatigue, weight gain, and low mood might not be having a depressive relapse - check their thyroid! Hypothyroidism symptoms overlap significantly with depression.",
      why_wrong: {
        A: "LFTs are monitored for valproate, not lithium. Lithium doesn't cause hepatotoxicity.",
        C: "HbA1c is for diabetes monitoring. While some antipsychotics cause metabolic effects, lithium doesn't significantly affect glucose.",
        D: "Platelet count is monitored for valproate (thrombocytopenia risk), not lithium.",
        E: "CRP is an inflammatory marker with no specific relevance to lithium monitoring."
      },
      exam_tip: "Lithium monitoring: 'TRU' - Thyroid (TSH), Renal (eGFR, creatinine), U&Es (especially sodium). Check levels regularly and watch for toxicity signs.",
      related_topics: ["lithium-monitoring", "hypothyroidism", "bipolar-disorder"]
    }
  },
  {
    id: '02387fd4-fe6c-4712-b68c-44c27adb739c',
    order: 33,
    structured: {
      summary: "SSRIs like sertraline are first-line for GAD due to their efficacy, tolerability, and safety profile. Benzodiazepines are only for short-term use due to dependence risk.",
      key_points: [
        "First-line: SSRIs (sertraline) or SNRIs (duloxetine, venlafaxine)",
        "SSRIs take 2-4 weeks to show benefit in anxiety",
        "Benzodiazepines: effective but restricted to 2-4 weeks maximum",
        "Pregabalin is second-line if SSRIs/SNRIs fail or are contraindicated"
      ],
      clinical_pearl: "Warn patients that SSRIs may initially worsen anxiety before improving it. Start at half the usual dose and titrate slowly to minimise this 'activation' effect.",
      why_wrong: {
        A: "Lorazepam is effective short-term but not first-line due to dependence, tolerance, and withdrawal risks.",
        B: "Buspirone is an option but has modest efficacy and slow onset - not typically first-line in UK guidelines.",
        D: "Diazepam has the same limitations as lorazepam - dependence risk makes it unsuitable for long-term GAD treatment.",
        E: "Quetiapine is not first-line for GAD and carries metabolic side effects - only considered in treatment-resistant cases."
      },
      exam_tip: "For GAD first-line, think 'SSRIs are Safe for Sustained anxiety treatment'. Reserve benzodiazepines for short-term bridge therapy only.",
      related_topics: ["generalized-anxiety", "ssris", "benzodiazepine-dependence"]
    }
  },
  {
    id: 'c64b362e-21f2-4fd4-b947-6ca731aeaf64',
    order: 34,
    structured: {
      summary: "Olanzapine causes the most significant metabolic side effects among antipsychotics, including substantial weight gain and hyperglycaemia, requiring regular metabolic monitoring.",
      key_points: [
        "Olanzapine and clozapine have highest metabolic risk",
        "Weight gain mechanism: H1 and 5-HT2C receptor antagonism increases appetite",
        "Metabolic syndrome risk: obesity, dyslipidaemia, hyperglycaemia, hypertension",
        "Monitor: weight, waist circumference, glucose, HbA1c, lipids at baseline and regularly"
      ],
      clinical_pearl: "Patients starting olanzapine should receive dietary advice upfront. Consider metformin if significant weight gain occurs - it can help mitigate antipsychotic-induced metabolic effects.",
      why_wrong: {
        A: "Haloperidol (typical antipsychotic) has lower metabolic risk but higher EPS risk - different side effect profile.",
        C: "Risperidone has moderate metabolic effects - less than olanzapine but more than aripiprazole.",
        D: "Aripiprazole is considered most metabolically neutral among common atypicals - good choice if weight is a concern.",
        E: "Lurasidone has minimal metabolic effects and must be taken with food - often chosen for weight-conscious patients."
      },
      exam_tip: "For 'weight gain and diabetes' with antipsychotics, think 'O for Obesity with Olanzapine'. Clozapine has similar risks but is reserved for treatment-resistant cases.",
      related_topics: ["olanzapine", "metabolic-syndrome", "antipsychotic-monitoring"]
    }
  },
  {
    id: '9679220a-44d7-422e-9fa0-1d596cb3e165',
    order: 35,
    structured: {
      summary: "After two failed SSRI trials, switching to an SNRI is recommended. SNRIs work on both serotonin and norepinephrine pathways, potentially benefiting patients who don't respond to serotonin-only medications.",
      key_points: [
        "Treatment-resistant depression defined as: failure to respond to 2+ adequate antidepressant trials",
        "Options after 2 SSRIs: switch class (SNRI), augment (lithium, atypical antipsychotic), or combination therapy",
        "SNRIs (venlafaxine, duloxetine) may benefit non-responders to SSRIs",
        "Consider factors: previous partial response, tolerability, comorbidities"
      ],
      clinical_pearl: "Before declaring treatment resistance, ensure previous trials were adequate: sufficient dose (therapeutic), sufficient duration (6-8 weeks at therapeutic dose), and good adherence. Many 'failures' are actually suboptimal trials.",
      why_wrong: {
        B: "Adding a benzodiazepine may help anxiety symptoms but doesn't address the core depression - not a treatment strategy.",
        C: "Psychotherapy alone after two medication failures is insufficient - combination with medication is more effective.",
        D: "TCAs are third-line due to side effects and overdose risk - SNRIs are preferred before TCAs.",
        E: "If two different SSRIs at adequate doses haven't worked, simply increasing the current one is unlikely to help."
      },
      exam_tip: "After 2 SSRI failures: 'Switch to SNRI' is the standard next step. Remember venlafaxine may help patients who partially responded to SSRIs.",
      related_topics: ["treatment-resistant-depression", "snris", "antidepressant-switching"]
    }
  },
  {
    id: 'e5b44f0a-7058-40bd-882a-a2a78e326d6f',
    order: 36,
    structured: {
      summary: "TCAs work primarily by blocking reuptake of norepinephrine and serotonin, increasing their availability in the synaptic cleft. They also have antihistaminic and anticholinergic effects that cause many side effects.",
      key_points: [
        "TCAs inhibit noradrenaline and serotonin transporters (dual action)",
        "Also block muscarinic, histamine H1, and alpha-1 receptors (causing side effects)",
        "More efficacious than SSRIs for severe depression in some studies",
        "Side effects limit use: anticholinergic effects, sedation, cardiac toxicity in overdose"
      ],
      clinical_pearl: "TCAs are sometimes preferred for depression with pain (neuropathic pain, fibromyalgia) or insomnia because their side effects (sedation, pain modulation) become therapeutic benefits. Amitriptyline 10-25mg at night is commonly used for neuropathic pain.",
      why_wrong: {
        A: "Selective serotonin reuptake inhibition describes SSRIs (fluoxetine, sertraline), not TCAs.",
        B: "MAO inhibition is the mechanism of MAOIs (phenelzine, tranylcypromine), not TCAs.",
        D: "Dopamine reuptake inhibition is the mechanism of bupropion and stimulants, not TCAs.",
        E: "5-HT1A agonism is the mechanism of buspirone, not TCAs."
      },
      exam_tip: "TCAs = 'Two neurotransmitters Caught' (noradrenaline and serotonin). Their dual action predates SNRIs but comes with more side effects.",
      related_topics: ["tricyclic-antidepressants", "antidepressant-mechanisms", "neurotransmitter-reuptake"]
    }
  },
  {
    id: 'e8a7c06c-76fa-4120-936f-a6fa43297714',
    order: 37,
    structured: {
      summary: "Lithium level of 1.6 mmol/L with neurological symptoms indicates moderate toxicity requiring immediate IV fluids to enhance renal excretion. Haemodialysis is reserved for severe toxicity (>2.0 mmol/L) or renal failure.",
      key_points: [
        "Therapeutic range: 0.4-1.0 mmol/L (maintenance), up to 1.2 mmol/L (acute episodes)",
        "Mild toxicity (1.5-2.0): GI symptoms, tremor, confusion - treat with IV fluids",
        "Severe toxicity (>2.0): seizures, coma, cardiac arrhythmias - consider haemodialysis",
        "Stop lithium immediately in any toxicity and monitor levels every 4-6 hours"
      ],
      clinical_pearl: "Common causes of lithium toxicity: dehydration, NSAIDs, ACE inhibitors, diuretics (especially thiazides), and infections causing fever. Always check recent medication changes or illness when toxicity presents.",
      why_wrong: {
        A: "Benzodiazepines don't address the underlying lithium toxicity - they might mask symptoms without treating the cause.",
        B: "Haemodialysis is reserved for severe toxicity (>2.0-2.5 mmol/L), renal failure, or when patients don't respond to conservative measures.",
        C: "Oral fluids are insufficient for treating established toxicity - IV fluids provide faster and more reliable hydration.",
        E: "Reducing the dose is for prevention, not treatment of acute toxicity - lithium must be stopped completely."
      },
      exam_tip: "For lithium toxicity: Stop lithium + IV fluids first. Haemodialysis for levels >2.0 mmol/L or life-threatening symptoms. Remember toxicity signs: tremor, ataxia, confusion, seizures.",
      related_topics: ["lithium-toxicity", "drug-monitoring", "emergency-management"]
    }
  },
  {
    id: 'c172dd43-0e6e-4292-909e-c11a5d4f3456',
    order: 38,
    structured: {
      summary: "Atypical antipsychotics are more effective at treating negative symptoms of schizophrenia (apathy, social withdrawal, flat affect) while having lower risk of movement disorders compared to typical antipsychotics.",
      key_points: [
        "Negative symptoms: apathy, alogia, anhedonia, social withdrawal, flat affect",
        "Atypicals have broader receptor profile including 5-HT2A antagonism",
        "Lower D2 affinity = lower EPS risk (dystonia, parkinsonism, tardive dyskinesia)",
        "Clozapine is most effective for treatment-resistant schizophrenia"
      ],
      clinical_pearl: "Negative symptoms often respond poorly to any antipsychotic - psychosocial interventions, cognitive remediation, and supported employment may be as important as medication for functional recovery.",
      why_wrong: {
        A: "LOWER EPS risk is the advantage of atypicals - option A incorrectly states higher risk.",
        C: "Neuroleptic malignant syndrome can occur with both generations - it's not more common with atypicals.",
        D: "Atypicals have MORE oral formulation options, not fewer - this is incorrect.",
        E: "LOWER tardive dyskinesia risk is an advantage of atypicals - option E incorrectly states increased risk."
      },
      exam_tip: "Atypical advantages: 'Better for Both' - both positive AND negative symptoms, with better tolerability. But remember metabolic effects are the trade-off.",
      related_topics: ["atypical-antipsychotics", "schizophrenia-symptoms", "extrapyramidal-effects"]
    }
  },
  {
    id: '598e98d6-5b79-40d3-bb96-318d34543ce6',
    order: 39,
    structured: {
      summary: "For acute panic episodes in a patient already on sertraline, adding a benzodiazepine like lorazepam provides rapid relief while the SSRI continues as maintenance therapy.",
      key_points: [
        "SSRIs are first-line maintenance but don't help acute attacks",
        "Benzodiazepines work within 15-30 minutes for acute symptoms",
        "Use lowest effective dose for shortest time (ideally <4 weeks)",
        "Gradual benzodiazepine withdrawal once SSRI is fully effective"
      ],
      clinical_pearl: "Prescribe benzodiazepines as 'PRN' (as needed) with a maximum daily dose. This gives patients control while limiting total use. Typical: lorazepam 0.5-1mg PRN up to TDS.",
      why_wrong: {
        A: "Amitriptyline is a TCA for depression/neuropathic pain - it wouldn't provide acute panic relief and takes weeks to work.",
        B: "Buspirone has slow onset (2-4 weeks) and is less effective for panic disorder than GAD - not suitable for acute episodes.",
        D: "Duloxetine is another maintenance option (SNRI) - it doesn't provide acute relief and would take weeks to work.",
        E: "Haloperidol is an antipsychotic with no role in panic disorder - could cause EPS and wouldn't help anxiety acutely."
      },
      exam_tip: "Already on SSRI + acute symptoms = add short-term benzodiazepine. Think of benzodiazepines as a 'bridge' while the SSRI is working.",
      related_topics: ["panic-disorder", "combination-therapy", "benzodiazepine-prn"]
    }
  },
  {
    id: '44ebc7d4-a3ec-4222-8194-01e9a6c8424a',
    order: 40,
    structured: {
      summary: "Fluoxetine is the SSRI least likely to cause weight gain and may even promote slight weight loss initially. Mirtazapine and amitriptyline are known for significant weight gain.",
      key_points: [
        "Weight-neutral options: fluoxetine, bupropion",
        "High weight gain risk: mirtazapine, TCAs, paroxetine",
        "Sertraline is intermediate - less weight gain than paroxetine but more than fluoxetine",
        "Weight changes vary individually - monitor and reassess if problematic"
      ],
      clinical_pearl: "For patients who've gained weight on another antidepressant, switching to fluoxetine or bupropion often helps. Bupropion is particularly useful when weight loss is a priority (also helps smoking cessation).",
      why_wrong: {
        A: "Amitriptyline causes significant weight gain through antihistamine and anticholinergic effects - poor choice for weight-conscious patients.",
        B: "Mirtazapine is notorious for weight gain - sometimes deliberately used in underweight or anorexic patients.",
        C: "Sertraline is relatively neutral but has more weight gain reports than fluoxetine.",
        D: "Paroxetine is the SSRI most associated with weight gain - worse than sertraline or fluoxetine."
      },
      exam_tip: "For minimal weight gain: 'F for Fluoxetine, F for Favorable weight profile'. Mirtazapine = Munchies (increases appetite).",
      related_topics: ["antidepressant-selection", "weight-gain", "ssri-comparison"]
    }
  }
]

async function main() {
  console.log('Starting batch 2 update (questions 21-40)...')

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

  console.log(`\nBatch 2 complete! Updated: ${updated}, Failed: ${failed}`)
}

main()
