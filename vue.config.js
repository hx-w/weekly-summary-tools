module.exports = {
    pluginOptions: {
        electronBuilder: {
            customFileProtocol: './',
            builderOptions: {
                directories: {
                    "output": "build" // 输出文件夹
                },
                asar: false,
                extraResources:  {
                    "from": "./bin/",
                    "to": "../bin"
                }
            }
        }
    }
};