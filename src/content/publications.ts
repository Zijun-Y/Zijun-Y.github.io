// Single source of truth for publications — consumed by the homepage,
// /publications, and the web CV (/cv). Keep tex/cv.tex in sync by hand.

export interface Author {
    name: string;
    self?: boolean;
    coFirst?: boolean;
}

export type PubStatus = 'accepted' | 'workshop' | 'submitted' | 'preprint';

export interface Explainer {
    problem: string;
    why: string;
    contribution: string;
}

export interface Publication {
    year: number;
    venue: string; // short label, e.g. "NeurIPS"
    venueLong: string; // full name, used in tooltips and the CV
    presentation?: string; // e.g. "Poster, Atlanta"
    title: string;
    authors: Author[];
    tags: string[];
    status: PubStatus;
    featured?: number; // homepage rank (1 = first); omit = publications page only
    explainer?: Explainer;
    links: {
        paper?: string;
        arxiv?: string;
        code?: string;
        openreview?: string;
    };
}

export const statusLabel: Record<PubStatus, string> = {
    accepted: 'Accepted',
    workshop: 'Workshop',
    submitted: 'Under review',
    preprint: 'Preprint',
};

export const publications: Publication[] = [
    {
        year: 2026,
        venue: 'NeurIPS',
        venueLong: 'Conference on Neural Information Processing Systems (NeurIPS)',
        presentation: 'Poster, Sydney, Australia',
        title: 'Pause and Reflect: Conformal Aggregation for Chain-of-Thought Reasoning',
        authors: [
            { name: 'Yu Gu', coFirst: true },
            { name: 'Zijun Yu', coFirst: true, self: true },
            { name: 'Vahid Partovi Nia' },
            { name: 'Masoud Asgharian' },
        ],
        tags: ['Conformal Prediction', 'LLM Reasoning'],
        status: 'accepted',
        featured: 1,
        explainer: {
            problem:
                'Language models that reason step by step are often sampled several times, with the most common final answer taken as the response. That majority vote always produces an answer, but it gives no reliable signal for when that answer is likely to be wrong.',
            why:
                'In settings like tutoring, analysis or decision support, a confident wrong answer is often worse than an honest “I’m not sure.” Knowing when to abstain matters as much as accuracy.',
            contribution:
                'We replace majority voting with a weighted aggregation of scores across reasoning paths, then use conformal risk control to set an abstention threshold with a finite-sample guarantee on how often the system answers confidently and wrongly. It runs at inference time, with no retraining. On GSM8K it reaches 90.1% accuracy on the questions it answers while abstaining on fewer than 5%, compared with 82% for majority voting.',
        },
        links: { arxiv: 'https://arxiv.org/abs/2605.14098' },
    },
    {
        year: 2026,
        venue: 'NeurIPS',
        venueLong: 'Conference on Neural Information Processing Systems (NeurIPS)',
        presentation: 'Poster, Atlanta, USA',
        title: 'Severity-Controlled Prediction Sets for Medication Recommendation',
        authors: [
            { name: 'Yu Gu', coFirst: true },
            { name: 'Zijun Yu', coFirst: true, self: true },
            { name: 'Chi-Kuang Yeh' },
            { name: 'Xinyu Wang' },
            { name: 'Ziyang Song' },
        ],
        tags: ['Conformal Prediction', 'Healthcare'],
        status: 'accepted',
        explainer: {
            problem:
                'Medication recommendation predicts a set of drugs for each patient. Existing ways of evaluating and calibrating these prediction sets count only exact matches, so every missed medication is treated as equally bad.',
            why:
                'Mistakes are not all alike. Missing a drug but recommending a therapeutically close one is far less serious than matching it only with distant drugs, and a guarantee that ignores this difference says little about clinical risk.',
            contribution:
                'We introduce Conformal Severity Control (CSC), a post-hoc framework that uses the Anatomical Therapeutic Chemical (ATC) drug hierarchy to measure how severe each mismatch is, and calibrates prediction sets to control that severity per patient without retraining the model. It can control either average severity or the upper tail of the most severe mismatches. On MIMIC-IV, CSC tracks user-specified severity tolerances and shifts prediction sets away from distant mismatches toward exact or close matches.',
        },
        links: {},
    },
    {
        year: 2026,
        venue: 'ICML',
        venueLong: 'International Conference on Machine Learning (ICML)',
        presentation: 'Poster, Seoul, South Korea',
        title: 'Beyond Procedure: Substantive Fairness in Conformal Prediction',
        authors: [
            { name: 'Pengqi Liu', coFirst: true },
            { name: 'Zijun Yu', coFirst: true, self: true },
            { name: 'Mouloud Belbahri' },
            { name: 'Arthur Charpentier' },
            { name: 'Masoud Asgharian' },
            { name: 'Jesse C. Cresswell' },
        ],
        tags: ['Conformal Prediction', 'Fairness'],
        status: 'accepted',
        featured: 2,
        explainer: {
            problem:
                'Conformal prediction turns a model’s output into a set of plausible answers that contains the truth with a guaranteed probability. Work on fairness in conformal prediction has mostly asked whether that guarantee holds equally across groups — a property of the procedure.',
            why:
                'Prediction sets are increasingly handed to people, or to language models, who make the final decision. Equal guarantees on paper do not necessarily translate into equal outcomes for the people affected.',
            contribution:
                'We study fairness across the whole decision pipeline rather than the conformal step alone. We derive an upper bound on disparities in prediction-set size and introduce an LLM-in-the-loop evaluator to measure the fairness of downstream decisions. Empirically, equalizing set sizes tracks fairer outcomes more closely than equalizing coverage, and label-clustered conformal prediction often strikes a good balance between usefulness and fairness.',
        },
        links: {
            arxiv: 'https://arxiv.org/abs/2602.16794',
            code: 'https://github.com/layer6ai-labs/llm-in-the-loop-conformal-fairness',
        },
    },
    {
        year: 2026,
        venue: 'NeurIPS',
        venueLong: 'NeurIPS Workshop on SLMs for Agentic Systems (SLM-Agents)',
        presentation: 'Paris, France',
        title: 'G-CARB: Graph-Localized Conformal Agent Risk Budget for Compositional Harm',
        authors: [
            { name: 'Zijun Yu', coFirst: true, self: true },
            { name: 'Yu Gu', coFirst: true },
            { name: 'Vahid Partovi Nia' },
            { name: 'Masoud Asgharian' },
        ],
        tags: ['Conformal Prediction', 'Agent Safety'],
        status: 'workshop',
        featured: 3,
        explainer: {
            problem:
                'AI agents act over many steps, and harm can come from a combination of steps that each look harmless — reading private data, then sending a message outside. Deciding when to stop an agent means judging its history, but scoring the entire history is costly and dilutes the signal.',
            why:
                'Small language model agents are increasingly run autonomously. Stopping too late lets harm through; stopping too early throws away useful work.',
            contribution:
                'We propose CARB, a conformal risk budget that decides when to stop an agent based on a ledger of harm incurred before stopping. G-CARB scores only the private-source evidence connected to an outgoing action. On AgentDojo replays with two 14B models, it roughly halves the scorer’s input at intermediate budgets while improving task completion over scoring the full history. Random context of the same size gives similar aggregate gains; controlled examples show where keeping the relevant dependency avoids stopping benign work.',
        },
        links: { arxiv: 'https://arxiv.org/abs/2610.05563' },
    },
    {
        year: 2026,
        venue: 'In submission',
        venueLong: 'Submitted — under review',
        title: 'Conformal Prediction under Partial Verification',
        authors: [
            { name: 'Zijun Yu', coFirst: true, self: true },
            { name: 'Yu Gu', coFirst: true },
            { name: 'Vahid Partovi Nia' },
            { name: 'Masoud Asgharian' },
        ],
        tags: ['Conformal Prediction', 'Verification'],
        status: 'submitted',
        explainer: {
            problem:
                'Conformal prediction needs a set of labelled calibration examples. For language-model tasks, a “label” often means verifying an output — checking a retrieved document, grading a math solution, running a configuration — and that verification is expensive.',
            why:
                'Verification cost limits where statistical guarantees can be used in practice. If every calibration example must be fully checked, guarantees become a luxury.',
            contribution:
                'We show that full verification is often unnecessary. We define calibration certificates — the minimal verified information needed to fix the conformal threshold — and a procedure that coordinates verification across calibration examples. It returns exactly the same prediction sets as complete verification, so the guarantee is unchanged, while cutting verification cost by 15–82% compared with verifying examples one at a time across retrieval, math-solution and configuration-evaluation tasks.',
        },
        links: { arxiv: 'https://arxiv.org/abs/2610.10829' },
    },
];

export const featuredPublications = publications
    .filter((p) => p.featured !== undefined)
    .sort((a, b) => a.featured! - b.featured!);
