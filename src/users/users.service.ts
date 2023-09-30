import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import { error } from 'console';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    public async getAll(): Promise<User[]> {
        return this.prismaService.user.findMany({
            include: {
                books: {
                    include: {
                        book: true,
                    },
                },
            },
        });
    }

    public getById(id: User['id']): Promise<User> | null {
        return this.prismaService.user.findUnique({
            where: { id },
        });
    }

    public getByEmail(email: User['email']): Promise<(User & { password })> | null {
        return this.prismaService.user.findUnique({
            where: { email },
            include: { password: true },
        });
    }

    public async create(UserData: Omit<User, 'id' | 'role'>, password): Promise<User> {
        
        try {
            return await this.prismaService.user.create({
                data: {
                    ...UserData,
                    password: {
                        create: {
                            hashedPassword: password,
                        },
                    },
                },
            });
        } catch (error) {
            if (error.code === 'P2002')
            throw new ConflictException('Email is already taken');
        }
        throw error;
    } 

    public async updateById(id: User['id'], UserData: Omit<User, 'id' | 'role'>, password: string | undefined): Promise<User> {
        try {
            if (password !== undefined) {
                return await this.prismaService.user.update({
                    where: { id },
                    data: {
                        ...UserData,
                        password: {
                            update: {
                                hashedPassword: password,
                            },
                        },
                    },
                });
            } else {
                return await this.prismaService.user.update({
                    where: { id },
                    data: UserData,
                });
            }
        } catch (error) {
            if (error.code === 'P2002')
            throw new ConflictException('Email is already taken');
        }
        throw error;
    }

    public async deleteById(id: User['id']): Promise<User> {
        try {
            return this.prismaService.user.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025')
            throw new BadRequestException("User doesn't exist");
        }
        throw error;
    }
}
