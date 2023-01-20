import { init } from 'expressionparser';
import formula from './formula_override';

const parser = init(formula, (term) => term);

export const expressionToValue = (expresssion: string, data?: any) => parser.expressionToValue(expresssion, data);
