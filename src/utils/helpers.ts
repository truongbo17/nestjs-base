export default function wrapArray(value: any | any[]): any[] {
  return Array.isArray(value) ? value : [value];
}
