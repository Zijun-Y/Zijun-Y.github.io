export interface Section {
    id: string;
    title: string;
    description?: string;
    items: {
        title: string;
        subtitle?: string;
        description?: string;
        href?: string;
        status?: "active" | "coming-soon";
    }[];
}

export const sections: Section[] = [
    {
        id: "conformal-prediction",
        title: "Conformal Prediction",
        description:
            "Uncertainty quantification with finite-sample guarantees.",
        items: [
            {
                title: "Work in progress",
                // subtitle: "Group-conditional coverage",
                // description:
                // "Methods for coverage guarantees across sensitive groups.",
                status: "coming-soon",
            },
            {
                title: "Work in progress",
                // subtitle: "Calibration for generative models",
                // description:
                //     "Applying conformal methods to large language models.",
                status: "coming-soon",
            },
        ],
    },
    {
        id: "survival-analysis",
        title: "Survival Analysis",
        description: "Study of censored and biased data.",
        items: [
            {
                title: "Work in progress",
                // subtitle: "Group-conditional coverage",
                // description:
                //     "Methods for coverage guarantees across sensitive groups.",
                status: "coming-soon",
            },
            {
                title: "Work in progress",
                // subtitle: "Calibration for generative models",
                // description:
                //     "Applying conformal methods to large language models.",
                status: "coming-soon",
            },
        ],
    },
];
