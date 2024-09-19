import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Status {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({
  timestamps: true,
})
export class Claim {
  @Prop()
  productId: string;

  @Prop()
  userId: string;

  @Prop()
  status: Status;

  @Prop()
  claimDetails: string;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);
