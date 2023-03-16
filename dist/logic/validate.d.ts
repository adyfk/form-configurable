import { Schema } from '../types';
export declare const validate: (schema: Schema[], data: Record<any, any>, extraData?: Record<any, any>) => Record<string, string>;
export default validate;
