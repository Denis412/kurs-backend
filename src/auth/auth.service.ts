import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; // Подключаем UserService
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(credentials: any) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new BadRequestException('Email и пароль обязательны');
    }

    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      token_type: 'Bearer',
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser: any = await this.userService.create({
      ...userData,
      password: hashedPassword,
    });
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { password, ...result } = newUser;
    return result;
  }
}
