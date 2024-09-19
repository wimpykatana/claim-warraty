import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Claim } from './schema/claim.schema';

@Injectable()
export class ClaimService {
  constructor(
    @InjectModel('Claim')
    private claimModel: mongoose.Model<Claim>,
  ) {}

  async findAllClaim(): Promise<Claim[]> {
    const claims = await this.claimModel.find();
    return claims;
  }

  async createClaim(claim: Claim): Promise<Claim> {
    const res = await this.claimModel.create(claim);
    return res;
  }

  async findOneClaimByID(id: string): Promise<Claim> {
    const res = await this.claimModel.findById(id);

    if (!res) {
      throw new NotFoundException('Claim not found');
    }
    return res;
  }

  async findOneClaimByIdAndUpdate(id: string, claim: Claim): Promise<Claim> {
    const res = await this.claimModel.findByIdAndUpdate(id, claim, {
      new: true,
    });
    if (!res) {
      throw new NotFoundException('Claim not found');
    }
    return res;
  }

  async deleteClaimById(id: string): Promise<Claim> {
    const res = await this.claimModel.findByIdAndDelete(id);
    if (!res) {
      throw new NotFoundException('Claim not found');
    }
    return res;
  }
}
