export interface Author {
    name: string;
    self?: boolean;
    coFirst?: boolean;
}

export interface Publication {
    year: number;
    venue: string;
    venueLong: string;
    title: string;
    authors: Author[];
    tags: string[];
    status: 'accepted' | 'preprint' | 'submitted';
    featured?: boolean; // false = publications page only, not landing
    links: {
        paper?: string;
        arxiv?: string;
        code?: string;
        openreview?: string;
    };
}

export const publications: Publication[] = [
    {
        year: 2026,
        venue: 'ICML',
        venueLong: 'International Conference on Machine Learning',
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
        links: { arxiv: 'https://arxiv.org/abs/2602.16794' },
    },
    {
        year: 2026,
        venue: 'In submission',
        venueLong: 'Submitted — preprint available',
        title: 'Pause and Reflect: Conformal Aggregation for Chain-of-Thought Reasoning',
        authors: [
            { name: 'Yu Gu', coFirst: true },
            { name: 'Zijun Yu', coFirst: true, self: true },
            { name: 'Vahid Partovi Nia' },
            { name: 'Masoud Asgharian' },
        ],
        tags: ['Conformal Prediction', 'LLM Reasoning'],
        status: 'submitted',
        links: { arxiv: 'https://arxiv.org/abs/2605.14098' },
    },
    {
        year: 2026,
        venue: 'In submission',
        venueLong: 'Submitted — under review',
        title: 'Severity-Controlled Prediction Sets for Medication Recommendation',
        authors: [
            { name: 'Yu Gu', coFirst: true },
            { name: 'Zijun Yu', coFirst: true, self: true },
            { name: 'Chi-Kuang Yeh' },
            { name: 'Xinyu Wang' },
            { name: 'Ziyang Song' },
        ],
        tags: ['Conformal Prediction', 'Healthcare'],
        status: 'submitted',
        featured: false,
        links: {},
    },
];
