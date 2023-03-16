import React, { FC } from 'react';
import { SchemaField } from './types';
import { Form } from './logic/createForm';
interface IFormRegisterContext {
    listSubmit: any[];
    addListSubmit: (callback: any) => void;
    removeListSubmit: (callback: any) => void;
    validateListSubmit: () => Promise<any>;
    order: 'before' | 'after';
}
export declare const SumbitMiddlewareContext: React.Context<IFormRegisterContext>;
export declare const SumbitMiddlewareContextProvider: FC<{
    children: any;
} & Pick<IFormRegisterContext, 'order'>>;
interface IUserRegisterProps {
    handleSubmit: any;
}
export declare const useSubmitMiddleware: (props: IUserRegisterProps) => void;
export declare function withSubmitMiddleware<T extends object>(Child: React.ComponentType<T>, config: Pick<IFormRegisterContext, 'order'>): {
    (props: T): JSX.Element;
    displayName: string;
};
export declare const resolverMiddleware: ({ resolver, form }: {
    resolver: any;
    form: Form;
}) => any;
export declare function FormSyncReactHookForm({ action, config, form, }: {
    action: any;
    config: SchemaField;
    form: Form;
}): JSX.Element;
export default useSubmitMiddleware;
