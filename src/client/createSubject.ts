type Noop = () => void;

export type Observer = {
  next: () => void;
};

export type Subscription = {
  unsubscribe: Noop;
};

export type Subject = {
  readonly observers: Observer[];
  subscribe: (value: Observer) => Subscription;
  unsubscribe: Noop;
} & Observer;

export default function createSubject(): Subject {
  let _observers: Observer[] = [];

  const next = () => {
    for (const observer of _observers) {
      observer.next();
    }
  };

  const subscribe = (observer: Observer): Subscription => {
    _observers.push(observer);
    return {
      unsubscribe: () => {
        _observers = _observers.filter((o) => o !== observer);
      },
    };
  };

  const unsubscribe = () => {
    _observers = [];
  };

  return {
    get observers() {
      return _observers;
    },
    next,
    subscribe,
    unsubscribe,
  };
}
