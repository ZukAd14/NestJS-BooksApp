import { Body, Controller, Post, Request, UseGuards, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register-auth.dto';
import { LocalAuthGuard } from './local-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
        this.authService = authService;
    }

    @Post('/register')
    register(@Body() registerData: RegisterDTO) {
        return this.authService.register(registerData);
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req, @Response() res) {
        const tokens = await this.authService.createSession(req.user);
        res.cookie('auth', tokens, { httpOnly: true });
        res.send({
            message: 'success',
        });
        
    }
}
