console.log(Object.getOwnPropertyDescriptor(globalThis, 'fetch'));
console.log(Object.getOwnPropertyDescriptor(globalThis.constructor.prototype, 'fetch') || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(globalThis), 'fetch'));
