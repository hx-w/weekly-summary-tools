module.exports = {
    pluginOptions: {
        electronBuilder: {
            customFileProtocol: './',
            builderOptions: {
                directories: {
                    "output": "build",
                    "buildResources": "bin"
                },
                asar: false,
                extraResources: {
                    "from": "./bin/",
                    "to": "../bin"
                },
                win: {
                    target: "dir"
                }
            }
        }
    }
};