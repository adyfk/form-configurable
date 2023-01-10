export const transformToNumber = (value: any, alternativeValue: any = '') => {
  const valueParse = +value;
  if (Number.isNaN(valueParse) || value === '') return alternativeValue;
  return valueParse;
};
