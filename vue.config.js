module.exports = {
    pluginOptions: {
        electronBuilder: {
            customFileProtocol: './',
            nodeIntegration: true,
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