declare const createPath: ({ parent, index, child }: {
    parent?: string | undefined;
    index?: string | number | undefined;
    child?: string | undefined;
}) => string;
export default createPath;
