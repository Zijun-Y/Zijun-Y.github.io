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

export interface Presentation {
    format: 'Poster' | 'Workshop';
    location: string; // e.g. "Sydney, Australia"
    date: string; // YYYY-MM, used to mark upcoming entries
    bySelf: boolean; // only self-presented entries are listed on the CV
}

export interface Publication {
    year: number;
    venue: string; // short label, e.g. "NeurIPS"
    venueLong: string; // full name, used in tooltips and the CV
    presentation?: Presentation;
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
        presentation: { format: 'Poster', location: 'Sydney, Australia', date: '2026-12', bySelf: false },
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
                'A common way to get better answers from a reasoning language model is to ask the same question several times and go with the most popular answer. That vote always produces an answer, but agreement alone comes with no guarantee about how often the chosen answer is wrong.',
            why:
                'In tutoring, analysis or decision support, a confident wrong answer is often worse than an honest “I’m not sure.” A system that knows when to hold back is easier to trust.',
            contribution:
                'We give the model a principled way to hold back. Rather than a simple vote, it weighs the evidence across all of its attempts and answers only when that evidence is strong enough, with a statistical guarantee on how often it answers confidently and wrongly. It sits on top of an existing model with no retraining, and needs to abstain on only a small share of questions for the answers it does give to become noticeably more reliable.',
        },
        links: { arxiv: 'https://arxiv.org/abs/2605.14098' },
    },
    {
        year: 2026,
        venue: 'NeurIPS',
        venueLong: 'Conference on Neural Information Processing Systems (NeurIPS)',
        presentation: { format: 'Poster', location: 'Atlanta, USA', date: '2026-12', bySelf: false },
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
                'Medication recommendation systems suggest a set of drugs for each patient. The usual ways of judging and calibrating those suggestions count only exact matches, so every missed drug counts as equally wrong.',
            why:
                'Not all misses are alike. By the standard classification of drugs, suggesting a closely related drug in place of the right one is a nearer miss than suggesting one from an unrelated class — and a reliability guarantee should be able to tell the two apart.',
            contribution:
                'We measure how far each patient’s misses fall within that drug classification, and adjust the suggested sets so that this distance stays within a tolerance the user chooses, with a statistical guarantee over the patient population and no retraining of the underlying model. The suggestions shift toward exact or closely related drugs and away from distant ones.',
        },
        links: {},
    },
    {
        year: 2026,
        venue: 'ICML',
        venueLong: 'International Conference on Machine Learning (ICML)',
        presentation: { format: 'Poster', location: 'Seoul, South Korea', date: '2026-07', bySelf: true },
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
                'Conformal prediction turns a model’s guess into a short list of plausible answers that contains the right one with a guaranteed probability. Fairness work in this area has mostly asked whether that guarantee holds equally for every group.',
            why:
                'These lists are increasingly handed to people, or to language models, who make the final call. A guarantee that is equal on paper does not mean the decisions that follow are equally good for everyone.',
            contribution:
                'We look past the list to the decisions made with it, using language models as stand-in decision makers to measure how fair the outcomes actually are, and back this with theory. The practical finding: keeping the lists similar in size across groups does more for fair outcomes than equalizing the guarantee itself.',
        },
        links: {
            arxiv: 'https://arxiv.org/abs/2602.16794',
            code: 'https://github.com/layer6ai-labs/llm-in-the-loop-conformal-fairness',
        },
    },
    {
        year: 2026,
        venue: 'SLM-Agents @ NeurIPS',
        venueLong: 'NeurIPS Workshop on SLMs for Agentic Systems (SLM-Agents)',
        presentation: { format: 'Workshop', location: 'Paris, France', date: '2026-12', bySelf: true },
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
                'AI agents act in many steps, and harm can come from steps that each look harmless — reading a private file, then sending a message outside. Catching this means looking back over what the agent has done, but reviewing its whole history every time is costly and buries the signal.',
            why:
                'Small language-model agents increasingly run on their own. Stopping too late lets harm through; stopping too early throws away useful work.',
            contribution:
                'We give the agent a risk budget: a rule for when to stop it, with a statistical guarantee on how much harm gets through first. The safety check then looks only at the private information an outgoing action could have drawn on, rather than the entire history, so it reads far less while letting more legitimate work finish. One honest caveat: an equally sized random slice of history helps about as much on average — following the connections pays off in specific cases, where it keeps harmless work from being stopped.',
        },
        links: { arxiv: 'https://arxiv.org/abs/2610.05563' },
    },
    {
        year: 2026,
        venue: 'arXiv',
        venueLong: 'arXiv preprint — under review',
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
                'Conformal prediction needs a batch of examples whose answers have been checked. For language-model tasks, checking is real work — reading a retrieved document, grading a math solution, running a configuration — and it adds up quickly.',
            why:
                'When checking is expensive, statistical guarantees become a luxury, used only where someone can afford to verify everything.',
            contribution:
                'We show that full checking is often unnecessary: partial checks frequently already settle everything the guarantee depends on. The method works out when enough has been verified and which examples to check next, returning exactly the same result as checking everything — so the guarantee is unchanged — at a lower, often much lower, cost.',
        },
        links: { arxiv: 'https://arxiv.org/abs/2610.10829' },
    },
];

export const featuredPublications = publications
    .filter((p) => p.featured !== undefined)
    .sort((a, b) => a.featured! - b.featured!);
