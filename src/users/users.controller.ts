import { Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {
        this.usersService = usersService;
    }

    @Get('/')
    getAll(): any {
        return this.usersService.getAll();
    }

    @Get('/:id')
    async getById(@Param('id', new ParseUUIDPipe()) id: string) {
        const user = await this.usersService.getById(id);
        if (!user)
            throw new NotFoundException('User not found');
        return user;
    }

    @Delete('/:id')
    @UseGuards(AdminAuthGuard)
    @UseGuards(JwtAuthGuard)
    async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
        const user = await this.usersService.getById(id);
        if (!user)
            throw new NotFoundException('User not found');

        await this.usersService.deleteById(id);
        return { success: true };
    }

}
