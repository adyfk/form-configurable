/// <reference types="react" />
import type { IForm } from "../logic/createForm";
import { IDefaultProp, ISchemaFieldCore } from "../types";
export declare const useFieldArray: <TSchema extends ISchemaFieldCore>(props: {
    form?: any;
    schema: TSchema;
    log?: (() => void) | undefined;
}) => {
    state: {
        value: any;
        error: any;
        propsState: TSchema["propStateType"] & IDefaultProp;
        fieldState: import("../types").IObject;
    };
    formState: {
        isSubmitting: boolean;
        isSubmitted: boolean;
        isSubmitSuccessful: boolean;
        isValidating: boolean;
    };
    ref: import("react").MutableRefObject<any>;
    form: IForm<any> | IForm<TSchema>;
    data: any;
    onPush: (arg: any) => void;
    onUnshift: (arg: any) => void;
    onReplace: (id: any, arg: any, callbackId: (_item: string) => any) => void;
    onDelete: (id: any, callbackId: (_item: string) => any) => void;
    onClear: () => void;
    onChange: (arg: any) => void;
    onBlur: () => void;
};
export default useFieldArray;
