import { inspect } from 'util';

export function peek<T>(messages: T): void {
  console.log(inspect(messages, false, 5, true));
}
