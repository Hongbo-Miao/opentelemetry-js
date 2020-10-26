/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TraceFlags, ValueType } from '@opentelemetry/api';
import { ReadableSpan } from '@opentelemetry/tracing';
import { Resource } from '@opentelemetry/resources';
import { collectorTypes } from '@opentelemetry/exporter-collector';
import * as assert from 'assert';
import { MetricRecord, MeterProvider } from '@opentelemetry/metrics';
import * as grpc from 'grpc';

const meterProvider = new MeterProvider({
  interval: 30000,
  resource: new Resource({
    service: 'ui',
    version: 1,
    cost: 112.12,
  }),
});

const meter = meterProvider.getMeter('default', '0.0.1');

const traceIdArr = [
  213,
  253,
  116,
  211,
  199,
  92,
  241,
  237,
  187,
  209,
  239,
  57,
  115,
  141,
  26,
  209,
  222,
  220,
  223,
  221,
  253,
  111,
  110,
  252,
];
const spanIdArr = [229, 237, 116, 239, 110, 181, 127, 174, 31, 107, 157, 222];
const parentIdArr = [239, 198, 188, 247, 94, 116, 247, 207, 58, 227, 127, 60];

export async function mockCounter(): Promise<MetricRecord> {
  const name = 'int-counter';
  const metric =
    meter['_metrics'].get(name) ||
    meter.createCounter(name, {
      description: 'sample counter description',
      valueType: ValueType.INT,
    });
  metric.clear();
  metric.bind({});

  return (await metric.getMetricRecord())[0];
}

export async function mockDoubleCounter(): Promise<MetricRecord> {
  const name = 'double-counter';
  const metric =
    meter['_metrics'].get(name) ||
    meter.createCounter(name, {
      description: 'sample counter description',
      valueType: ValueType.DOUBLE,
    });
  metric.clear();
  metric.bind({});

  return (await metric.getMetricRecord())[0];
}

export async function mockObserver(): Promise<MetricRecord> {
  const name = 'double-observer';
  const metric =
    meter['_metrics'].get(name) ||
    meter.createValueObserver(name, {
      description: 'sample observer description',
      valueType: ValueType.DOUBLE,
    });
  metric.clear();
  metric.bind({});

  return (await metric.getMetricRecord())[0];
}

export async function mockValueRecorder(): Promise<MetricRecord> {
  const name = 'int-recorder';
  const metric =
    meter['_metrics'].get(name) ||
    meter.createValueRecorder(name, {
      description: 'sample recorder description',
      valueType: ValueType.INT,
      boundaries: [0, 100],
    });
  metric.clear();
  metric.bind({});

  return (await metric.getMetricRecord())[0];
}

export const mockedReadableSpan: ReadableSpan = {
  name: 'documentFetch',
  kind: 0,
  spanContext: {
    traceId: '1f1008dc8e270e85c40a0d7c3939b278',
    spanId: '5e107261f64fa53e',
    traceFlags: TraceFlags.SAMPLED,
  },
  parentSpanId: '78a8915098864388',
  startTime: [1574120165, 429803070],
  endTime: [1574120165, 438688070],
  ended: true,
  status: { code: 0 },
  attributes: { component: 'document-load' },
  links: [
    {
      context: {
        traceId: '1f1008dc8e270e85c40a0d7c3939b278',
        spanId: '78a8915098864388',
      },
      attributes: { component: 'document-load' },
    },
  ],
  events: [
    { name: 'fetchStart', time: [1574120165, 429803070] },
    {
      name: 'domainLookupStart',
      time: [1574120165, 429803070],
    },
    { name: 'domainLookupEnd', time: [1574120165, 429803070] },
    {
      name: 'connectStart',
      time: [1574120165, 429803070],
    },
    { name: 'connectEnd', time: [1574120165, 429803070] },
    {
      name: 'requestStart',
      time: [1574120165, 435513070],
    },
    { name: 'responseStart', time: [1574120165, 436923070] },
    {
      name: 'responseEnd',
      time: [1574120165, 438688070],
    },
  ],
  duration: [0, 8885000],
  resource: new Resource({
    service: 'ui',
    version: 1,
    cost: 112.12,
  }),
  instrumentationLibrary: { name: 'default', version: '0.0.1' },
};

export function ensureExportedEventsAreCorrect(
  events: collectorTypes.opentelemetryProto.trace.v1.Span.Event[]
) {
  assert.deepStrictEqual(
    events,
    [
      {
        attributes: [],
        timeUnixNano: '1574120165429803008',
        name: 'fetchStart',
        droppedAttributesCount: 0,
      },
      {
        attributes: [],
        timeUnixNano: '1574120165429803008',
        name: 'domainLookupStart',
        droppedAttributesCount: 0,
      },
      {
        attributes: [],
        timeUnixNano: '1574120165429803008',
        name: 'domainLookupEnd',
        droppedAttributesCount: 0,
      },
      {
        attributes: [],
        timeUnixNano: '1574120165429803008',
        name: 'connectStart',
        droppedAttributesCount: 0,
      },
      {
        attributes: [],
        timeUnixNano: '1574120165429803008',
        name: 'connectEnd',
        droppedAttributesCount: 0,
      },
      {
        attributes: [],
        timeUnixNano: '1574120165435513088',
        name: 'requestStart',
        droppedAttributesCount: 0,
      },
      {
        attributes: [],
        timeUnixNano: '1574120165436923136',
        name: 'responseStart',
        droppedAttributesCount: 0,
      },
      {
        attributes: [],
        timeUnixNano: '1574120165438688000',
        name: 'responseEnd',
        droppedAttributesCount: 0,
      },
    ],
    'exported events are incorrect'
  );
}

