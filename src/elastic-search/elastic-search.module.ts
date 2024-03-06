import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
    imports: [
        ConfigModule,
        ElasticsearchModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                node: configService.get('ELASTICSEARCH_NODE'),
            }),
            inject: [ConfigService]
        })
    ]
})

export class ElasticSearchModule {}
