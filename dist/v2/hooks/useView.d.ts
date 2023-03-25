import { IDefaultProp, ISchemaViewCore } from "../types";
import { IForm } from "../logic/createForm";
export declare const useView: <TSchema extends ISchemaViewCore>(props: {
    form?: any;
    schema: TSchema;
    log?: (() => void) | undefined;
}) => {
    state: {
        value: any;
        propsState: TSchema["propStateType"] & IDefaultProp;
    };
    data: any;
    form: IForm<import("../types").INativeSchema> | IForm<TSchema>;
};
export default useView;
