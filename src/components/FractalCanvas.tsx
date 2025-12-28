import { useState, useEffect, useRef, useMemo } from "react";

interface Node {
    id: number;
    x: number;
    y: number;
    parent?: number;
}

interface Graph {
    nodes: Node[];
    edges: [number, number][];
}

function debounce(func: () => void, delay: number) {
    let timeout: NodeJS.Timeout | null = null;
    return function () {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(func, delay);
    };
}

export function FractalCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
    const [currentIteration, setCurrentIteration] = useState(3);

    const generateGraph = (
        iterations: number,
        keepExisting: boolean = false,
    ) => {
        setGraph((prev) => {
            if (keepExisting) {
                if (prev.nodes.length === 0 || currentIteration >= 6)
                    return prev;
                let newNodes: Node[] = [...prev.nodes];
                let newEdges: [number, number][] = [...prev.edges];
                let nextId = newNodes.length;

                for (let it = 0; it < iterations; it++) {
                    const nodesToAdd = Math.floor(Math.random() * 3) + 3; // 3-5
                    for (let i = 0; i < nodesToAdd; i++) {
                        let attempts = 0;
                        let x, y;
                        do {
                            const inner = 0.1;
                            const outer = 0.4 + 0.05 * currentIteration;
                            const r = inner + Math.random() * (outer - inner);
                            const angle = Math.random() * 2 * Math.PI;
                            x = 0.5 + r * Math.cos(angle);
                            y = 0.5 + r * Math.sin(angle);
                            x = Math.max(0, Math.min(1, x));
                            y = Math.max(0, Math.min(1, y));
                            attempts++;
                        } while (false); // Only generate once, then adjust if needed

                        // Compute distances to all existing nodes
                        const distances = newNodes
                            .map((n) => {
                                const dx = x! - n.x;
                                const dy = y! - n.y;
                                return {
                                    dist: Math.sqrt(dx * dx + dy * dy),
                                    id: n.id,
                                };
                            })
                            .sort((a, b) => a.dist - b.dist);

                        const dist1 = distances[0]?.dist ?? Infinity;
                        const dist2 = distances[1]?.dist ?? Infinity;
                        const close = 0.05;
                        const far = 0.15;

                        let closest1, closest2;
                        if (distances[0])
                            closest1 = newNodes.find(
                                (n) => n.id === distances[0].id,
                            );
                        if (distances[1])
                            closest2 = newNodes.find(
                                (n) => n.id === distances[1].id,
                            );

                        if (
                            dist1 < close &&
                            dist2 < close &&
                            closest1 &&
                            closest2
                        ) {
                            // Move opposite
                            const avgX = (closest1.x + closest2.x) / 2;
                            const avgY = (closest1.y + closest2.y) / 2;
                            let dx = x! - avgX;
                            let dy = y! - avgY;
                            const d = Math.sqrt(dx * dx + dy * dy);
                            if (d > 0) {
                                dx /= d;
                                dy /= d;
                            }
                            x = x! + dx * 0.1;
                            y = y! + dy * 0.1;
                            x = Math.max(0, Math.min(1, x));
                            y = Math.max(0, Math.min(1, y));
                        }

                        const newNode: Node = {
                            id: nextId,
                            x: x!,
                            y: y!,
                            parent: 0,
                        };
                        newNodes.push(newNode);
                        newEdges.push([0, nextId]);

                        // Fractal trick: with probability, connect to neighbor
                        if (
                            dist1 >= close &&
                            dist1 < far &&
                            Math.random() < 0.3 &&
                            closest1
                        ) {
                            newEdges.push([closest1.id, nextId]);
                        }

                        nextId++;
                    }
                }

                return { nodes: newNodes, edges: newEdges };
            } else {
                // Fresh generation
                const root: Node = { id: 0, x: 0.5, y: 0.5 };
                let newNodes: Node[] = [root];
                let newEdges: [number, number][] = [];
                let nextId = 1;

                for (let it = 1; it <= iterations; it++) {
                    const nodesToAdd = Math.floor(Math.random() * 3) + 3; // 3-5
                    for (let i = 0; i < nodesToAdd; i++) {
                        let attempts = 0;
                        let x, y;
                        do {
                            const inner = 0.1;
                            const outer = 0.4 + 0.05 * it;
                            const r = inner + Math.random() * (outer - inner);
                            const angle = Math.random() * 2 * Math.PI;
                            x = 0.5 + r * Math.cos(angle);
                            y = 0.5 + r * Math.sin(angle);
                            x = Math.max(0, Math.min(1, x));
                            y = Math.max(0, Math.min(1, y));
                            attempts++;
                        } while (false);

                        // Compute distances
                        const distances = newNodes
                            .map((n) => {
                                const dx = x! - n.x;
                                const dy = y! - n.y;
                                return {
                                    dist: Math.sqrt(dx * dx + dy * dy),
                                    id: n.id,
                                };
                            })
                            .sort((a, b) => a.dist - b.dist);

                        const dist1 = distances[0]?.dist ?? Infinity;
                        const dist2 = distances[1]?.dist ?? Infinity;
                        const close = 0.05;
                        const far = 0.15;

                        let closest1, closest2;
                        if (distances[0])
                            closest1 = newNodes.find(
                                (n) => n.id === distances[0].id,
                            );
                        if (distances[1])
                            closest2 = newNodes.find(
                                (n) => n.id === distances[1].id,
                            );

                        if (
                            dist1 < close &&
                            dist2 < close &&
                            closest1 &&
                            closest2
                        ) {
                            const avgX = (closest1.x + closest2.x) / 2;
                            const avgY = (closest1.y + closest2.y) / 2;
                            let dx = x! - avgX;
                            let dy = y! - avgY;
                            const d = Math.sqrt(dx * dx + dy * dy);
                            if (d > 0) {
                                dx /= d;
                                dy /= d;
                            }
                            x = x! + dx * 0.1;
                            y = y! + dy * 0.1;
                            x = Math.max(0, Math.min(1, x));
                            y = Math.max(0, Math.min(1, y));
                        }

                        const newNode: Node = {
                            id: nextId,
                            x: x!,
                            y: y!,
                            parent: 0,
                        };
                        newNodes.push(newNode);
                        newEdges.push([0, nextId]);

                        if (
                            dist1 >= close &&
                            dist1 < far &&
                            Math.random() < 0.3 &&
                            closest1
                        ) {
                            newEdges.push([closest1.id, nextId]);
                        }

                        nextId++;
                    }
                }

                return { nodes: newNodes, edges: newEdges };
            }
        });

        if (keepExisting) {
            setCurrentIteration((prev) => prev + iterations);
        } else {
            setCurrentIteration(iterations);
        }
    };

    useEffect(() => {
        generateGraph(3);
    }, []);

    const debouncedResize = useMemo(
        () => debounce(() => generateGraph(3), 1000),
        [],
    );

    const debouncedAdd = useMemo(
        () =>
            debounce(() => {
                if (currentIteration < 6) {
                    generateGraph(1, true);
                }
            }, 1000),
        [currentIteration],
    );

    useEffect(() => {
        window.addEventListener("resize", debouncedResize);
        window.addEventListener("scroll", debouncedAdd);
        document.addEventListener("click", debouncedAdd);

        return () => {
            window.removeEventListener("resize", debouncedResize);
            window.removeEventListener("scroll", debouncedAdd);
            document.removeEventListener("click", debouncedAdd);
        };
    }, [debouncedResize, debouncedAdd]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw edges (green-blue, thinner, more opacity)
        ctx.strokeStyle = "rgba(0, 200, 200, 0.2)";
        ctx.lineWidth = 0.5;
        for (const [fromId, toId] of graph.edges) {
            const from = graph.nodes.find((n) => n.id === fromId);
            const to = graph.nodes.find((n) => n.id === toId);
            if (from && to) {
                ctx.beginPath();
                ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
                ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
                ctx.stroke();
            }
        }

        // Draw nodes (grey, larger, more opacity)
        ctx.fillStyle = "rgba(128, 128, 128, 0.5)";
        for (const node of graph.nodes) {
            if (node.id === 0) continue; // Skip root for now
            ctx.beginPath();
            ctx.arc(
                node.x * canvas.width,
                node.y * canvas.height,
                3,
                0,
                Math.PI * 2,
            );
            ctx.fill();
        }

        // Root node (violet, larger)
        const root = graph.nodes[0];
        if (root) {
            ctx.fillStyle = "rgba(238, 130, 238, 0.7)";
            ctx.beginPath();
            ctx.arc(
                root.x * canvas.width,
                root.y * canvas.height,
                5,
                0,
                Math.PI * 2,
            );
            ctx.fill();
        }
    }, [graph]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: -1,
                pointerEvents: "none",
            }}
        />
    );
}
