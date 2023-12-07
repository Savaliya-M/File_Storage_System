import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import * as process from 'process';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
// import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
import { RedisInstrumentation as RedisInstrumentationV2 } from '@opentelemetry/instrumentation-redis';
import { RedisInstrumentation as RedisInstrumentationV4 } from '@opentelemetry/instrumentation-redis-4';

const jaegerExporter = new JaegerExporter({
  endpoint: 'http://localhost:14268/api/traces',
});

const traceExporter = jaegerExporter;

export const otelSDK = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: `nestjs-otel`,
  }),
  spanProcessor: new SimpleSpanProcessor(traceExporter),
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new IORedisInstrumentation(),
    new RedisInstrumentationV2(),
    new RedisInstrumentationV4(),
    new NestInstrumentation(),
  ],
});

// process.beforeExit(() => {
//     otelSDK
//       .shutdown()
//       .then(
//         () => console.log('SDK shut down successfully'),
//         (err) => console.log('Error shutting down SDK', err),
//       );
//   });

//   // Handle SIGTERM signal if needed
//   process.on('SIGTERM', () => {
//     // Perform additional cleanup or handle the signal as needed
//     process.exit(0);
//   });
