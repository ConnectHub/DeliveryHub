import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { OrderViewModel } from './view-model/order-view-model';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../decorators/public.decorator';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(
    @InjectQueue('notification') private notificationQueue: Queue,
    private readonly orderService: OrderService,
  ) {}

  @ApiOkResponse({ type: OrderViewModel })
  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.orderService.findOrderById(id);
  }

  @ApiOkResponse({ type: [OrderViewModel] })
  @Get('list/recipient')
  async findByRecipient() {
    const orders = await this.orderService.findOrders();
    return orders.map(OrderViewModel.toHttp);
  }

  @ApiCreatedResponse({ type: OrderViewModel })
  @Post('create')
  async create(@Body() order: CreateOrderDto) {
    const newOrder = await this.orderService.createOrder(order);
    await this.notificationQueue.add(
      'order.created',
      {
        orderId: newOrder.url,
        phoneNumber: newOrder.addressee.phoneNumber,
      },
      { delay: 5000, attempts: 3, removeOnComplete: true, removeOnFail: true },
    );
    return OrderViewModel.toHttp(newOrder);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.orderService.deleteOrder(id);
  }

  @Public()
  @ApiOkResponse({ type: OrderViewModel })
  @UseInterceptors(FileInterceptor('file'))
  @Post('accept')
  async accept(
    @Body() order: UpdateOrderDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000 }),
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const { code, url } = order;
    const prevOrder = await this.orderService.acceptOrder(code, url, file);
    return OrderViewModel.toHttp(prevOrder);
  }

  @Public()
  @Get('url/:url')
  async findByUrl(@Param('url') url: string) {
    const order = await this.orderService.findByUrl(url);
    return OrderViewModel.toHttp(order);
  }
}