export function ensureExportedAttributesAreCorrect(
  attributes: collectorTypes.opentelemetryProto.common.v1.KeyValue[]
) {
  assert.deepStrictEqual(
    attributes,
    [
      {
        key: 'component',
        value: {
          stringValue: 'document-load',
          value: 'stringValue',
        },
      },
    ],
    'exported attributes are incorrect'
  );
}

export function ensureExportedLinksAreCorrect(
  attributes: collectorTypes.opentelemetryProto.trace.v1.Span.Link[]
) {
  assert.deepStrictEqual(
    attributes,
    [
      {
        attributes: [
          {
            key: 'component',
            value: {
              stringValue: 'document-load',
              value: 'stringValue',
            },
          },
        ],
        traceId: Buffer.from(traceIdArr),
        spanId: Buffer.from(parentIdArr),
        traceState: '',
        droppedAttributesCount: 0,
      },
    ],
    'exported links are incorrect'
  );
}

export function ensureExportedSpanIsCorrect(
  span: collectorTypes.opentelemetryProto.trace.v1.Span
) {
  if (span.attributes) {
    ensureExportedAttributesAreCorrect(span.attributes);
  }
  if (span.events) {
    ensureExportedEventsAreCorrect(span.events);
  }
  if (span.links) {
    ensureExportedLinksAreCorrect(span.links);
  }
  assert.deepStrictEqual(
    span.traceId,
    Buffer.from(traceIdArr),
    'traceId is wrong'
  );
  assert.deepStrictEqual(
    span.spanId,
    Buffer.from(spanIdArr),
    'spanId is wrong'
  );
  assert.strictEqual(span.traceState, '', 'traceState is wrong');
  assert.deepStrictEqual(
    span.parentSpanId,
    Buffer.from(parentIdArr),
    'parentIdArr is wrong'
  );
  assert.strictEqual(span.name, 'documentFetch', 'name is wrong');
  assert.strictEqual(span.kind, 'SPAN_KIND_INTERNAL', 'kind is wrong');
  assert.strictEqual(
    span.startTimeUnixNano,
    '1574120165429803008',
    'startTimeUnixNano is wrong'
  );
  assert.strictEqual(
    span.endTimeUnixNano,
    '1574120165438688000',
    'endTimeUnixNano is wrong'
  );
  assert.strictEqual(
    span.droppedAttributesCount,
    0,
    'droppedAttributesCount is wrong'
  );
  assert.strictEqual(span.droppedEventsCount, 0, 'droppedEventsCount is wrong');
  assert.strictEqual(span.droppedLinksCount, 0, 'droppedLinksCount is wrong');
  assert.deepStrictEqual(
    span.status,
    { code: 'STATUS_CODE_OK', message: '' },
    'status is wrong'
  );
}

export function ensureExportedCounterIsCorrect(
  metric: collectorTypes.opentelemetryProto.metrics.v1.Metric,
  time?: number
) {
  assert.deepStrictEqual(metric, {
    name: 'int-counter',
    description: 'sample counter description',
    unit: '1',
    data: 'intSum',
    intSum: {
      dataPoints: [
        {
          labels: [],
          exemplars: [],
          value: '1',
          startTimeUnixNano: '1592602232694000128',
          timeUnixNano: String(time),
        },
      ],
      isMonotonic: true,
      aggregationTemporality: 'AGGREGATION_TEMPORALITY_DELTA',
    },
  });
}

export function ensureExportedObserverIsCorrect(
  metric: collectorTypes.opentelemetryProto.metrics.v1.Metric,
  time?: number
) {
  assert.deepStrictEqual(metric, {
    name: 'double-observer',
    description: 'sample observer description',
    unit: '1',
    data: 'doubleGauge',
    doubleGauge: {
      dataPoints: [
        {
          labels: [],
          exemplars: [],
          value: 6,
          startTimeUnixNano: '1592602232694000128',
          timeUnixNano: String(time),
        },
      ],
    },
  });
}

export function ensureExportedValueRecorderIsCorrect(
  metric: collectorTypes.opentelemetryProto.metrics.v1.Metric,
  time?: number
) {
  assert.deepStrictEqual(metric, {
    name: 'int-recorder',
    description: 'sample recorder description',
    unit: '1',
    data: 'intHistogram',
    intHistogram: {
      dataPoints: [
        {
          labels: [],
          exemplars: [],
          sum: '21',
          count: '2',
          startTimeUnixNano: '1592602232694000128',
          timeUnixNano: String(time),
          bucketCounts: ['2', '0'],
          explicitBounds: [Infinity],
        },
      ],
      aggregationTemporality: 'AGGREGATION_TEMPORALITY_CUMULATIVE',
    },
  });
}

export function ensureResourceIsCorrect(
  resource: collectorTypes.opentelemetryProto.resource.v1.Resource
) {
  assert.deepStrictEqual(resource, {
    attributes: [
      {
        key: 'service.name',
        value: {
          stringValue: 'basic-service',
          value: 'stringValue',
        },
      },
      {
        key: 'service',
        value: {
          stringValue: 'ui',
          value: 'stringValue',
        },
      },
      {
        key: 'version',
        value: {
          doubleValue: 1,
          value: 'doubleValue',
        },
      },
      {
        key: 'cost',
        value: {
          doubleValue: 112.12,
          value: 'doubleValue',
        },
      },
    ],
    droppedAttributesCount: 0,
  });
}

export function ensureMetadataIsCorrect(
  actual: grpc.Metadata,
  expected: grpc.Metadata
) {
  //ignore user agent
  expected.remove('user-agent');
  actual.remove('user-agent');
  assert.deepStrictEqual(actual.getMap(), expected.getMap());
}