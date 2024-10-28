// 项目信息：红包助手 2024-10-28 14:00:00
// 脚本版本：autojs 4.1.1
"ui";
// 权限处理
// 检查无障碍服务是否已经启用，如果没有启用则跳转到无障碍服务启用界面，并等待无障碍服务启动；当无障碍服务启动后脚本会继续运行。
// auto.waitFor();
// auto.setMode('fast');
// 检查悬浮窗权限
// if (!floatyCheckPermission()) {
//   // 提示
//   toast("本服务需要悬浮窗权限来显示悬浮窗，请在随后的界面中允许并重新运行本脚本。");
//   // 没有悬浮窗权限，提示用户并跳转请求
//   floatyRequestPermission();
//   // 退出
//   exit();
// }

// 日志
var isLog = true;
// App名称
var appName = '红包助手';
var appNameKey = 'hb_helper';
// 本地存储
var storage = storages.create(appNameKey);
// 查找红包弹层超时时间
var timeoutInterval = parseInt(storage.get('timeoutInterval') || 500);
// 查找红包详情页返回按钮超时时间
var backInterval = parseInt(storage.get('backInterval') || 500);
// 服务是否启动了
var isRun = false;
// 运行子线程
var thread = null;
// 辅助平台
var platform = parseInt(storage.get('platform') || 0);
// 版本
// var is411 = is411();

// ========================================= 《 公共 》

// 入口函数
function main() {
  // UI渲染
  ui.layout(
    <frame>
      <vertical>、
        <ScrollView>
          <vertical padding="16">
            <text text="【水哥哥的小帮手】" textSize="20sp" marginBottom="20" textColor="black" gravity="center" />
            <text textSize="16sp" textColor="black" text="辅助平台（切换需重启服务才会生效）"/>
            <radiogroup marginTop="10" id="radiogroup">
              <radio id="radio1" text="钉钉"/>
              <radio id="radio2" text="微信"/>
            </radiogroup>
            <text textSize="16sp" textColor="black" marginTop="10" text="查找红包弹层超时时间（毫秒）"/>
            <input hint="请输入" inputType="number" id="timeoutInterval"/>
            <text textSize="16sp" textColor="black" marginTop="10" text="查找红包详情页返回按钮超时时间（毫秒）"/>
            <input hint="请输入" inputType="number" id="backInterval"/>
            <button marginTop="20" id="submit" text="启动服务"/>
            <button marginTop="20" id="console" text="查看日志"/>
            {/* <button marginTop="20" id="consoleclear" text="清空日志"/> */}
            <text textSize="16sp" marginTop="20" textColor="#28A745" id="hint0" text="提示：1000毫秒 = 1秒。"/>
            <text textSize="16sp" marginTop="20" textColor="#28A745" id="hint0" text="步骤：启动服务后，自行打开【钉钉或微信】，进入需要抢红包的群聊天室内即可，抢红包期间不要打开日志面板，以免挡住脚本识别，日志主要用于排查错误。"/>
            <text textSize="16sp" marginTop="20" textColor="#FF4500" id="hint0" text="注意：所有的专属红包、个人1v1聊天室红包都不会抢，因为没必要抢，反正是你的，还减少计算量！"/>
            <text textSize="16sp" marginTop="20" textColor="#FF4500" id="hint0" text="注意：钉钉只抢群聊内普通拼手气红包、定时拼手气红包，会抢自己发的这两类红包。"/>
            <text textSize="16sp" marginTop="20" textColor="#FF4500" id="hint0" text="注意：微信只抢群聊内普通红包、拼手气红包，不会抢自己发的这两类红包。"/>
            <text textSize="16sp" marginTop="20" textColor="#28A745" id="hint0" text="提示：本服务需要悬浮窗权限、无障碍服务启动，推荐设置电池不优化白名单保活。根据要求，依次打开下面权限，才能正常使用，点击没跳转则多次点击尝试。"/>
            <text textSize="16sp" marginTop="20" textColor="#FF4500" id="hint1" text="【必选】1、启用无障碍服务。（点击）"/>
            <text textSize="16sp" marginTop="20" textColor="#FF4500" id="hint2" text="【必选】2、打开悬浮窗权限。（点击）"/>
            <text textSize="16sp" marginTop="20" textColor="#0000FF" id="hint3" paddingBottom="100" text="【建议】3、打开电池优化白名单。（点击）"/>
          </vertical>
        </ScrollView>
      </vertical>
    </frame>
  );
  // 设置查找红包弹层超时时间
  ui.timeoutInterval.setText(timeoutInterval + '');
  // 设置查找红包详情页返回按钮超时时间
  ui.backInterval.setText(backInterval + '');
  // 设置初始辅助平台
  if (!platform) { platform = ui.radio1.id; }
  ui.radiogroup.check(platform);
  // 点击无障碍服务
  ui.hint1.on("click", function() {
    autoRequestPermission();
  })
  // 点击悬浮窗权限
  ui.hint2.on("click", function() {
    floatyRequestPermission();
  });
  // 点击电池优化
  ui.hint3.on("click", function() {
    batteryOptimizationPage();
  });
  // 查看日志
  if (ui.console) {
    ui.console.on("click", function() {
      threads.start(function () {
        // 检查悬浮窗权限
        if (!checkFloatyPermission()) { return }
        // 打开与配置日志
        isLog = true
        console.hide();
        sleep(100);
        console.show();
        console.setTitle("日志");
        console.setPosition(240, 0);
      })
    });
  }
  // 清空日志
  if (ui.consoleclear) {
    ui.consoleclear.on("click", function() {
      threads.start(function () {
        console.clear();
      })
    });
  }
  // 点击启动
  ui.submit.on("click", function() {
    // 根据状态进行操作
    if (isRun) {
      // 停止服务
      stop();
    } else {
      // 获取查找红包弹层超时时间并存储
      timeoutInterval = parseInt(ui.timeoutInterval.getText() || 0);
      storage.put('timeoutInterval', timeoutInterval + '');
      // 获取查找红包详情页返回按钮超时时间并存储
      backInterval = parseInt(ui.backInterval.getText() || 0);
      storage.put('backInterval', backInterval + '');
      // 获取辅助平台并存储
      platform = ui.radiogroup.getCheckedRadioButtonId();
      storage.put('platform', platform + '');
      // 启动服务
      run();
    }
  });
}

