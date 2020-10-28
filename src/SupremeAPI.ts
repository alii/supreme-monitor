import { AllProducts, DetailedProduct, Product } from './types';
import fetch, { RequestInit } from 'node-fetch';
import { CookieJar } from 'tough-cookie';

export const base_url: string = 'https://www.supremenewyork.com';

export type Service = 'shop' | 'mobile_stock';

export class SupremeAPI {
  private readonly jar = new CookieJar();

  constructor(private readonly service: Service) {}

  async getAllProducts(): Promise<DetailedProduct[]> {
    const request = await fetch(this.getEndpoint(), this.requestOptions());
    await this.munch(request.headers.get('set-cookie'));

    const { products_and_categories } = (await request.json()) as AllProducts;
    const products: Product[] = Object.values(products_and_categories).flat();

    return products.reduce(async (_all, product) => {
      const all = await _all;
      const withStyles = await this.getProduct(product.id);
      return [...all, { ...product, ...withStyles }];
    }, Promise.resolve([]) as Promise<DetailedProduct[]>);
  }

  async getProduct(productId: Product['id']): Promise<DetailedProduct> {
    const url = `${base_url}/shop/${productId}.json`;
    const request = await fetch(url, this.requestOptions());
    await this.munch(request.headers.get('set-cookie'));
    return request.json();
  }

  private requestOptions(): RequestInit {
    return {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,la;q=0.7',
        'cache-control': 'max-age=0',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        cookie: this.jar.getCookieStringSync(base_url),
      },
      method: 'GET',
    };
  }

  private getEndpoint() {
    switch (this.service) {
      case 'mobile_stock':
        return `${base_url}/mobile_stock.json`;
      case 'shop':
        return `${base_url}/shop.json`;
      default:
        return `${base_url}/mobile_stock.json`;
    }
  }

  /** munch on a cookie and store it in the jar */
  private munch(cookie: string | null) {
    if (cookie) {
      return this.jar.setCookie(cookie, base_url);
    }
  }
}
