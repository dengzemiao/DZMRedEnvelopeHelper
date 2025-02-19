# DZMRedEnvelopeHelper

- 注意：钉钉无问题，微信红包抢红包按钮存在识别问题，时好时坏，微信其实代码是没问题的，界面存在按钮，却识别不到的情况，原因是自动化会存在无法识别弹窗内容的情况。后续会进行修复！如果急用可以通过修改源码固定手机屏幕位置进行点击。或者下载源码导入到 autojs app 中直接执行脚本，这样微信被识别的成功率大，测试下来是这样。

- 不可进行商业用途，仅供学习使用。

- 自用安卓版抢红包助手，非反编译而是使用 `autojs pro 9.3.11` 自动化方式实现，支持钉钉、微信，抢不抢得到全看脸，但是起码不用手动。

- `注意`：`apk` 安装的方式，钉钉版本使用没问题，但是微信会存在找到按键缺点击失效的情况，及 `apk` 只支持 `cpu` 包含 `armeabi-v7a` 与 `arm64-v8a` 的设备。遇到这几种情况可以按下面的方式使用，效果一样。

- 可以直接使用安装包，或使用 `autojspro 9.x` 及以上版本安装导入 `main.js` 文件即可， 然后运行使用。

- 没有安卓机的，可以使用电脑模拟器，例如：[雷电 4.0 模拟器](https://github.com/dengzemiao/DZMAutojsTools/blob/main/ldplayerinst4_4.0.83.exe) 及以上版本、[Genymotion 模拟器](https://www.genymotion.com/)、[MuMu模拟器](https://mumu.163.com/)，模拟器如果安装不上包，可以核对一下模拟器 `cpu` 类型是什么。

  附：[adb 查看安卓手机、模拟器、apk包所支持的 CPU 类型（armeabi、armeabi-v7a、arm64-v8a ...）](https://blog.csdn.net/zz00008888/article/details/133696691)

  另外钉钉与微信 `App` 可以到第三方平台进行下载，或者 [Google Play 商店](https://blog.csdn.net/zz00008888/article/details/122740312) 下载 `apk`。

- 分支信息：

  - `1.0.0` 分支使用的 `autojs 4.1.1`，虽然老版本，但获取难度低，只是无法打 `arm64-v8a`，只能打 `armeabi-v7a` 的包，所以需要看手机是否支持。

  - `1.0.1` 分支使用的 `autojs pro 9.3.11`，后续优化也是基于这个版本，支持 `armeabi-v7a` 与 `arm64-v8a` 打包。

- [钉钉测试视频](./hb_dd.mp4)、[微信测试视频](./hb_wx.mp4)，自行下载观看测试效果，界面效果如下：

  ![运行效果 1](demo1.png) ![运行效果 2](demo2.png)。
