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
                files: [
                    "./build/**/*",
                    "package.json"
                ],
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