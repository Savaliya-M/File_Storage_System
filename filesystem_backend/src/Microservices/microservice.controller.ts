import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  GrpcMethod,
  MessagePattern,
  ClientGrpc,
  GrpcStreamMethod,
  Payload,
  Ctx,
  RedisContext,
} from '@nestjs/microservices';
import { microserviceService } from './microservice.service';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { HeroById } from './interfaces/hero-by-id.interface';
import { Hero } from './interfaces/hero.interface';
import { Observable } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

interface HeroService {
  findOne(data: HeroById): Observable<Hero>;
  findMany(upstream: Observable<HeroById>): Observable<Hero>;
}

@Controller()
export class MicroservicesController implements OnModuleInit {
  private heroService: HeroService;

  constructor(
    private microserviceService: microserviceService,
    // private redisService: RedisService,
    @Inject('HERO_PACKAGE') private readonly client: ClientGrpc,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  onModuleInit() {
    this.heroService = this.client.getService<HeroService>('HeroService');
  }

  @MessagePattern('resizeImage')
  async handleEvent(data: {
    inputImage: Buffer;
    width: number;
    height: number;
  }): Promise<unknown> {
    const result = await this.microserviceService.handleEvent(data);

    return result;
  }

  @MessagePattern('dataStoredInRedis')
  async handleDataStore(@Payload() data: string, @Ctx() context: RedisContext) {
    console.log(`channel: ${context.getChannel()}`);
    console.log(data);
  }

  @GrpcMethod('HeroService')
  async findOne(data: HeroById): Promise<Hero> {
    const items = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ];

    return items.find(({ id }) => id === data.id);
  }
}
