import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './dtos/register-auth.dto';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt/dist';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        ) {}

    public async register(registrationData: RegisterDTO) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);

        const userData = {
            email: registrationData.email,
        };
        return await this.usersService.create(userData, hashedPassword)
    }

    public async validateUser(email: string, password: string) {
        const user = await this.usersService.getByEmail(email);
        if (user && (await bcrypt.compare(password, user.password.hashedPassword))) {
            const { password, ...result } = user;
            return result;
        }
        return null
    }

    public async createSession(user: any) {
        const payload = { email: user.email, sub: user.id };

        const accessToken = this.jwtService.sign(payload, {
            secret: 'something13',
            expiresIn: '12h',
        });

        return {
            access_token: accessToken,
        };
    }
}
