import { useEffect } from 'react';
import { Subject, Subscription } from './createSubject';

interface useSubscribeProps {
  disabled?: boolean;
  subject: Subject;
  callback: () => void;
}

export const useSubscribe = (props: useSubscribeProps) => {
  useEffect(() => {
    const tearDown = (subscription: Subscription | false) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };

    const subscription =
      !props.disabled &&
      props.subject.subscribe({
        next: props.callback,
      });

    return () => tearDown(subscription);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.disabled]);
};

export default useSubscribe;
