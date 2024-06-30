import type { AuthProviders } from '@/common/types';

export class OAuthValidateDto {
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  providers: ProviderDto;
}

export class ProviderDto {
  provider: AuthProviders;

  providerId?: string;
}
