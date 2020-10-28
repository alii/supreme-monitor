import { Service, SupremeAPI } from './SupremeAPI';
import { DetailedProduct, Size, Style } from './types';
import { EventEmitter } from 'events';

export type RestockData = {
  restocks: Map<Style, Size[]>;
  product: DetailedProduct;
};

export declare interface SupremeMonitor {
  on(event: 'restock', listener: (restockData: RestockData) => unknown): this;

  on(event: 'fetching', listener: () => unknown): this;

  on(event: string, listener: Function): this;

  off(event: 'restock', listener: (restockData: RestockData) => unknown): this;

  off(event: 'fetching', listener: () => unknown): this;

  off(event: string, listener: Function): this;
}

export class SupremeMonitor extends EventEmitter {
  public timeout: NodeJS.Timeout | undefined;
  private readonly supreme: SupremeAPI;
  private readonly monitor_delay: number = 1000;
  private products: DetailedProduct[] = [];

  constructor(service: Service) {
    super();
    this.supreme = new SupremeAPI(service);

    this.supreme.getAllProducts().then((products) => {
      this.products = products;
      this.timeout = setTimeout(() => this.monitor(), this.monitor_delay);
    });
  }

  async monitor() {
    this.emit('fetching');
    const newProducts = await this.supreme.getAllProducts();

    const oldProducts = this.products.reduce((products, product) => {
      return { ...products, [product.id]: product };
    }, {} as Record<DetailedProduct['id'], DetailedProduct>);

    newProducts.forEach((newProduct) => {
      const oldProduct = oldProducts[newProduct.id];
      if (!oldProduct) {
        const restockData: RestockData = {
          product: newProduct,
          restocks: new Map<Style, Size[]>(),
        };

        console.log(newProduct.name);

        newProduct.styles.forEach((style) => restockData.restocks.set(style, style.sizes));

        this.emit('restock', restockData);
      } else {
        const newSizes: RestockData['restocks'] = new Map<Style, Size[]>();

        function push(style: Style, sizes: Size[]) {
          const mergedSizes = [...(newSizes.get(style) ?? []), ...sizes];
          newSizes.set(style, mergedSizes);
        }

        newProduct.styles.forEach((newStyle) => {
          const oldStyle = oldProduct.styles.find((s) => s.id === newStyle.id);

          if (!oldStyle) {
            push(newStyle, newStyle.sizes);
            return;
          }

          newStyle.sizes.forEach((newSize) => {
            const oldSize = oldStyle.sizes.find((s) => s.id === newSize.id);

            if (!oldSize) {
              return push(newStyle, [newSize]);
            }

            if (oldSize.stock_level === 0 && newSize.stock_level === 1) {
              push(newStyle, [newSize]);
            }
          });
        });

        if (newSizes.size > 0) {
          console.log([...newSizes.entries()]);
          this.emit('restock', {
            restocks: newSizes,
            product: newProduct,
          });
        }
      }
    });

    this.products = newProducts;

    setTimeout(() => this.monitor(), this.monitor_delay);
  }
}
