module.exports = {
    pluginOptions: {
        electronBuilder: {
            customFileProtocol: './',
            builderOptions: {
                "extraResources":  {
                    "from": "./bin/",
                    "to": "bin"
                }
            }
        }
    }
};