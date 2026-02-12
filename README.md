# DZMRedEnvelopeHelper

- 注意：当前版本已移除微信支持，仅支持钉钉平台。钉钉红包功能稳定可用。

- 不可进行商业用途，仅供学习使用。

- 自用安卓版抢红包助手，非反编译而是使用 `autojs pro 9.3.11` 自动化方式实现，支持钉钉平台抢红包，抢不抢得到全看脸，但是起码不用手动。

- `注意`：`apk` 只支持 `cpu` 包含 `armeabi-v7a` 与 `arm64-v8a` 的设备。

- 可以直接使用安装包，或使用 `autojspro 9.x` 及以上版本安装导入 `main.js` 文件即可， 然后运行使用。

- 没有安卓机的，可以使用电脑模拟器，例如：[雷电模拟器](https://www.ldmnq.com/) 、[Genymotion 模拟器](https://www.genymotion.com/)、[MuMu模拟器](https://mumu.163.com/)，模拟器如果安装不上包，可以核对一下模拟器 `cpu` 类型是什么，`Android` 7 及以上版本。

  附：[adb 查看安卓手机、模拟器、apk包所支持的 CPU 类型（armeabi、armeabi-v7a、arm64-v8a ...）](https://blog.csdn.net/zz00008888/article/details/133696691)

  另外钉钉 `App` 可以到第三方平台进行下载，或者 [Google Play 商店](https://blog.csdn.net/zz00008888/article/details/122740312) 下载 `apk`。

- 分支信息：

  - `1.0.0` 分支使用的 `autojs 4.1.1`，虽然老版本，但是文档，获取难度低，但是好像无法打 `arm64-v8a`，只能打 `armeabi-v7a` 的包，所以需要看手机是否支持。

  - `1.0.1` 分支使用的 `autojs pro 9.3.11`，后续优化也是基于这个版本，支持 `armeabi-v7a` 与 `arm64-v8a` 打包。

  - `2.0.0` 分支使用的 `autojs pro 9.3.11 第1代API`，UI全面升级，处理细节全面优化，已知bug全面修复。

  - `2.0.1` 分支移除微信支持，仅保留钉钉平台功能。

- [钉钉测试视频](./hb_dd.mp4)，自行下载观看测试效果，界面效果如下：

  ![运行效果 1](demo1.png) ![运行效果 2](demo2.png)。
