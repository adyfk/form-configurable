const createPath = ({ parent, index, child }: { parent?: string; index?: string | number; child?: string }) => `${parent}[${index}].${child}`;

export default createPath;
