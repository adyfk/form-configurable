import { useEffect } from 'react';
import { Control, Fields } from './createFormControl';

const useSubscribe = ({
  control,
  callback,
}: {
  control: Control;
  callback: (values: Record<string, any>, _fields: Fields) => any;
}) => {
  useEffect(() => {
    const unsubscribe = control.subscribeWatch(callback);
    return unsubscribe;
  });
};

export default useSubscribe;
