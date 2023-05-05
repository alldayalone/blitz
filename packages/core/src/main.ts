declare global {
  interface Array<T> {
    findLastIndex(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      thisArg?: any
    ): number
  }
}

export * from './repo';
export * from './daoState';
export * from './vote-provider';
