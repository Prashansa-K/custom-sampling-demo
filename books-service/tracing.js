const process = require('process'),

 opentelemetry = require('@opentelemetry/sdk-node'),
 { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions'),
 { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base'),
 { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node'),
 { JaegerExporter } = require('@opentelemetry/exporter-jaeger'),
 { Resource } = require('@opentelemetry/resources'),
 
 { CustomSampler } = require('./sampler'),

// Set service name dynamically based on the NODE_SERVICE_NAME environment variable
serviceName = process.env.NODE_SERVICE_NAME || 'books-service',

// Initialize Jaeger Exporter
jaegerExporter = new JaegerExporter({
    endpoint: 'http://localhost:14268/api/traces'  // Ensure Jaeger is running locally
}),

// Initialize OpenTelemetry SDK
sdk = new opentelemetry.NodeSDK({
    resource: new Resource({
        [ATTR_SERVICE_NAME]: serviceName  // Service name passed through env
    }),
    instrumentations: [getNodeAutoInstrumentations()],  // Auto instrument HTTP, MongoDB, etc.
    // sampler: new CustomSampler(),
    spanProcessor: new BatchSpanProcessor(jaegerExporter)
});


// Start the SDK (Tracing) synchronously
sdk.start();

console.log(`Tracing initialized for service: ${serviceName}`);

// Gracefully shut down tracing on exit
process.on('SIGTERM', () => {
    sdk.shutdown()
        .then(() => console.log('Tracing terminated'))
        .catch((error) => console.error('Error terminating tracing', error))
        .finally(() => process.exit(0));
});


