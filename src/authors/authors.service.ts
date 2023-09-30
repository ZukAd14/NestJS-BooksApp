import { ConflictException, Injectable } from '@nestjs/common';
import { Author } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class AuthorsService {
    constructor(private prismaService: PrismaService) {}

    public getAll(): Promise<Author[]> {
        return this.prismaService.author.findMany();
    }

    public getById(id: Author['id']): Promise<Author> | null {
        return this.prismaService.author.findUnique({
            where: { id },
        });
    }

    public async create(AuthorData: Omit<Author, 'id'>): Promise<Author> {
        try {
        return await this.prismaService.author.create({
            data: AuthorData,
        });
    } catch (error) {
        if (error.code === 'P2002')
            throw new ConflictException('Name is already taken');
        throw error;
    }
    }

    public async updateById(id: Author['id'], AuthorData: Omit<Author, 'id'>): Promise<Author> {
        try {
            return await this.prismaService.author.update({
                where: { id },
                data: AuthorData,
            });
        } catch (error) {
            if (error.code === 'P2002')
                throw new ConflictException('Name is already taken');
            throw error;
        }
    }

    public deleteById(id: Author['id']): Promise<Author> {
        return this.prismaService.author.delete({
            where: { id },
        });
    }
}
