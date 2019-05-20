module.exports = {
    extends: 'lighthouse:default',
    settings: {
        maxWaitForLoad: 35 * 1000,
        emulatedFormFactor: 'desktop',
        throttlingMethod:'provided',
        scores: {
            'performance': 90,
        },
        onlyCategories: [
            'performance',
        ],
        skipAudits: [
            'byte-efficiency/uses-responsive-images',
            'byte-efficiency/uses-webp-images',
            'uses-http2'
        ]
    },
};