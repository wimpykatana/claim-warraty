import { Module } from '@nestjs/common';
import { ClaimController } from './claim.controller';
import { ClaimService } from './claim.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClaimSchema } from './schema/claim.schema';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule,
    MongooseModule.forFeature([{ name: 'Claim', schema: ClaimSchema }]),
  ],
  controllers: [ClaimController],
  providers: [ClaimService],
})
export class ClaimModule {}
