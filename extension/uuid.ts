export function uuid() {
  let unique = 0;
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);
  unique++;
  return random + unique + String(time);
}
