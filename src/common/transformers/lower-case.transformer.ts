import { Transform } from 'class-transformer';

export function ToLowerCase() {
  return Transform(({ value }) => value.toLowerCase());
}
