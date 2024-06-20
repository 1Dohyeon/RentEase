import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from './address.entity';

@Injectable()
export class AddressRepository implements OnModuleInit {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly repository: Repository<AddressEntity>,
  ) {}

  async onModuleInit() {
    const addresses = [
      { city: '서울특별시', district: '강남구' },
      { city: '서울특별시', district: '강동구' },
      { city: '서울특별시', district: '강북구' },
      { city: '서울특별시', district: '강서구' },
      { city: '서울특별시', district: '관악구' },
      { city: '서울특별시', district: '광진구' },
      { city: '서울특별시', district: '구로구' },
      { city: '서울특별시', district: '금천구' },
      { city: '서울특별시', district: '노원구' },
      { city: '서울특별시', district: '도봉구' },
      { city: '서울특별시', district: '동대문구' },
      { city: '서울특별시', district: '동작구' },
      { city: '서울특별시', district: '마포구' },
      { city: '서울특별시', district: '서대문구' },
      { city: '서울특별시', district: '서초구' },
      { city: '서울특별시', district: '성동구' },
      { city: '서울특별시', district: '성북구' },
      { city: '서울특별시', district: '송파구' },
      { city: '서울특별시', district: '양천구' },
      { city: '서울특별시', district: '영등포구' },
      { city: '서울특별시', district: '용산구' },
      { city: '서울특별시', district: '은평구' },
      { city: '서울특별시', district: '종로구' },
      { city: '서울특별시', district: '중구' },
      { city: '서울특별시', district: '중랑구' },
      // 필요한 다른 시/도와 군/구 추가
    ];

    for (const address of addresses) {
      const exists = await this.repository.findOne({
        where: { city: address.city, district: address.district },
      });
      if (!exists) {
        const newAddress = this.repository.create(address);
        await this.repository.save(newAddress);
      }
    }
  }
}
