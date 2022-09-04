// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const transform: Record<string, any> = {
  STRING: (value: any) => value || '',
  NUMBER: (value: any) => {
    const result = parseInt(value);
    return result || 0;
  },
};
