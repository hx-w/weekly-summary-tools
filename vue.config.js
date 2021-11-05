module.exports = {
    runtimeCompiler: true,
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                // build配置在此处
                // options placed here will be merged with default configuration and passed to electron-builder

                "productName": "goPack",
                "appId": "live.scubot.tools",
                "copyright": "hex reserve all rights",
                "directories": {
                    "output": "build"
                },
                "nsis": {
                    "oneClick": false,
                    "allowElevation": true,
                    "allowToChangeInstallationDirectory": true,
                    "createDesktopShortcut": true,
                    "createStartMenuShortcut": true,
                    "shortcutName": "goPack"
                },
                "win": {
                    "target": [
                        {
                            "arch": [
                                "x64"
                            ],
                            "target": "nsis"
                        }
                    ]
                }
            }
        }
    },
};