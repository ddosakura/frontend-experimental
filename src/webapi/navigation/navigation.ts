interface NavigationDestination {
  url: string;
}

/** @link https://developer.mozilla.org/en-US/docs/Web/API/NavigateEvent */
export interface NavigateEvent {
  readonly destination: NavigationDestination;

  /** @deprecated */
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  transitionWhile: any;

  readonly canIntercept: boolean;
  intercept(
    options?: Partial<{
      // rome-ignore lint/suspicious/noExplicitAny: <explanation>
      handler: () => any;
    }>,
  ): void;

  readonly navigationType: "push" | "reload" | "replace" | "traverse";
}

/** @link https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API */
export interface Navigation {
  addEventListener(
    NavigateEvent: "navigate",
    handler: (ev: NavigateEvent) => void,
  ): void;
  removeEventListener(
    NavigateEvent: "navigate",
    handler?: (ev: NavigateEvent) => void,
  ): void;
}