// 创建悬浮窗
function createWindow () {
  // 创建悬浮窗
  var window = floaty.window(
    <frame>
      <button
        id="status"
        text="运行中"
        textColor="#FFFFFF"
        textSize="16sp"
        alpha="0"
        bg="#4CAF50"
        layout_width="80dp"
        layout_height="40dp"
      />
    </frame>
  );
  // visibility
  // 0：表示可见（visible）
  // 8：表示不可见（gone）
  // 4：不可见，但仍然占用位置（invisible）
  // window.status.visibility = 8; 
  // 设置背景
  // window.status.setBackground(createDrawable("#4CAF50"));
  // 延迟确保获得到按钮尺寸
  sleep(200);
  // 初始化悬浮窗位置到右上角（单位：dp）
  // 获取屏幕宽度和高度
  var screenWidth = device.width;
  // var screenHeight = device.height;
  // 获取悬浮窗的宽度和高度
  var windowWidth = window.status.getWidth();
  // var windowHeight = window.status.getHeight();
  // 计算屏幕中心坐标
  // var centerX = (screenWidth - windowWidth) / 2;
  // var centerY = (screenHeight - windowHeight) / 2;
  // 初始化悬浮窗位置到屏幕中心
  window.setPosition(screenWidth - windowWidth - 10, 5);
  // 设置按钮点击事件
  window.status.alpha = 0.9;
  // window.status.click(function () {
  //   // 打开当前应用
  //   try {
  //     app.launchPackage(context.getPackageName());
  //   } catch (error) {
  //     toast("打开应用失败");
  //   }
  // });
  // 初始化一些变量
  var x = 0, y = 0;
  var windowX, windowY;
  var downTime;
  // 设置拖动事件
  window.status.setOnTouchListener(function(view, event) {
    switch (event.getAction()) {
      case event.ACTION_DOWN:
        // 记录按下时的坐标和悬浮窗位置
        x = event.getRawX();
        y = event.getRawY();
        windowX = window.getX();
        windowY = window.getY();
        downTime = new Date().getTime();
        return true;
      case event.ACTION_MOVE:
        // 计算移动的距离并更新悬浮窗位置
        window.setPosition(windowX + (event.getRawX() - x), windowY + (event.getRawY() - y));
        return true;
      case event.ACTION_UP:
        // 如果按下和松开的时间短，认为是点击而非拖动
        if (new Date().getTime() - downTime < 200) {
          view.performClick();
        }
        return true;
    }
    return true;
  });
  // 返回悬浮窗
  return window
}

