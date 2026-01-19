// Cat api types derived from /@thatapicompany/thecatapi/dist/index.d.ts

export interface Image {
  id: string;
  width: number;
  height: number;
  url: string;
  breeds?: Record<string, any>[];
  categories?: Record<string, any>[];
}
