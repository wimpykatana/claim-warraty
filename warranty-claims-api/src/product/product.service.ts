import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Product } from './schema/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private productModel: mongoose.Model<Product>,
  ) {}

  async findAllProduct(): Promise<Product[]> {
    const products = await this.productModel.find();
    return products;
  }

  async createProduct(product: Product): Promise<Product> {
    const res = await this.productModel.create(product);
    return res;
  }

  async findOneProductByID(id: string): Promise<Product> {
    const res = await this.productModel.findById(id);

    if (!res) {
      throw new NotFoundException('Product not found');
    }
    return res;
  }

  async findOneProductByIdAndUpdate(
    id: string,
    product: Product,
  ): Promise<Product> {
    const res = await this.productModel.findByIdAndUpdate(id, product, {
      new: true,
    });
    if (!res) {
      throw new NotFoundException('Product not found');
    }
    return res;
  }

  async deleteProductById(id: string): Promise<Product> {
    const res = await this.productModel.findByIdAndDelete(id);
    if (!res) {
      throw new NotFoundException('Product not found');
    }
    return res;
  }
}