// 启动服务
function run() {
  // 启动
  if (!isRun) {
    // 子线程处理
    thread = threads.start(function () {
      try {
        // 检查无障碍服务权限
        if (!checkAutoPermission()) { return }
        // 检查悬浮窗权限
        if (!checkFloatyPermission()) { return }
        // 日志
        if (isLog) { console.info('>> 服务已启动'); }
        // 创建悬浮窗
        floaty.closeAll();
        createWindow();
        // 前台保活
        KeepAliveService.start(appNameKey, appName);
        // 切换启动状态
        isRun = true;
        // 更新文案，由于不能在子线程操作UI，所以要抛到UI线程执行
        ui.post(() => {
          ui.submit.setText("停止服务");
        });
        // 提示用户
        toast("服务已启动");
        // 根据平台类型执行辅助
        if (platform == ui.radio1.id) {
          // 开始钉钉抢红包
          dd_start();
        } else if (platform == ui.radio2.id) {
          // 开始微信抢红包
          wx_start();
        } else {
          // 都不支持，则停止服务
          stop();
        }
      } catch (error) {
        // 错误信息
        var message = (error && error.message) || '未知错误';

        // 方式一：
        // com.stardust.autojs.runtime.exception.ScriptInterruptedException：这个错误是子线程被中断准备退出报的错，不用管
        var ScriptInterruptedException = 'com.stardust.autojs.runtime.exception.ScriptInterruptedException';
        // 如果是白名单错误则不做处理
        if (message.includes(ScriptInterruptedException)) {
          // 不错处理
          if (isLog) { console.warn('>> 启动白名单错误：' + message); }
        } else {
          // 需要处理
          if (isLog) { console.error('>> 启动错误信息：' + message); }
          // 提示
          // toast(error);
          // 停止服务
          stop();
        }

        // 方式二：
        // // 日志
        // if (isLog) { console.error('>> 错误信息：' + message); }
        // // 提示
        // toast(error);
        // // 停止服务
        // stop();
      }
    });
  }
}

// 停止服务
function stop() {
  // 日志
  if (isLog) { console.info('>> 服务已停止'); }
  // 停止前台保活
  KeepAliveService.stop();
  // 停止子线程
  thread && thread.interrupt();
  thread = null;
  // 移除悬浮窗
  floaty.closeAll();
  // 设置启动状态
  isRun = false;
  // 更新文案，由于不能在子线程操作UI，所以要抛到UI线程执行
  ui.post(() => {
    ui.submit.setText("启动服务");
  });
  // 提示用户
  toast('服务已停止');
}

// 创建背景
// function createDrawable(color) {
//   var drawable = new android.graphics.drawable.GradientDrawable();
//   // drawable.setShape(android.graphics.drawable.GradientDrawable.OVAL); // 设置为圆形
//   drawable.setColor(colors.parseColor(color)); // 设置背景颜色
//   drawable.setStroke(5, colors.parseColor("#388E3C")); // 设置边框
//   return drawable;
// }

// 根据 desc 进行点击（在当前屏幕上）
function clickDesc(value) {
  // 查找
  const el = desc(value).findOne();
  // 点击
  return click(el.bounds().centerX(), el.bounds().centerY());
}

// 检查无障碍服务权限，没有则获取
function checkAutoPermission () {
  // 无障碍服务权限
  var isAuto = autoCheckPermission();
  // 处理
  if (isAuto) {
    // 日志
    if (isLog) { console.info('>> 无障碍权限：已授权'); }
  } else {
    // 日志
    if (isLog) { console.error('>> 无障碍权限：未授权，请授权后再启动'); }
    // 提示
    toast('请授权后再启动');
    // 开始授权
    auto("fast");
  }
  // 返回
  return isAuto
}

