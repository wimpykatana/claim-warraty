import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schema/product.schema';
import { ProductDto } from './dto/product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('products')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  //get all products
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllProduct() {
    try {
      return this.productService.findAllProduct();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error:
            'Could not retrieve products at this time. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //get a product by id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getProductByID(
    @Param('id')
    id: string,
  ): Promise<Product> {
    try {
      return this.productService.findOneProductByID(id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error:
            'Could not retrieve product at this time. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //create a new product
  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('staff')
  async createProduct(
    @Body()
    product: ProductDto,
  ): Promise<Product> {
    try {
      return this.productService.createProduct(product);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error:
            'Could not create product at this time. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //update a product by id
  @Put(':id')
  @Roles('staff')
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() product: ProductDto,
  ): Promise<Product> {
    try {
      return this.productService.findOneProductByIdAndUpdate(id, product);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error:
            'Could not update product at this time. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //delete a product by id
  @Delete(':id')
  @Roles('staff')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') id: string): Promise<Product> {
    try {
      return this.productService.deleteProductById(id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error:
            'Could not delete product at this time. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
