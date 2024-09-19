import { Status } from '../schema/claim.schema';

export class ClaimDto {
  readonly productId: string;
  readonly userId: string;
  readonly status: Status;
  readonly claimDetails: string;
}