// 检查悬浮窗权限，没有则获取
function checkFloatyPermission () {
  // 悬浮窗权限
  var isFloaty = false
  // 悬浮窗权限
  // isFloaty = floaty.checkPermission()
  isFloaty = floatyCheckPermission()
  // 处理
  if (isFloaty) {
    // 日志
    if (isLog) { console.info('>> 悬浮窗权限：已授权'); }
  } else {
    // 日志
    if (isLog) { console.error('>> 悬浮窗权限：未授权，请授权后再启动'); }
    // 提示
    toast('请授权后再启动');
    // 开始授权
    // floaty.requestPermission();
    floatyRequestPermission();
  }
  // 返回
  return isFloaty
}

// 检查 4.1.1 版本
function is411() {
  return app.autojs.versionName.includes('4.1.1')
}

// 检查悬浮窗权限
function floatyCheckPermission () {
  var AppOpsManager = android.app.AppOpsManager;
  var ops = context.getSystemService(context.APP_OPS_SERVICE);
  var mode = ops.checkOpNoThrow(
    AppOpsManager.OPSTR_SYSTEM_ALERT_WINDOW,
    android.os.Process.myUid(),
    context.getPackageName()
  );
  return mode === AppOpsManager.MODE_ALLOWED;
}

// 请求悬浮窗权限
function floatyRequestPermission () {
  app.startActivity({
    action: "android.settings.action.MANAGE_OVERLAY_PERMISSION",
    data: "package:" + context.getPackageName()
  });
}

// 检查无障碍服务权限
function autoCheckPermission () {
  // 方式一：
  return !!auto.service;

  // 方式二：
  // var isService = false;
  // var context = activity;
  // try {
  //   var enabledServices = android.provider.Settings.Secure.getString(
  //     context.getContentResolver(),
  //     android.provider.Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
  //   );
  //   var myService = context.getPackageName() + "/com.stardust.autojs.core.accessibility.AccessibilityService";
  //   isService = !!(enabledServices && enabledServices.includes(myService));
  //   console.log(obj);
    
  // } catch (error) {
  //   var message = (error && error.message) || '未知错误';
  //   if (isLog) { console.error('>> 检测无障碍权限错误：' + message); }
  // }
  // return isService;
}

// 请求无障碍服务权限
function autoRequestPermission() {
  app.startActivity({
    action: "android.settings.ACCESSIBILITY_SETTINGS"
  });
}

// 电池优化页面
function batteryOptimizationPage() {
  app.startActivity({
    action: "android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS"
  });
}

// 前台服务保活
let KeepAliveService = {
  // 开启
  start: function (id, title) {
    try {
      id = id || "";
      let channel_id = id + ".foreground";
      let channel_name = title + " 前台服务通知";
      let content_title = title + " 正在运行中";
      let content_text = "请勿手动移除该通知";
      let ticker = title + "已启动";
      let manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);
      let notification;
      let icon = context.getResources().getIdentifier("ic_3d_rotation_black_48dp", "drawable", context.getPackageName());
      if (device.sdkInt >= 26) {
        let channel = new android.app.NotificationChannel(channel_id, channel_name, android.app.NotificationManager.IMPORTANCE_DEFAULT);
        channel.enableLights(true);
        channel.setLightColor(0xff0000);
        channel.setShowBadge(false);
        manager.createNotificationChannel(channel);
        notification = new android.app.Notification.Builder(context, channel_id).setContentTitle(content_title).setContentText(content_text).setWhen(new Date().getTime()).setSmallIcon(icon).setTicker(ticker).setOngoing(true).build();
      } else {
        notification = new android.app.Notification.Builder(context).setContentTitle(content_title).setContentText(content_text).setWhen(new Date().getTime()).setSmallIcon(icon).setTicker(ticker).build();
      }
      manager.notify(1, notification);
    } catch (error) {
      console.warn("前台保活服务启动失败:" + error);
      console.warn("保活服务启动失败,不影响辅助的正常运行,继续挂机即可.");
    }
  },
  // 停止
  stop: function () {    
    let manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);
    manager.cancelAll();
  }
};

