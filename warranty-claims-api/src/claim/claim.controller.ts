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
import { ClaimService } from './claim.service';
import { Claim } from './schema/claim.schema';
import { ClaimDto } from './dto/claim.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('claims')
@UseGuards(RolesGuard)
export class ClaimController {
  constructor(private claimService: ClaimService) {}

  //get all claims
  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('staff')
  async findAllClaim() {
    try {
      return this.claimService.findAllClaim();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error:
            'Could not retrieve claims at this time. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //get a claim by id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('staff')
  async getClaimByID(
    @Param('id')
    id: string,
  ): Promise<Claim> {
    try {
      return this.claimService.findOneClaimByID(id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error:
            'Could not retrieve claim at this time. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //create a new claim
  @Post()
  @UseGuards(JwtAuthGuard)
  async createClaim(
    @Body()
    claim: ClaimDto,
  ): Promise<Claim> {
    try {
      return this.claimService.createClaim(claim);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Could not create claim at this time. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //update a claim by id
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('staff')
  async updateClaim(
    @Param('id')
    id: string,
    @Body()
    claim: ClaimDto,
  ): Promise<Claim> {
    try {
      return this.claimService.findOneClaimByIdAndUpdate(id, claim);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Could not update claim at this time. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //delete a claim by id
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('staff')
  async deleteClaim(
    @Param('id')
    id: string,
  ): Promise<Claim> {
    try {
      return this.claimService.deleteClaimById(id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Could not delete claim at this time. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
