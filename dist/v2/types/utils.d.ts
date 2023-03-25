export type EmptyObject = {
    [K in string | number]: never;
};
export type IObject = Record<string, any>;