// ========================================= 《 钉钉红包 》

// 开始钉钉抢红包
function dd_start() {
  // 查找普通红包
  var hb = dd_find_hb(1);
  // 没有红包
  if (!hb) {
    // 查找定时红包
    hb = dd_find_timed_hb(1);
  }
  // 日志
  // if (isLog) { console.info('>> 红包: ' + (!!hb ? '有' : '无')); }
  // 如果有红包
  if (hb) {
    // 点击拼手气红包
    click(hb.bounds().centerX(), hb.bounds().centerY());
    // 查找并点击红包弹层打开红包
    dd_click_hb_pop_btn(timeoutInterval, (hb_btn) => {
      // 找到按钮才需要继续
      if (!!hb_btn) {
        // 查找并点击返回按钮
        dd_click_hb_detail_back(backInterval);
      }
    });
    // 重新开始
    dd_start();
  } else {
    // 查找并点击红包弹层打开红包
    dd_click_hb_pop_btn(100, (hb_btn) => {
      // 没找到才需要继续
      if (!hb_btn) {
        // 查找并点击红包详情页返回按钮
        dd_click_hb_detail_back(1, (detail_btn) => {
          // 没找到才需要继续
          if (!detail_btn) {
            // 查找并点击【专享】红包详情页返回按钮
            dd_click_exclusive_hb_detail_back(1);
          }
        });
      }
    });
    // 重新开始
    dd_start();
  }
}

// 点击红包弹层打开红包
function dd_click_hb_pop_btn (timeout, result) {
  // 找到红包弹层点击按钮
  var hb_btn = dd_find_hb_pop_btn(timeout);
  // 如果找到了
  if (hb_btn) {
    // 点击
    click(hb_btn.bounds().centerX(), hb_btn.bounds().centerY());
  }
  // 回调
  if (result) { result(hb_btn) }
}

// 点击红包详情页返回按钮
function dd_click_hb_detail_back (timeout, result) {
  // 进入了红包详情页
  var hb_detail = dd_find_hb_detail(timeout);
  // 返回按钮
  var back = null
  // 如果找到了
  if (hb_detail) {
    // 点击返回
    back = dd_find_hb_detail_back(timeout);
    // 点击
    click(back.bounds().centerX(), back.bounds().centerY());
  }
  // 回调
  if (result) { result(back) }
}

// 点击专享红包详情页返回按钮
function dd_click_exclusive_hb_detail_back (timeout, result) {
  // 进入了专享红包详情页
  var hb_detail = dd_find_exclusive_hb_detail(timeout);
  // 返回按钮
  var back = null
  // 如果找到了
  if (hb_detail) {
    // 点击返回
    back = dd_find_hb_detail_back(timeout);
    // 点击
    click(back.bounds().centerX(), back.bounds().centerY());
  }
  // 回调
  if (result) { result(back) }
}

// 找到拼手气红包
function dd_find_hb(timeout) {
  // 查找
  var hb = text('拼手气红包').findOne(timeout);
  // 如果找到了且 id 必须为 tv_redpackets_type 才算拼手气红包
  if (hb && !hb.id().includes('tv_redpackets_type')) {
    hb = null
  }
  // 返回
  return hb
}

// 找到定时红包
function dd_find_timed_hb (timeout) {
  return id("pick").findOne(timeout);
}

// 找到红包弹层打开红包按钮
function dd_find_hb_pop_btn (timeout) {
  return id("iv_pick_bottom").findOne(timeout);
}

// 进入了红包详情页
function dd_find_hb_detail (timeout) {
  // 尝试找到 id 为 redpackets_picked_detail 的元素，确保以及到了红包详情页
  return id("redpackets_picked_detail").findOne(timeout);
}

// 进入了专享红包详情页
function dd_find_exclusive_hb_detail (timeout) {
  // 尝试找到 id 为 receiver_list 的元素，确保以及到了专享红包详情页
  return id("receiver_list").findOne(timeout);
}

// 找到红包详情页返回按钮
function dd_find_hb_detail_back (timeout) {
  return desc("返回").findOne(timeout);
}

