import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const explanations = [
  {
    id: 'cd46b0ee-b76e-4639-bb04-4e45c697135c',
    order: 61,
    structured: {
      summary: "Aripiprazole has the most favorable metabolic profile among atypical antipsychotics, making it ideal for patients concerned about weight gain and metabolic syndrome.",
      key_points: [
        "Aripiprazole is metabolically neutral - minimal weight gain and diabetes risk",
        "Works as a partial D2 agonist (unique mechanism among antipsychotics)",
        "Olanzapine and clozapine have highest metabolic risk",
        "Lurasidone and ziprasidone are other metabolically favorable options"
      ],
      clinical_pearl: "Aripiprazole can even help reduce weight if added to a regimen where olanzapine was causing weight gain. Some patients are switched for this reason alone.",
      why_wrong: {
        A: "Olanzapine has the highest weight gain risk of listed options - can cause 7-10kg gain in first year.",
        B: "Quetiapine has moderate metabolic risk - causes weight gain and glucose abnormalities.",
        D: "Risperidone has moderate metabolic risk, plus significant prolactin elevation.",
        E: "Clozapine has very high metabolic risk (similar to olanzapine) and is reserved for treatment-resistant schizophrenia."
      },
      exam_tip: "For 'minimize metabolic risk' questions, Aripiprazole is almost always the answer. Remember: 'A for Aripiprazole, A for metabolic Advantage'.",
      related_topics: ["aripiprazole", "metabolic-syndrome", "antipsychotic-selection"]
    }
  },
  {
    id: 'c36ce3e4-bbd0-4399-ad30-95c940a0b43c',
    order: 62,
    structured: {
      summary: "Mirtazapine is ideal for depression with insomnia and weight loss because it has sedating properties (improves sleep) and increases appetite, addressing both symptoms therapeutically.",
      key_points: [
        "Mirtazapine blocks histamine H1 receptors causing sedation and appetite increase",
        "Best taken at bedtime; sedation is more prominent at lower doses (7.5-15mg)",
        "Often used specifically for depressed patients who can't sleep or eat",
        "Side effects (sedation, weight gain) become therapeutic benefits here"
      ],
      clinical_pearl: "Paradoxically, mirtazapine is MORE sedating at lower doses. At higher doses (30-45mg), noradrenergic effects offset sedation. Start low for insomnia benefit.",
      why_wrong: {
        A: "Fluoxetine is activating and can worsen insomnia; weight-neutral, so won't help weight loss.",
        B: "Sertraline can cause insomnia and GI upset; doesn't promote weight gain.",
        C: "Bupropion is the most activating antidepressant - would worsen insomnia and appetite suppression.",
        E: "Citalopram is similar to other SSRIs - doesn't specifically help sleep or appetite."
      },
      exam_tip: "Depression + insomnia + weight loss = Mirtazapine. It's one of the few antidepressants where 'side effects' solve patient problems.",
      related_topics: ["mirtazapine", "depression-with-insomnia", "antidepressant-selection"]
    }
  },
  {
    id: 'afd2a0e9-d09f-4be5-90bb-7b3e70f3d73b',
    order: 63,
    structured: {
      summary: "SSRIs like sertraline are first-line for panic disorder due to proven efficacy, safety, and ability to prevent recurrence. Benzodiazepines are only for short-term crisis management.",
      key_points: [
        "First-line for panic disorder: SSRIs (sertraline, paroxetine, fluoxetine)",
        "Start at half normal dose - panic patients are sensitive to initial activation",
        "Takes 2-4 weeks for benefit; may initially worsen anxiety before improving",
        "Benzodiazepines for acute attacks while waiting for SSRI effect"
      ],
      clinical_pearl: "Warn patients that SSRIs may make anxiety worse for the first 1-2 weeks before getting better. This prevents early discontinuation and builds trust.",
      why_wrong: {
        A: "Diazepam is effective acutely but not first-line due to dependence, tolerance, and withdrawal risks.",
        B: "Venlafaxine (SNRI) is also first-line but SSRIs are generally tried first.",
        D: "Buspirone is less effective for panic disorder than for GAD - not first-line.",
        E: "Lithium is for bipolar disorder - no role in panic disorder treatment."
      },
      exam_tip: "For panic disorder, think 'SSRIs Save from Panic' - they're always first-line for long-term management.",
      related_topics: ["panic-disorder", "ssris", "anxiety-pharmacotherapy"]
    }
  },
  {
    id: '0637689f-0d0e-433c-88fc-d00328827d3e',
    order: 64,
    structured: {
      summary: "When a patient on lithium presents with possible toxicity symptoms (tremor, polyuria, thirst), the first step is to check lithium and creatinine levels to assess toxicity and renal function.",
      key_points: [
        "Tremor, polyuria, thirst can indicate lithium toxicity OR side effects at therapeutic levels",
        "Check lithium level to determine if toxic (>1.0 mmol/L concerning, >1.5 mmol/L toxic)",
        "Check creatinine/eGFR because renal impairment affects lithium clearance",
        "Never stop lithium abruptly without assessment - can trigger relapse"
      ],
      clinical_pearl: "Polyuria and thirst suggest nephrogenic diabetes insipidus - a long-term lithium effect. This doesn't require stopping lithium but needs renal function monitoring.",
      why_wrong: {
        A: "Discontinuing immediately without knowing the lithium level could be unnecessary and destabilize the patient.",
        C: "Switching medications without confirming toxicity or understanding the cause is premature.",
        D: "Increasing fluid/salt might help prevent toxicity but isn't appropriate until you know the lithium level.",
        E: "Beta-blockers can treat tremor but don't address the underlying concern of potential toxicity."
      },
      exam_tip: "For lithium side effects/toxicity questions, 'check the level' is almost always the first answer. Investigate before intervening.",
      related_topics: ["lithium-toxicity", "lithium-monitoring", "drug-safety"]
    }
  },
  {
    id: 'd569ac4d-389d-4a10-889b-a38adfede917',
    order: 65,
    structured: {
      summary: "Depression with psychotic features requires combination therapy: an antipsychotic to treat psychosis plus an antidepressant to treat depression. Neither alone is sufficient.",
      key_points: [
        "Psychotic depression: major depression with delusions or hallucinations",
        "Antipsychotic + antidepressant combination is more effective than either alone",
        "Common combinations: SSRI + quetiapine, or SSRI + aripiprazole",
        "ECT is highly effective if medication combination fails"
      ],
      clinical_pearl: "Psychotic depression is often missed - look for mood-congruent delusions (worthlessness, guilt, nihilism) or hallucinations critical of the patient. Always ask about psychotic symptoms in severe depression.",
      why_wrong: {
        A: "SSRI alone won't treat the psychotic features - delusions and hallucinations will persist.",
        B: "SSRI + mood stabilizer doesn't address psychosis; mood stabilizers aren't antipsychotic.",
        C: "Antipsychotic alone may treat psychosis but won't adequately treat the underlying depression.",
        E: "Mood stabilizer alone treats neither the psychosis nor the depression effectively."
      },
      exam_tip: "Depression + psychosis = 'Double treatment needed'. Antipsychotic for psychosis, antidepressant for depression. Both together.",
      related_topics: ["psychotic-depression", "combination-therapy", "severe-depression"]
    }
  },
  {
    id: '1aa5d105-0e65-46c3-b15f-2feb6c78507e',
    order: 66,
    structured: {
      summary: "After SSRI failure in persistent depressive disorder (dysthymia), switching to an SNRI like venlafaxine is appropriate. SNRIs may help patients who don't respond to serotonin-only medications.",
      key_points: [
        "Dysthymia often needs longer treatment trials than major depression",
        "SNRI adds noradrenaline mechanism to serotonin effects",
        "Venlafaxine and duloxetine are the main SNRIs",
        "Consider augmentation strategies if SNRI also fails"
      ],
      clinical_pearl: "Venlafaxine at doses below 150mg acts mainly as an SSRI. The noradrenergic effect becomes significant above 150mg - ensure adequate dosing before declaring treatment failure.",
      why_wrong: {
        A: "Lorazepam is a benzodiazepine - treats anxiety short-term, not depression.",
        B: "Amitriptyline (TCA) is an option but has worse side effect profile - typically third-line.",
        C: "Quetiapine is used for augmentation, not as next-line monotherapy for depression.",
        E: "Lithium is for bipolar disorder and may be used to augment antidepressants, but not as standalone for unipolar depression."
      },
      exam_tip: "SSRI failure → SNRI is the standard next step. Remember venlafaxine needs doses >150mg for full dual action.",
      related_topics: ["dysthymia", "snris", "treatment-resistant-depression"]
    }
  },
  {
    id: 'c9e1a538-5238-4bff-a43a-15f283146305',
    order: 67,
    structured: {
      summary: "Lithium is first-line treatment for acute mania in bipolar I disorder due to its proven mood-stabilizing effects. Antidepressants are contraindicated as they can trigger or worsen mania.",
      key_points: [
        "Lithium: gold standard for acute mania and maintenance in bipolar disorder",
        "Often combined with antipsychotic for faster symptom control",
        "Takes 7-14 days for full antimanic effect",
        "Antidepressants can trigger 'switching' to mania - avoid in manic episodes"
      ],
      clinical_pearl: "Valproate works faster than lithium in acute mania (days vs weeks). In severe mania requiring rapid control, consider valproate or antipsychotics initially, adding lithium for maintenance.",
      why_wrong: {
        A: "Lamotrigine is for bipolar DEPRESSION prevention - ineffective for acute mania.",
        B: "Fluoxetine (SSRI) can trigger or worsen mania - contraindicated in acute mania.",
        D: "Escitalopram (SSRI) same as fluoxetine - can worsen mania.",
        E: "Amitriptyline (TCA) has highest risk of triggering mania - absolutely contraindicated."
      },
      exam_tip: "For acute mania, think 'Lithium + Antipsychotic'. Never antidepressants. Lamotrigine is for depression, not mania.",
      related_topics: ["acute-mania", "lithium", "bipolar-disorder"]
    }
  },
  {
    id: 'f0236323-7c87-4f17-817f-7275bc3e6fd9',
    order: 68,
    structured: {
      summary: "The number of previous depressive episodes is the most important factor in deciding on long-term antidepressant therapy. More episodes = higher relapse risk = longer treatment needed.",
      key_points: [
        "3+ episodes: strong indication for long-term (2+ years) or indefinite treatment",
        "Each episode increases risk of future episodes",
        "Other factors: severity, residual symptoms, speed of relapse after stopping",
        "Discuss with patient - adherence is crucial for prevention"
      ],
      clinical_pearl: "After the third episode, relapse risk approaches 90% over lifetime. At this point, many patients benefit from viewing antidepressants like blood pressure medication - long-term management, not a cure.",
      why_wrong: {
        A: "Initial severity matters but doesn't predict recurrence as strongly as episode history.",
        C: "Side effects affect tolerability but shouldn't determine treatment duration for prevention.",
        D: "Patient preference is important but medical factors (recurrence risk) guide the recommendation.",
        E: "Age at first episode is a factor but less predictive than number of episodes."
      },
      exam_tip: "For 'factors in long-term treatment' questions, number of previous episodes is usually the key answer. Think 'History predicts future'.",
      related_topics: ["depression-recurrence", "maintenance-therapy", "treatment-duration"]
    }
  },
  {
    id: '0be71167-29ce-4d58-b0ae-4741b1baadef',
    order: 69,
    structured: {
      summary: "Sertraline is the preferred SSRI in pregnancy due to the most reassuring safety data. It has the lowest placental transfer and most established track record.",
      key_points: [
        "Sertraline: most evidence for safety in pregnancy among SSRIs",
        "Low placental transfer reduces fetal exposure",
        "Untreated depression in pregnancy also carries risks (preterm birth, low birthweight)",
        "Discuss benefits vs risks - stopping may not be the safest option"
      ],
      clinical_pearl: "Don't automatically stop antidepressants in pregnancy. Untreated depression increases preeclampsia risk, preterm birth, and postnatal depression. The decision requires balancing risks.",
      why_wrong: {
        A: "Amitriptyline (TCA) has more concerning data in pregnancy and higher overdose risk.",
        C: "Citalopram has less safety data in pregnancy and QT prolongation concerns at higher doses.",
        D: "Duloxetine (SNRI) has less pregnancy safety data than sertraline.",
        E: "Mirtazapine has limited pregnancy data compared to sertraline."
      },
      exam_tip: "For pregnancy + antidepressants, sertraline is the standard answer. Remember to consider that untreated depression also carries risks.",
      related_topics: ["pregnancy-prescribing", "sertraline", "depression-in-pregnancy"]
    }
  },
  {
    id: '97a47fba-dcc4-48f1-acac-0619997ca72a',
    order: 70,
    structured: {
      summary: "NSAIDs like ibuprofen reduce renal lithium clearance, causing lithium levels to rise and increasing toxicity risk. This is a critical drug interaction requiring monitoring.",
      key_points: [
        "NSAIDs reduce prostaglandin-mediated renal blood flow, decreasing lithium excretion",
        "Lithium levels can increase 25-60% with regular NSAID use",
        "Ibuprofen, naproxen, diclofenac all interact; COX-2 inhibitors too",
        "Paracetamol is safe alternative for pain in lithium patients"
      ],
      clinical_pearl: "Even OTC ibuprofen can cause lithium toxicity. Always ask patients on lithium about pain medication use, and educate them about this interaction at every opportunity.",
      why_wrong: {
        A: "Paracetamol doesn't affect lithium levels - safe to use.",
        C: "Loratadine (antihistamine) doesn't interact with lithium.",
        D: "Prednisolone (corticosteroid) doesn't significantly affect lithium levels.",
        E: "Amoxicillin doesn't interact with lithium."
      },
      exam_tip: "Lithium + NSAIDs = toxicity risk. This is one of the most commonly tested drug interactions. 'If patient on Lithium needs pain relief, think Paracetamol'.",
      related_topics: ["lithium-interactions", "nsaid-interactions", "drug-safety"]
    }
  },
  {
    id: 'f8708315-9fef-4498-8ebd-f45d745bb121',
    order: 71,
    structured: {
      summary: "Olanzapine carries the highest metabolic syndrome risk among common antipsychotics, causing significant weight gain, dyslipidemia, and diabetes. Clozapine has similar risk but is reserved for treatment-resistant cases.",
      key_points: [
        "Olanzapine can cause 7-10kg weight gain in first year",
        "Mechanism: H1 and 5-HT2C blockade increases appetite; insulin resistance",
        "Risk ranking: olanzapine > quetiapine > risperidone > aripiprazole",
        "Monitor weight, glucose, and lipids regularly"
      ],
      clinical_pearl: "If olanzapine is the most effective antipsychotic for a patient, don't avoid it - but implement metabolic monitoring and lifestyle interventions from day one. Consider metformin early if weight gain occurs.",
      why_wrong: {
        A: "Aripiprazole has the lowest metabolic risk - often chosen to minimize weight gain.",
        B: "Haloperidol (typical) has low metabolic risk - main concerns are EPS and tardive dyskinesia.",
        D: "Risperidone has moderate risk - less than olanzapine but more than aripiprazole.",
        E: "Quetiapine has moderate risk - concerning but less than olanzapine."
      },
      exam_tip: "For 'highest metabolic risk' questions, Olanzapine is always the answer among common options. For 'lowest risk', think Aripiprazole.",
      related_topics: ["olanzapine", "metabolic-monitoring", "antipsychotic-side-effects"]
    }
  },
  {
    id: '4894494c-2ecb-47dc-bdff-1ba919ee7a6c',
    order: 72,
    structured: {
      summary: "Metformin requires dose adjustment in renal impairment because it's renally excreted and accumulates in kidney disease, increasing the risk of lactic acidosis - a rare but potentially fatal complication.",
      key_points: [
        "Metformin: contraindicated if eGFR <30; reduce dose at 30-45",
        "Lactic acidosis risk increases with renal impairment and hypoxia",
        "Check eGFR before starting and at least annually",
        "Hold metformin before contrast procedures or surgery"
      ],
      clinical_pearl: "Metformin-associated lactic acidosis is rare (~5/100,000 patient-years) but has 50% mortality. The risk increases dramatically when eGFR falls below 30. Always check renal function before prescribing.",
      why_wrong: {
        B: "Aspirin is metabolized hepatically and doesn't require specific renal dose adjustments.",
        C: "Amoxicillin may need adjustment in severe renal impairment but less critical than metformin.",
        D: "Atorvastatin is hepatically metabolized - no renal dose adjustment required.",
        E: "Amlodipine is hepatically metabolized - no renal dose adjustment needed."
      },
      exam_tip: "Metformin + renal impairment = lactic acidosis risk. Know the eGFR thresholds: stop at <30, reduce at 30-45, monitor at 45-60.",
      related_topics: ["metformin-safety", "renal-dosing", "lactic-acidosis"]
    }
  },
  {
    id: '2c8384ce-199e-4388-b705-9648d1d105a3',
    order: 73,
    structured: {
      summary: "Trazodone is an effective add-on for insomnia in patients on SSRIs. Its sedating properties help sleep without the dependence risk of benzodiazepines or Z-drugs.",
      key_points: [
        "Trazodone: antidepressant with strong sedating effects at low doses (25-100mg)",
        "Works via 5-HT2A antagonism and H1 blockade",
        "No dependence potential unlike benzodiazepines/Z-drugs",
        "Also has mild antidepressant effect that complements SSRI"
      ],
      clinical_pearl: "Trazodone at low doses (25-50mg) is sedating but has minimal antidepressant effect. This makes it useful as a 'pure' sleep aid that won't interfere with primary antidepressant dosing.",
      why_wrong: {
        A: "Diazepam causes dependence with long-term use - not appropriate for chronic insomnia.",
        C: "Zolpidem is an option but doesn't address the underlying anxiety and has dependence risk.",
        D: "Buspirone is non-sedating - used for anxiety, not insomnia.",
        E: "Venlafaxine is activating and would likely worsen insomnia."
      },
      exam_tip: "For insomnia + depression/anxiety, trazodone is often the best add-on. It's sedating, non-addictive, and complements SSRIs.",
      related_topics: ["trazodone", "insomnia-management", "gad-treatment"]
    }
  },
  {
    id: '0bba3200-7216-47d3-b0ed-2369aaefef12',
    order: 74,
    structured: {
      summary: "Lamotrigine is first-line for preventing bipolar depression because it's specifically effective against depressive episodes with minimal risk of triggering mania.",
      key_points: [
        "Lamotrigine prevents depressive relapses more than manic relapses",
        "Slow titration required (risk of Stevens-Johnson syndrome)",
        "Not effective for acute mania - don't use during manic episodes",
        "Can be combined with lithium for patients with both poles"
      ],
      clinical_pearl: "Lamotrigine is one of the few mood stabilizers that doesn't cause weight gain. This makes it particularly useful in young patients and those concerned about metabolic effects.",
      why_wrong: {
        A: "Lithium is more effective for mania prevention; has modest effect on depression.",
        C: "Olanzapine can treat bipolar depression but is not first-line due to metabolic effects.",
        D: "Valproate is better for mania prevention than depression.",
        E: "Quetiapine can treat bipolar depression but is second-line due to metabolic effects."
      },
      exam_tip: "Bipolar depression prevention = Lamotrigine. Mania prevention = Lithium/Valproate. Remember which pole each medication protects against.",
      related_topics: ["lamotrigine", "bipolar-depression", "mood-stabilizers"]
    }
  },
  {
    id: '364db7c0-3cf1-423a-8fdc-d62076f9817c',
    order: 75,
    structured: {
      summary: "For mild, first-episode depression, psychological therapy (especially CBT) is recommended before medication. SSRIs are reserved for moderate-severe depression or when therapy is ineffective.",
      key_points: [
        "Mild depression: low-intensity psychological interventions first",
        "Options: CBT, guided self-help, exercise, computerized CBT",
        "Medication considered if: symptoms persist 2+ weeks, moderate/severe, patient preference",
        "Antidepressants and therapy together are most effective for moderate-severe depression"
      ],
      clinical_pearl: "The stepped-care model for depression: Step 1 (mild) = watchful waiting, psychoeducation; Step 2 = low-intensity psychological interventions; Step 3 = medication + high-intensity therapy; Step 4 = specialist care.",
      why_wrong: {
        A: "SSRIs are not first-line for MILD depression - therapy is preferred initially.",
        C: "Benzodiazepines don't treat depression and shouldn't be used this way.",
        D: "Atypical antipsychotics are not indicated for mild depression.",
        E: "Lifestyle changes alone are insufficient as sole treatment - need structured therapy."
      },
      exam_tip: "For MILD depression, CBT first. For MODERATE-SEVERE, medication + CBT. The severity determines the starting point.",
      related_topics: ["mild-depression", "stepped-care", "cbt"]
    }
  },
  {
    id: '83a5cd6b-b621-444d-85d6-47fefb9b9f05',
    order: 76,
    structured: {
      summary: "Bradycardia is NOT a feature of serotonin syndrome - the opposite (tachycardia) is expected. Serotonin syndrome causes autonomic hyperactivation with fast heart rate, high blood pressure, and hyperthermia.",
      key_points: [
        "Serotonin syndrome: autonomic instability, neuromuscular hyperactivity, altered mental status",
        "Cardiovascular: tachycardia, hypertension - NOT bradycardia",
        "Neuromuscular: tremor, myoclonus, hyperreflexia, clonus",
        "Can be life-threatening; requires immediate cessation of serotonergic drugs"
      ],
      clinical_pearl: "Remember serotonin syndrome by thinking 'everything is turned UP': temperature up, heart rate up, blood pressure up, reflexes up, muscle activity up.",
      why_wrong: {
        A: "Hypertension IS a typical feature of serotonin syndrome.",
        B: "Agitation IS a typical feature - reflects CNS serotonin excess.",
        C: "Myoclonus (muscle jerks) IS characteristic of serotonin syndrome.",
        D: "Hyperreflexia IS a key feature - helps differentiate from NMS."
      },
      exam_tip: "Serotonin syndrome = 'Speedy Syndrome'. Everything is hyperactive. If you see bradycardia or hyporeflexia in the options, those are NOT features.",
      related_topics: ["serotonin-syndrome", "drug-toxicity", "ssri-complications"]
    }
  },
  {
    id: '735bfdb8-48fc-46b2-9a71-d9d336239154',
    order: 77,
    structured: {
      summary: "SSRIs are the recommended medication class for long-term management of panic disorder due to proven efficacy, safety, and low dependence risk compared to benzodiazepines.",
      key_points: [
        "SSRIs: first-line for long-term panic disorder management",
        "Takes 2-4 weeks for benefit; may initially worsen symptoms",
        "Effective options: paroxetine, sertraline, fluoxetine, escitalopram",
        "Benzodiazepines only for short-term bridging while SSRI takes effect"
      ],
      clinical_pearl: "If a patient has been on a benzodiazepine for panic disorder long-term, work on gradual tapering while optimizing SSRI therapy. The transition can take months but reduces long-term risks.",
      why_wrong: {
        B: "TCAs (like clomipramine) are effective but have worse side effect profile - second-line.",
        C: "Benzodiazepines cause dependence, tolerance, and withdrawal - only for short-term use.",
        D: "Atypical antipsychotics are not standard treatment for panic disorder.",
        E: "Z-drugs (zolpidem) are for insomnia, not anxiety disorders."
      },
      exam_tip: "Long-term panic disorder = SSRIs. Benzodiazepines are 'bridges, not buildings' - short-term only.",
      related_topics: ["panic-disorder", "long-term-management", "ssris"]
    }
  },
  {
    id: 'aa7fade2-fd22-4f99-b308-611dd0de990e',
    order: 78,
    structured: {
      summary: "After two failed SSRI trials for depression, switching to an SNRI is the recommended next step. SNRIs work on both serotonin and noradrenaline, potentially helping patients who don't respond to serotonin-only medications.",
      key_points: [
        "Treatment-resistant depression: failure to respond to 2+ adequate antidepressant trials",
        "Switch class before augmentation: SSRI → SNRI",
        "SNRIs: venlafaxine, duloxetine",
        "If SNRI fails: augmentation (lithium, atypical antipsychotic) or TCA"
      ],
      clinical_pearl: "Before declaring SSRI failure, verify: adequate dose, adequate duration (6-8 weeks at therapeutic dose), good adherence. Many 'failures' are actually suboptimal trials.",
      why_wrong: {
        A: "Increasing the same SSRI dose after no response to adequate trials is unlikely to help.",
        B: "TCAs are typically tried after SNRIs due to worse side effect profile.",
        C: "Benzodiazepines don't treat depression - may help anxiety component but not core symptoms.",
        E: "ECT is reserved for severe, treatment-resistant cases after multiple medication trials."
      },
      exam_tip: "Two SSRIs failed → Switch to SNRI. This is the standard approach before considering augmentation or more intensive treatments.",
      related_topics: ["treatment-resistant-depression", "snris", "antidepressant-switching"]
    }
  },
  {
    id: 'de8d3ed9-3c85-42d9-ad40-8b5b9fe0782d',
    order: 79,
    structured: {
      summary: "Mirtazapine causes the most weight gain among listed antidepressants due to histamine H1 receptor blockade increasing appetite. This can be beneficial in underweight depressed patients.",
      key_points: [
        "Mirtazapine: significant weight gain (average 2-4kg, sometimes much more)",
        "Mechanism: H1 and 5-HT2C antagonism increases appetite and reduces satiety",
        "SSRIs are generally weight-neutral with individual variation",
        "Bupropion may cause weight loss - useful in obesity"
      ],
      clinical_pearl: "Mirtazapine's weight gain effect can be used therapeutically in patients with depression, cancer cachexia, or eating disorders where weight restoration is a goal.",
      why_wrong: {
        A: "Sertraline is relatively weight-neutral.",
        B: "Fluoxetine is weight-neutral and may even cause slight weight loss initially.",
        C: "Escitalopram is weight-neutral.",
        E: "Bupropion is associated with weight loss, not gain."
      },
      exam_tip: "Weight gain antidepressants: Mirtazapine and TCAs. Weight-neutral: SSRIs. Weight loss potential: Bupropion.",
      related_topics: ["mirtazapine", "antidepressant-weight-effects", "side-effect-profiles"]
    }
  },
  {
    id: '399e0961-ca24-48b6-b443-199fa4bcef8b',
    order: 80,
    structured: {
      summary: "Bupropion has the lowest sexual dysfunction rate among antidepressants, making it ideal for patients concerned about this side effect. It's sometimes added to SSRIs specifically to counteract sexual side effects.",
      key_points: [
        "Bupropion: <5% sexual dysfunction rate (vs 25-73% for SSRIs)",
        "Works via noradrenaline and dopamine - doesn't affect serotonin directly",
        "Can be added to SSRIs to counteract sexual side effects",
        "Other low-sexual-dysfunction options: mirtazapine, vortioxetine"
      ],
      clinical_pearl: "Bupropion is contraindicated in patients with seizure disorders, eating disorders (bulimia/anorexia), or those taking drugs that lower seizure threshold. Screen for these before prescribing.",
      why_wrong: {
        A: "Paroxetine has the HIGHEST sexual dysfunction rate among SSRIs.",
        B: "Citalopram, like other SSRIs, causes significant sexual dysfunction.",
        D: "Duloxetine (SNRI) causes sexual dysfunction, though typically less than SSRIs.",
        E: "Amitriptyline (TCA) commonly causes sexual dysfunction."
      },
      exam_tip: "For 'avoid sexual dysfunction', Bupropion is almost always the answer. Remember it's 'Bu-propion, Bu-zzes (energizes), Bu-t no bedroom problems'.",
      related_topics: ["bupropion", "sexual-dysfunction", "antidepressant-selection"]
    }
  }
]

async function main() {
  console.log('Starting batch 4 update (questions 61-80)...')

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

  console.log(`\nBatch 4 complete! Updated: ${updated}, Failed: ${failed}`)
}

main()
