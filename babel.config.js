module.exports = function (api) {
    api.cache(true);

    const presets = [
        [
            "@babel/env",
            {
                targets: {
                    node: "8",
                    ie: "10",
                    edge: "17",
                    firefox: "60",
                    chrome: "67",
                    safari: "11.1",
                },
                useBuiltIns: "usage",
                modules: false,
                corejs: {
                    "version": 3,
                    "proposals": true,
                }
            },
        ],
        "@babel/react"
    ];
    const plugins = [];

    return {
        presets,
        plugins
    };
};