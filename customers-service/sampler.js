const { AlwaysOnSampler, AlwaysOffSampler, SamplingDecision } = require('@opentelemetry/sdk-trace-base');

const MIDDLEWARE = 'middleware';

class CustomSampler {
  constructor() {
    this.alwaysOnSampler = new AlwaysOnSampler();  // Default to sampling
    this.alwaysOffSampler = new AlwaysOffSampler();  // For skipping spans
  }

  shouldSample(context, traceId, spanName, spanKind, attributes, links) {
    // Do not record function spans with skip = true
    if (attributes && attributes.skip === true) {
      return {
        decision: SamplingDecision.NOT_RECORD,
      };
    }

    // Do not record middleware spans
    if (attributes && attributes['express.type'] === MIDDLEWARE) {
      return {
        decision: SamplingDecision.NOT_RECORD,  
      };
    }

    return this.alwaysOnSampler.shouldSample(context, traceId, spanName, spanKind, attributes, links);
  }

  toString() {
    return 'CustomSampler';
  }
}

module.exports = {
    CustomSampler
}
