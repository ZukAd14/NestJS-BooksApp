import { Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post, Body, Put, Delete } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDTO } from './dtos/create-author.dto';
import { UpdateAuthorDTO } from './dtos/update-author.dto';

@Controller('authors')
export class AuthorsController {
    constructor(private authorsService: AuthorsService) {
        this.authorsService = authorsService;
    }

    @Get('/')
    getAll(): any {
        return this.authorsService.getAll();
    }

    @Get('/:id')
    async getById(@Param('id', new ParseUUIDPipe()) id: string) {
        const author = await this.authorsService.getById(id);
        if (!author)
            throw new NotFoundException('Author not found');
        return author;
    }

    @Post('/')
    create(@Body() authorData: CreateAuthorDTO) {
        return this.authorsService.create(authorData);
    }

    @Put('/:id')
    async UpdateById(@Param('id', new ParseUUIDPipe()) id: string, @Body() authorsData: UpdateAuthorDTO) {
        const author = await this.authorsService.getById(id);
        if (!author)
            throw new NotFoundException('Author not found');

        await this.authorsService.updateById(id, authorsData);
        return { success: true };
    }

    @Delete('/:id')
    async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
        const author = await this.authorsService.getById(id);
        if (!author)
            throw new NotFoundException('Author not found');

        await this.authorsService.deleteById(id);
        return { success: true };
    }
}
