import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) {
        this.booksService = booksService;
    }

    @Get('/')
    getAll(): any {
        return this.booksService.getAll();
    }

    @Get('/:id')
    async getById(@Param('id', new ParseUUIDPipe()) id: string) {
        const book = await this.booksService.getById(id);
        if (!book)
            throw new NotFoundException('Book not found');

        return book;
    }

    @Delete('/:id')
    async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
        const book = await this.booksService.getById(id);
        if(!book)
            throw new NotFoundException('Book not found');

        await this.booksService.deleteById(id);
        return { success: true };
    }

    @Post('/')
    create(@Body() bookData: CreateBookDTO) {
        return this.booksService.create(bookData);
    }

    @Put('/:id')
    async UpdateById(@Param('id', new ParseUUIDPipe()) id: string, @Body() bookData: UpdateBookDTO) {
        const book = await this.booksService.getById(id);
        if(!book)
            throw new NotFoundException('Book not found');

        await this.booksService.updateById(id, bookData);
        return { success: true };
    }
}
