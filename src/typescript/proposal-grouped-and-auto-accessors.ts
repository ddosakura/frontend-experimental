export {};

class Person {
  /**
   * @link https://github.com/tc39/proposal-grouped-and-auto-accessors
   * @link https://github.com/rome/tools/pull/3956
   * 
   * TypeScript 4.9 仅实现了 auto-accessors
   * @link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#a-nameauto-accessors-in-classes-auto-accessors-in-classes
   **/
  accessor name: string;
  constructor(name: string) {
      this.name = name;
  }
}