// ========================================= 《 微信红包 》

// 开始微信抢红包
function wx_start() {
  // 页面上别人发的且没有被领取的红包
  var hb = wx_find_hb();
  // 输出日志
  // if (isLog) { console.info('>> 红包: ' + (!!hb ? '有' : '无')); }
  // 如果有红包
  if (hb) {
    // 点击拼手气红包
    click(hb.bounds().centerX(), hb.bounds().centerY());
    // 查找并点击红包弹层打开红包
    wx_click_hb_pop_btn(timeoutInterval, (hb_btn) => {
      // 找到按钮才需要继续
      if (!!hb_btn) {
        // 查找并点击返回按钮
        wx_click_hb_detail_back(backInterval);
      }
    });
    // 重新开始
    wx_start();
  } else {
    // 查找并点击红包弹层打开红包
    wx_click_hb_pop_btn(1, (hb_btn) => {
      // 没找到才需要继续
      if (!hb_btn) {
        // 查找并点击返回按钮
        wx_click_hb_detail_back(1, (detail_btn) => {
          // 没找到才需要继续
          if (!detail_btn) {
            // 查找并点击红包弹层关闭按钮
            wx_click_hb_pop_close_btn(1);
          }
        });
      }
    });
    // 重新开始
    wx_start();
  }
}

// 页面上别人发的红包列表
function wx_find_hbs () {
  return id("b4t").find();
}

// 页面上别人发的且没有被领取的红包
function wx_find_hb () {
  // 获取页面上别人发的红包
  var hb = null
  // 获取页面上别人发的红包列表
  var hbs = wx_find_hbs();
  // 便利红包是否被领取
  hbs.some((item, index) => {
    // 是否被领取
    var a3ms = item.find(id('a3m'))
    // 状态
    var isReceive = !!a3ms.length
    // 没有被领取
    if (!isReceive) {
      // 记录
      hb = item
    }
    // 停止便利
    return !isReceive
  })
  // 返回
  return hb
}

// 点击红包弹层关闭按钮
function wx_click_hb_pop_close_btn (timeout, result) {
  // 找到红包弹层点击按钮
  var hb_pop_close_btn = wx_find_hb_pop_close_btn(timeout);
  // 如果找到了
  if (hb_pop_close_btn) {
    // 点击
    click(hb_pop_close_btn.bounds().centerX(), hb_pop_close_btn.bounds().centerY());
  }
  // 回调
  if (result) { result(hb_pop_close_btn) }
}

// 点击红包弹层打开红包
function wx_click_hb_pop_btn (timeout, result) {
  // 找到红包弹层点击按钮
  var hb_btn = wx_find_hb_pop_btn(timeout);
  // 如果找到了
  if (hb_btn) {
    // 点击
    click(hb_btn.bounds().centerX(), hb_btn.bounds().centerY());
  }
  // 回调
  if (result) { result(hb_btn) }
}

// 点击红包详情页返回按钮
function wx_click_hb_detail_back (timeout, result) {
  // 进入了红包详情页
  var hb_detail = wx_find_hb_detail(timeout);
  // 返回按钮
  var back = null
  // 如果找到了
  if (hb_detail) {
    // 点击返回
    back = wx_find_hb_detail_back(timeout);
    // 点击
    click(back.bounds().centerX(), back.bounds().centerY());
  }
  // 回调
  if (result) { result(back) }
}

// 找到红包详情页返回按钮
function wx_find_hb_detail_back (timeout) {
  return id("nnc").findOne(timeout);
}

// 进入了红包详情页
function wx_find_hb_detail (timeout) {
  return id("j0k").findOne(timeout);
}

// 找到红包弹层打开红包按钮
function wx_find_hb_pop_btn (timeout) {
  return id("j6g").findOne(timeout);
}

// 找到红包弹层关闭按钮
function wx_find_hb_pop_close_btn (timeout) {
  return id("j6f").findOne(timeout);
}

// ========================================= 《 启动 》

// 调用
main();
// 单独调试
// threads.start(function () {
//   // 钉钉抢红包
//   dd_start();
//   // 微信抢红包
//   // wx_start();
// })


