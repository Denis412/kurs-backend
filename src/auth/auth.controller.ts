import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() userData: any) {
    return this.authService.register(userData);
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Body() loginData: any) {
    return this.authService.login(loginData);
  }
}
