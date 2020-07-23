declare const engine: {
    onReady: () => Promise<typeof import("./main").default>;
};
export default engine;
