import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
    @UseGuards(JwtAuthGuard)
    async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
        const book = await this.booksService.getById(id);
        if(!book)
            throw new NotFoundException('Book not found');

        await this.booksService.deleteById(id);
        return { success: true };
    }

    @Post('/')
    @UseGuards(JwtAuthGuard)
    create(@Body() bookData: CreateBookDTO) {
        return this.booksService.create(bookData);
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    async UpdateById(@Param('id', new ParseUUIDPipe()) id: string, @Body() bookData: UpdateBookDTO) {
        const book = await this.booksService.getById(id);
        if(!book)
            throw new NotFoundException('Book not found');

        await this.booksService.updateById(id, bookData);
        return { success: true };
    }

    @Post('/like')
    @UseGuards(JwtAuthGuard)
    async BooksLike(@Body(new ParseUUIDPipe()) data: { bookId: string, userId: string }) {
        try {
          const result = await this.booksService.booksLike(data.bookId, data.userId);
          return result;
        } catch (error) {
          if (error.code === 'P2025') {
            throw new NotFoundException('Book not found');
          }
          throw error; 
        }
      }

    
}
