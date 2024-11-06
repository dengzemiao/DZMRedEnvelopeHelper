# DZMRedEnvelopeHelper

- 不可进行商业用途，仅供学习使用。

- 自用安卓版抢红包助手，非反编译，而是使用 `autojs4.x` 自动化方式实现，支持钉钉、微信，抢不抢得到全看脸，但是起码不用手动。

- `注意`：`apk` 安装的方式，钉钉版本使用没问题，但是微信会存在找到按键缺点击失效的情况，及 `apk` 包 `cpu` 只支持包含 `armeabi-v7a` 的设备。遇到这几种情况可以按下面的方式使用，效果一样。

- 可以直接使用安装包，或使用 [autojs4.x - apk](https://github.com/dengzemiao/DZMAutojsTools) 及以上版本安装导入 `main.js` 文件即可， 然后运行使用。

- 没有安卓机的，可以使用 [雷电 4.0 模拟器](https://github.com/dengzemiao/DZMAutojsTools/blob/main/ldplayerinst4_4.0.83.exe) 及以上版本，模拟器如果安装不上，也可以核对一下 `cpu` 类型是否支持。

- 分支信息：

  - `1.0.0` 分支使用的 `autojs 4.1.1`，虽然老版本，但是文档，获取难度低，但是好像无法打 `arm64-v8a`，只能打 `armeabi-v7a` 的包，所以需要看手机是否支持。

  - `1.0.1` 分支使用的 `autojs pro 9.3.11`，后续优化也是基于这个版本，支持 `armeabi-v7a` 与 `arm64-v8a` 打包。

- [钉钉测试视频](./hb_dd.mp4)、[微信测试视频](./hb_wx.mp4)，自行下载观看测试效果，界面效果如下：

  ![运行效果 1](demo1.png) ![运行效果 2](demo2.png)。
