import { TheCatAPI } from "@thatapicompany/thecatapi";

type ApiType = "cat" | "dog";

interface ApiInstance {
  client: TheCatAPI;
  type: ApiType;
}

export class ApiClient {
  private static instance: ApiInstance;

  private static createInstance(type: ApiType): ApiInstance {
    let client: TheCatAPI;
    if (type === "cat") {
      client = new TheCatAPI(import.meta.env.VITE_CAT_API_KEY);
    } else {
      client = new TheCatAPI(import.meta.env.VITE_DOG_API_KEY, {
        host: "https://api.thedogapi.com/v1",
      });
    }
    return { client, type };
  }

  static initClient(type: ApiType) {
    if (!this.instance) {
      this.instance = this.createInstance(type);
    }
  }

  static getClient(): TheCatAPI {
    return this.instance.client;
  }

  static switchInstance(type: ApiType = "cat"): ApiInstance {
    // If the type has changed, create a new instance
    if (this.instance.type !== type) {
      this.instance = this.createInstance(type);
    }

    return this.instance;
  }
}
