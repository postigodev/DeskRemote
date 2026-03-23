declare module "lucide" {
  export const icons: Record<string, unknown>;
  export function createIcons(options?: {
    icons?: Record<string, unknown>;
    attrs?: Record<string, string>;
    nameAttr?: string;
    iconNodeAttr?: string;
  }): void;
}
