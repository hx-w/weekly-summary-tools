module.exports = {
    pluginOptions: {
        electronBuilder: {
            customFileProtocol: './',
            builderOptions: {
                directories: {
                    "output": "build/",
                },
                // asar: false,
                // extraResources: {
                //     "from": "./bin/",
                //     "to": "./"
                // },
                win: {
                    target: "dir"
                }
            }
        }
    }
};