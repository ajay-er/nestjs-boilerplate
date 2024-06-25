import { Controller, Get, UseGuards } from '@nestjs/common';

import { Roles } from '@/common/decorator';
import { RoleGuard } from '@/common/guards/roles.guard';
import { Role } from '@/common/types';

@UseGuards(RoleGuard)
@Controller('users')
export class UsersController {
  @Get()
  @Roles(Role.USER)
  getAllUsers() {
    return 'All users';
  }
}
