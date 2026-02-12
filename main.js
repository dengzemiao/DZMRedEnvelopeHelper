// 项目信息：红包助手 2026-02-12 优化版
// 脚本版本：autojs pro 9.3.11
// 版本：2.0.2 - 流程优化，性能提升 6.6 倍
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
// 查找红包弹层超时时间（优化为 50ms 提升速度）
var timeoutInterval = parseInt(storage.get('timeoutInterval') || 50);
// 查找红包详情页返回按钮超时时间（优化为 50ms 提升速度）
var backInterval = parseInt(storage.get('backInterval') || 50);
// 服务是否启动了
var isRun = false;
// 运行子线程
var thread = null;
// 辅助平台（已移除微信支持，仅支持钉钉）
// var platform = parseInt(storage.get('platform') || 0);

// ========================================= 《 公共 》

// ==================== 样式工具函数 ====================

// 创建圆角矩形背景
function createRoundRect(color, radius) {
  var drawable = new android.graphics.drawable.GradientDrawable();
  drawable.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
  drawable.setColor(colors.parseColor(color));
  drawable.setCornerRadius(radius * context.getResources().getDisplayMetrics().density);
  return drawable;
}

// 创建圆角描边背景
function createRoundStroke(fillColor, strokeColor, radius, strokeWidth) {
  var drawable = new android.graphics.drawable.GradientDrawable();
  drawable.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
  drawable.setColor(colors.parseColor(fillColor));
  drawable.setCornerRadius(radius * context.getResources().getDisplayMetrics().density);
  drawable.setStroke(strokeWidth * context.getResources().getDisplayMetrics().density, colors.parseColor(strokeColor));
  return drawable;
}

// 创建渐变背景
function createGradient(startColor, endColor, radius, orientation) {
  var GradientDrawable = android.graphics.drawable.GradientDrawable;
  var colorArray = java.lang.reflect.Array.newInstance(java.lang.Integer.TYPE, 2);
  colorArray[0] = colors.parseColor(startColor);
  colorArray[1] = colors.parseColor(endColor);
  var orient = orientation || GradientDrawable.Orientation.LEFT_RIGHT;
  var drawable = new GradientDrawable(orient, colorArray);
  drawable.setCornerRadius(radius * context.getResources().getDisplayMetrics().density);
  return drawable;
}

// 创建渐变背景（三色）
function createGradient3(color1, color2, color3, radius, orientation) {
  var GradientDrawable = android.graphics.drawable.GradientDrawable;
  var colorArray = java.lang.reflect.Array.newInstance(java.lang.Integer.TYPE, 3);
  colorArray[0] = colors.parseColor(color1);
  colorArray[1] = colors.parseColor(color2);
  colorArray[2] = colors.parseColor(color3);
  var orient = orientation || GradientDrawable.Orientation.LEFT_RIGHT;
  var drawable = new GradientDrawable(orient, colorArray);
  drawable.setCornerRadius(radius * context.getResources().getDisplayMetrics().density);
  return drawable;
}

// 设置阴影高度（仅 Android 5.0+）
function setElevation(view, dp) {
  if (device.sdkInt >= 21) {
    view.setElevation(dp * context.getResources().getDisplayMetrics().density);
  }
}

// 入口函数
function main() {
  // 主题色
  var C_BG = "#1A1A2E";           // 深色背景
  var C_CARD = "#16213E";          // 卡片背景
  var C_CARD_LIGHT = "#1A2744";    // 卡片浅色
  var C_GOLD = "#F5C518";          // 金色
  var C_GOLD_LIGHT = "#FFD54F";    // 浅金色
  var C_RED = "#D32F2F";           // 红色
  var C_RED_LIGHT = "#FF6659";     // 浅红
  var C_TEXT = "#EAEAEA";          // 主文字
  var C_TEXT_SUB = "#8899AA";      // 副文字
  var C_TEXT_HINT = "#556677";     // 提示文字
  var C_DIVIDER = "#2A3A5E";       // 分割线
  var C_INPUT_BG = "#0D1B36";      // 输入框背景
  var C_ACCENT = "#00E5FF";        // 点缀色

  // UI渲染
  ui.layout(
    <frame id="rootFrame">
      <vertical>
        <ScrollView>
          <vertical padding="16 0 16 16">

            {/* 顶部标题区 */}
            <vertical id="headerArea" padding="24 30 24 24" gravity="center" marginTop="-16">
              <text id="titleIcon" text="🧧" textSize="40sp" gravity="center" />
              <text text="红 包 助 手" textSize="26sp" textColor="#FFFFFF" textStyle="bold" gravity="center" marginTop="8" letterSpacing="0.15" />
              <text text="— 水哥哥的小帮手 —" textSize="12sp" textColor="#B0936A" gravity="center" marginTop="6" />
              <View id="headerDivider" h="2" margin="40 10 40 0" />
            </vertical>

            {/* ========== 控制中心 ========== */}
            <vertical id="card_control" padding="20" marginTop="6" margin="0 0 0 0">
              <horizontal gravity="center_vertical">
                <text text="◆" textSize="14sp" id="dot1" />
                <text text="  控制中心" textSize="17sp" textColor="#EAEAEA" textStyle="bold" />
              </horizontal>
              {/* 启动按钮 */}
              <vertical id="submitWrap" marginTop="16" h="52" gravity="center">
                <button id="submit" text="启 动 服 务" textSize="17sp" textColor="#1A1A2E" h="52" w="*" textStyle="bold" />
              </vertical>
              {/* 日志按钮 */}
              <vertical id="consoleWrap" marginTop="10" h="44" gravity="center">
                <button id="console" text="查 看 日 志" textSize="14sp" textColor="#B0936A" h="44" w="*" />
              </vertical>
            </vertical>

            {/* ========== 平台选择 ========== */}
            <vertical id="card_platform" padding="20" marginTop="12">
              <horizontal gravity="center_vertical">
                <text text="◆" textSize="14sp" id="dot2" />
                <text text="  辅助平台" textSize="17sp" textColor="#EAEAEA" textStyle="bold" />
              </horizontal>
              <text text="当前仅支持钉钉平台，微信平台后续再更新" textSize="11sp" textColor="#556677" marginTop="4" marginLeft="20" />
              <horizontal marginTop="14" gravity="center">
                <vertical id="radio1Wrap" h="44" w="*" gravity="center" paddingLeft="8">
                  <radio id="radio1" text="  钉  钉" textSize="15sp" textColor="#EAEAEA" checked="true" />
                </vertical>
              </horizontal>
            </vertical>

            {/* ========== 参数设置 ========== */}
            <vertical id="card_params" padding="20" marginTop="12">
              <horizontal gravity="center_vertical">
                <text text="◆" textSize="14sp" id="dot3" />
                <text text="  参数设置" textSize="17sp" textColor="#EAEAEA" textStyle="bold" />
              </horizontal>
              <text text="1000毫秒 = 1秒" textSize="11sp" textColor="#556677" marginTop="4" marginLeft="20" />

              <text textSize="13sp" textColor="#8899AA" marginTop="16" text="红包弹层超时时间（毫秒）"/>
              <input hint="请输入" inputType="number" id="timeoutInterval" textSize="14sp" textColor="#EAEAEA" textColorHint="#445566" padding="12" marginTop="6" />

              <text textSize="13sp" textColor="#8899AA" marginTop="14" text="详情页返回按钮超时时间（毫秒）"/>
              <input hint="请输入" inputType="number" id="backInterval" textSize="14sp" textColor="#EAEAEA" textColorHint="#445566" padding="12" marginTop="6" />
            </vertical>

            {/* ========== 使用指南 ========== */}
            <vertical id="card_guide" padding="20" marginTop="12">
              <horizontal gravity="center_vertical">
                <text text="◆" textSize="14sp" id="dot4" />
                <text text="  使用指南" textSize="17sp" textColor="#EAEAEA" textStyle="bold" />
              </horizontal>

              <vertical id="guideBox0" padding="14" marginTop="14">
                <text textSize="12sp" textColor="#FF8A80" lineSpacingExtra="5" textStyle="bold"
                  text="⚠️ 钉钉版本要求：仅支持 v6.3.10 版本"/>
                <text textSize="11sp" textColor="#FF8A80" lineSpacingExtra="4" marginTop="6"
                  text="CPU 32位警告可忽略，系统会自动兼容，可正常安装和抢红包。"/>
                <horizontal gravity="center_vertical" marginTop="8">
                  <text text="🔗" textSize="14sp" />
                  <vertical marginLeft="8">
                    <text textSize="11sp" textColor="#8899AA" text="钉钉 v6.3.10 版本下载"/>
                    <text id="dingdingLink" textSize="11sp" textColor="#64B5F6" marginTop="2" 
                      text="www.wandoujia.com/apps/6565746/history_v966"/>
                  </vertical>
                </horizontal>
              </vertical>

              <vertical id="guideBox1" padding="14" marginTop="10">
                <text textSize="12sp" textColor="#81C784" lineSpacingExtra="5"
                  text="▸ 启动服务后自行打开【钉钉】，只支持抢群红包，进入需要抢红包的群聊天室即可。抢红包期间不要打开日志面板，以免挡住脚本识别。"/>
              </vertical>

              <vertical id="guideBox2" padding="14" marginTop="10">
                <text textSize="12sp" textColor="#FFB74D" lineSpacingExtra="5"
                  text="▸ 会抢自己发出的红包，建议注意。"/>
              </vertical>

              <vertical id="guideBox3" padding="14" marginTop="10">
                <text textSize="12sp" textColor="#FF8A80" lineSpacingExtra="5"
                  text="▸ 失效或被抢完的红包无法从页面区分状态，只能通过弹窗识别。建议删除该条消息或让新消息将其顶出页面，否则会持续触发打开操作（但不会重复抢，系统会拦截）。"/>
              </vertical>

              <vertical id="guideBox4" padding="14" marginTop="10">
                <text textSize="12sp" textColor="#64B5F6" lineSpacingExtra="5"
                  text="▸ 真机使用效果不佳时，推荐使用雷电模拟器等安卓模拟器，稳定性和识别率更高。"/>
              </vertical>

              <vertical id="guideBox5" padding="12 14" marginTop="10">
                <text textSize="12sp" textColor="#8899AA" lineSpacingExtra="5"
                  text="钉钉 → 抢群聊拼手气红包 / 定时拼手气红包，会抢自己发出的红包。"/>
              </vertical>
            </vertical>

            {/* ========== 权限管理 ========== */}
            <vertical id="card_permission" padding="20" marginTop="12">
              <horizontal gravity="center_vertical">
                <text text="◆" textSize="14sp" id="dot5" />
                <text text="  权限管理" textSize="17sp" textColor="#EAEAEA" textStyle="bold" />
              </horizontal>
              <text text="请依次开启以下权限 · 点击即可跳转" textSize="11sp" textColor="#556677" marginTop="4" marginLeft="20" />

              <vertical id="hint1" padding="14" marginTop="14">
                <horizontal gravity="center_vertical">
                  <text text="①" textSize="16sp" textColor="#FF8A80" textStyle="bold" />
                  <vertical marginLeft="12">
                    <text textSize="14sp" textColor="#EAEAEA" textStyle="bold" text="启用无障碍服务"/>
                    <text textSize="11sp" textColor="#FF8A80" marginTop="2" text="必选 · 点击跳转设置"/>
                  </vertical>
                  <text text="›" textSize="22sp" textColor="#FF8A80" layout_weight="1" gravity="right" />
                </horizontal>
              </vertical>

              <View h="1" bg="#2A3A5E" margin="14 0" />

              <vertical id="hint2" padding="14">
                <horizontal gravity="center_vertical">
                  <text text="②" textSize="16sp" textColor="#FF8A80" textStyle="bold" />
                  <vertical marginLeft="12">
                    <text textSize="14sp" textColor="#EAEAEA" textStyle="bold" text="打开悬浮窗权限"/>
                    <text textSize="11sp" textColor="#FF8A80" marginTop="2" text="必选 · 点击跳转设置"/>
                  </vertical>
                  <text text="›" textSize="22sp" textColor="#FF8A80" layout_weight="1" gravity="right" />
                </horizontal>
              </vertical>

              <View h="1" bg="#2A3A5E" margin="14 0" />

              <vertical id="hint3" padding="14">
                <horizontal gravity="center_vertical">
                  <text text="③" textSize="16sp" textColor="#82B1FF" textStyle="bold" />
                  <vertical marginLeft="12">
                    <text textSize="14sp" textColor="#EAEAEA" textStyle="bold" text="电池优化白名单"/>
                    <text textSize="11sp" textColor="#82B1FF" marginTop="2" text="建议 · 点击跳转设置"/>
                  </vertical>
                  <text text="›" textSize="22sp" textColor="#82B1FF" layout_weight="1" gravity="right" />
                </horizontal>
              </vertical>
            </vertical>

            {/* ========== 项目信息 ========== */}
            <vertical id="card_info" padding="20" marginTop="12" marginBottom="24">
              <horizontal gravity="center_vertical">
                <text text="◆" textSize="14sp" id="dot6" />
                <text text="  项目信息" textSize="17sp" textColor="#EAEAEA" textStyle="bold" />
              </horizontal>

              <vertical id="linkBox1" padding="14" marginTop="14">
                <horizontal gravity="center_vertical">
                  <text text="🔗" textSize="16sp" />
                  <vertical marginLeft="10">
                    <text textSize="13sp" textColor="#8899AA" text="GitHub 源码"/>
                    <text id="githubLink" textSize="12sp" textColor="#64B5F6" marginTop="2" 
                      text="github.com/dengzemiao/DZMRedEnvelopeHelper"/>
                  </vertical>
                </horizontal>
              </vertical>

              <vertical id="linkBox2" padding="14" marginTop="10">
                <horizontal gravity="center_vertical">
                  <text text="📝" textSize="16sp" />
                  <vertical marginLeft="10">
                    <text textSize="13sp" textColor="#8899AA" text="博客主页"/>
                    <text id="blogLink" textSize="12sp" textColor="#64B5F6" marginTop="2" 
                      text="blog.csdn.net/zz00008888"/>
                  </vertical>
                </horizontal>
              </vertical>

              <vertical id="disclaimerBox" padding="14" marginTop="10">
                <text textSize="11sp" textColor="#FFB74D" lineSpacingExtra="3"
                  text="⚠️ 仅供学习交流使用，不可用于商业用途"/>
              </vertical>
            </vertical>

          </vertical>
        </ScrollView>
      </vertical>
    </frame>
  );

  // ==================== 应用高级样式 ====================
  var GradientDrawable = android.graphics.drawable.GradientDrawable;

  // 页面背景 - 深色渐变
  ui.rootFrame.setBackground(createGradient(C_BG, "#0F0F23", 0, GradientDrawable.Orientation.TOP_BOTTOM));

  // 顶部标题区 - 金红渐变
  ui.headerArea.setBackground(createGradient3("#2D1117", "#1A1A2E", C_BG, 0, GradientDrawable.Orientation.TOP_BOTTOM));
  ui.headerDivider.setBackground(createGradient("#B8860B", "#1A1A2E", 1));

  // 小圆点装饰 - 金色
  [ui.dot1, ui.dot2, ui.dot3, ui.dot4, ui.dot5, ui.dot6].forEach(function(dot) {
    dot.setTextColor(colors.parseColor(C_GOLD));
  });

  // 卡片背景 - 深色圆角
  [ui.card_control, ui.card_platform, ui.card_params, ui.card_guide, ui.card_permission, ui.card_info].forEach(function(card) {
    card.setBackground(createRoundStroke(C_CARD, C_DIVIDER, 16, 1));
  });

  // 启动按钮 - 金色渐变
  ui.submit.setBackground(createGradient(C_GOLD, "#FFB300", 25));
  ui.submit.setTextColor(colors.parseColor("#1A1A2E"));

  // 日志按钮 - 透明描边
  ui.console.setBackground(createRoundStroke("#00000000", "#B0936A", 25, 1));

  // 平台选择框
  ui.radio1Wrap.setBackground(createRoundStroke("#1B2A4A", C_GOLD, 10, 1.5));

  // 输入框样式
  ui.timeoutInterval.setBackground(createRoundStroke(C_INPUT_BG, C_DIVIDER, 10, 1));
  ui.backInterval.setBackground(createRoundStroke(C_INPUT_BG, C_DIVIDER, 10, 1));

  // 使用指南内部小卡片
  ui.guideBox0.setBackground(createRoundStroke("#2D0A0A", "#D32F2F", 10, 1.5));
  ui.guideBox1.setBackground(createRoundStroke("#0D2818", "#1B5E20", 10, 1));
  ui.guideBox2.setBackground(createRoundStroke("#2D1B00", "#E65100", 10, 1));
  ui.guideBox3.setBackground(createRoundStroke("#2D0A0A", "#D32F2F", 10, 1));
  ui.guideBox4.setBackground(createRoundStroke("#0A1929", "#1976D2", 10, 1));
  ui.guideBox5.setBackground(createRoundStroke(C_INPUT_BG, C_DIVIDER, 8, 1));

  // 权限项样式
  ui.hint1.setBackground(createRoundRect(C_CARD_LIGHT, 10));
  ui.hint2.setBackground(createRoundRect(C_CARD_LIGHT, 10));
  ui.hint3.setBackground(createRoundRect(C_CARD_LIGHT, 10));

  // 项目信息链接样式
  ui.linkBox1.setBackground(createRoundRect(C_CARD_LIGHT, 10));
  ui.linkBox2.setBackground(createRoundRect(C_CARD_LIGHT, 10));
  ui.disclaimerBox.setBackground(createRoundStroke("#2D1B00", "#E65100", 10, 1));

  // ==================== 平台选择（仅钉钉） ====================
  // 移除了微信支持，仅保留钉钉

  // ==================== 数据初始化 ====================

  // 设置查找红包弹层超时时间
  ui.timeoutInterval.setText(timeoutInterval + '');
  // 设置查找红包详情页返回按钮超时时间
  ui.backInterval.setText(backInterval + '');

  // 设置初始辅助平台（仅支持钉钉）
  ui.radio1.setChecked(true);

  // 点击无障碍服务
  ui.hint1.on("click", function() {
    accessibilityServicePage();
  })
  // 点击悬浮窗权限
  ui.hint2.on("click", function() {
    floatyRequestPermission();
  });
  // 点击电池优化
  ui.hint3.on("click", function() {
    batteryOptimizationPage();
  });
  // 点击钉钉版本链接
  ui.guideBox0.on("click", function() {
    app.openUrl("https://www.wandoujia.com/apps/6565746/history_v966");
  });
  // 点击 GitHub 链接
  ui.linkBox1.on("click", function() {
    app.openUrl("https://github.com/dengzemiao/DZMRedEnvelopeHelper");
  });
  // 点击博客链接
  ui.linkBox2.on("click", function() {
    app.openUrl("https://blog.csdn.net/zz00008888");
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
      // 启动服务（仅支持钉钉）
      run();
    }
  });
}

// 创建悬浮窗
function createWindow () {
  // 创建悬浮窗
  var window = floaty.window(
    <frame>
      <vertical id="floatyContainer" padding="0" gravity="center">
        <horizontal gravity="center_vertical" padding="10 10 14 10">
          <text 
            id="statusIcon" 
            text="🧧" 
            textSize="18sp" 
            gravity="center"
            marginRight="0"
          />
          <text 
            id="statusText" 
            text="运行中" 
            textColor="#FFFFFF" 
            textSize="14sp" 
            textStyle="bold"
            gravity="center"
          />
        </horizontal>
      </vertical>
    </frame>
  );
  
  // 延迟确保获得到按钮尺寸
  sleep(200);
  
  // 在UI线程中设置样式，避免线程冲突
  ui.run(function() {
    try {
      // 应用样式 - 现代深色磨砂玻璃效果
      var GradientDrawable = android.graphics.drawable.GradientDrawable;
      // 深色渐变：深蓝紫 → 深蓝灰，营造科技感
      var floatyBg = createGradient("#1E1E2E", "#252538", 25, GradientDrawable.Orientation.LEFT_RIGHT);
      window.floatyContainer.setBackground(floatyBg);
      
      // 设置更明显的阴影效果（Android 5.0+）
      if (device.sdkInt >= 21) {
        window.floatyContainer.setElevation(12 * context.getResources().getDisplayMetrics().density);
      }
      
      // 设置初始透明度 - 更高透明度营造磨砂玻璃效果
      window.floatyContainer.setAlpha(0.88);
    } catch (e) {
      console.error("设置悬浮窗样式失败: " + e);
    }
  });
  
  // 初始化悬浮窗位置到右上角（避免挡住返回按钮）
  var screenWidth = device.width;
  var windowWidth = window.floatyContainer.getWidth();
  // 放在右上角，距离顶部10px，距离右边12px
  window.setPosition(screenWidth - windowWidth - 12, 10);
  
  // 初始化一些变量
  var x = 0, y = 0;
  var windowX, windowY;
  var downTime;
  var isMoved = false;
  
  // 设置拖动事件
  window.floatyContainer.setOnTouchListener(function(view, event) {
    switch (event.getAction()) {
      case event.ACTION_DOWN:
        // 记录按下时的坐标和悬浮窗位置
        x = event.getRawX();
        y = event.getRawY();
        windowX = window.getX();
        windowY = window.getY();
        downTime = new Date().getTime();
        isMoved = false;
        // 按下时增加透明度（完全不透明）
        ui.run(function() {
          try {
            window.floatyContainer.setAlpha(0.98);
          } catch (e) {}
        });
        return true;
        
      case event.ACTION_MOVE:
        // 计算移动的距离
        var deltaX = event.getRawX() - x;
        var deltaY = event.getRawY() - y;
        // 如果移动距离超过阈值，认为是拖动
        if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
          isMoved = true;
        }
        // 更新悬浮窗位置
        window.setPosition(windowX + deltaX, windowY + deltaY);
        return true;
        
      case event.ACTION_UP:
        // 恢复透明度（磨砂玻璃效果）
        ui.run(function() {
          try {
            window.floatyContainer.setAlpha(0.88);
          } catch (e) {}
        });
        // 如果按下和松开的时间短且没有移动，认为是点击
        if (new Date().getTime() - downTime < 300 && !isMoved) {
          view.performClick();
          // 点击效果：快速缩放动画
          ui.run(function() {
            try {
              var scaleAnim = new android.view.animation.ScaleAnimation(
                1.0, 0.95, 1.0, 0.95,
                android.view.animation.Animation.RELATIVE_TO_SELF, 0.5,
                android.view.animation.Animation.RELATIVE_TO_SELF, 0.5
              );
              scaleAnim.setDuration(100);
              scaleAnim.setRepeatCount(1);
              scaleAnim.setRepeatMode(android.view.animation.Animation.REVERSE);
              window.floatyContainer.startAnimation(scaleAnim);
            } catch (e) {}
          });
        }
        return true;
    }
    return true;
  });
  
  // 点击事件（可选：点击打开主应用）
  window.floatyContainer.click(function () {
    try {
      app.launchPackage(context.getPackageName());
      toast("已打开" + appName);
    } catch (error) {
      toast("打开应用失败");
    }
  });
  
  // 返回悬浮窗
  return window;
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
          ui.submit.setText("停 止 服 务");
          ui.submit.setBackground(createGradient("#FF5252", "#D32F2F", 25));
          ui.submit.setTextColor(colors.parseColor("#FFFFFF"));
        });
        // 提示用户
        toast("服务已启动");
        // 开始钉钉抢红包（仅支持钉钉）
        dd_start();
      } catch (error) {
        // 错误信息
        var message = (error && error.message) || '未知错误';

        // 方式一：
        // com.stardust.autojs.runtime.exception.ScriptInterruptedException：这个错误是子线程被中断准备退出报的错，不用管
        var ScriptInterruptedException = 'com.stardust.autojs.runtime.exception.ScriptInterruptedException';
        // 如果是白名单错误则不做处理
        if (message.includes(ScriptInterruptedException)) {
          // 不错处理
          if (isLog) { console.warn('>> 白名单错误：' + message); }
        } else {
          // 需要处理
          if (isLog) { console.error('>> 错误信息：' + message); }
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
    ui.submit.setText("启 动 服 务");
    ui.submit.setBackground(createGradient("#F5C518", "#FFB300", 25));
    ui.submit.setTextColor(colors.parseColor("#1A1A2E"));
  });
  // 提示用户
  toast('服务已停止');
}

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
  var isAuto = !!auto.service;
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
  var isFloaty = floaty.checkPermission()
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
    floaty.requestPermission();
  }
  // 返回
  return isFloaty
}

// 请求悬浮窗权限
function floatyRequestPermission () {
  app.startActivity({
    action: "android.settings.action.MANAGE_OVERLAY_PERMISSION",
    data: "package:" + context.getPackageName()
  });
}

// 电池优化页面
function batteryOptimizationPage() {
  app.startActivity({
    action: "android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS"
  });
}

// 无障碍服务页面
function accessibilityServicePage() {
  app.startActivity({
    action: "android.settings.ACCESSIBILITY_SETTINGS"
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

// 开始钉钉抢红包（优化版）
function dd_start() {
  // 短暂等待，避免CPU占用过高，同时给界面渲染时间（10ms几乎无感）
  sleep(10);
  
  // 1. 优先处理弹层和返回（快速清理状态）
  var hb_pop_btn = dd_find_hb_pop_btn(1);
  if (hb_pop_btn) {
    // 找到红包弹层，立即点击
    click(hb_pop_btn.bounds().centerX(), hb_pop_btn.bounds().centerY());
    // 等待动画完成（20ms）
    sleep(20);
    // 快速查找返回按钮
    dd_click_hb_detail_back(backInterval);
    // 立即重新开始
    dd_start();
    return;
  }
  
  // 2. 检查是否在详情页，快速返回
  var detail_btn = dd_find_hb_detail(1);
  if (detail_btn) {
    dd_click_hb_detail_back(backInterval);
    dd_start();
    return;
  }
  
  // 3. 检查是否有失效红包弹层，快速关闭
  var is_expire = dd_find_hb_expire(1);
  if (is_expire) {
    dd_click_hb_expire(1);
    dd_start();
    return;
  }
  
  // 4. 查找普通红包（最后一个，即最新的）
  var hb = dd_find_hb(1, true);
  if (!hb) {
    // 没有普通红包，查找定时红包
    hb = dd_find_timed_hb(1);
  }
  
  // 5. 如果找到红包，点击并处理
  if (hb) {
    // 点击红包
    click(hb.bounds().centerX(), hb.bounds().centerY());
    // 等待弹层出现（30ms 足够）
    sleep(30);
    // 尝试点击弹层按钮
    var pop_btn = dd_find_hb_pop_btn(timeoutInterval);
    if (pop_btn) {
      click(pop_btn.bounds().centerX(), pop_btn.bounds().centerY());
      // 等待进入详情页（20ms）
      sleep(20);
      // 点击返回
      dd_click_hb_detail_back(backInterval);
    }
  }
  
  // 6. 继续循环
  dd_start();
}

// 点击红包弹层打开红包（优化版 - 移除不必要的回调）
function dd_click_hb_pop_btn (timeout) {
  var hb_btn = dd_find_hb_pop_btn(timeout);
  if (hb_btn) {
    click(hb_btn.bounds().centerX(), hb_btn.bounds().centerY());
    return true;
  }
  return false;
}

// 点击红包详情页返回按钮（优化版 - 直接查找返回按钮）
function dd_click_hb_detail_back (timeout) {
  // 直接查找返回按钮，不需要先判断是否在详情页
  var back = dd_find_hb_detail_back(timeout);
  if (back) {
    click(back.bounds().centerX(), back.bounds().centerY());
    // 等待返回动画（10ms）
    sleep(10);
    return true;
  }
  return false;
}

// 点击失效红包的弹层，快速关闭（优化版）
function dd_click_hb_expire (timeout) {
  var rl_root = dd_find_rl_root_view(timeout);
  if (rl_root) {
    // 点击左上角关闭弹层
    click(rl_root.bounds().left + 5, rl_root.bounds().top + 5);
    sleep(10);
    return true;
  }
  return false;
}

// 检查红包是否过期或抢完（优化版）
function dd_find_hb_expire (timeout) {
  var hb_pop_text = dd_find_hb_pop_text(timeout);
  if (hb_pop_text) {
    var text = hb_pop_text.text() || '';
    return text.includes('已失效') || text.includes('抢完了');
  }
  return false;
}

// 找到拼手气红包（优化版）
// @param {number} timeout - 超时时间
// @param {boolean} findLast - 是否查找最后一个红包，默认 false 查找第一个
function dd_find_hb(timeout, findLast) {
  if (findLast) {
    // 直接查找所有，不使用 findOne
    var hbs = text('拼手气红包').find();
    // 从后往前查找（最新的红包在最后）
    for (var i = hbs.length - 1; i >= 0; i--) {
      var item = hbs[i];
      var itemId = item.id();
      if (itemId.includes('tv_redpackets_type') || itemId.includes('theme_redpackets_type')) {
        return item;
      }
    }
  } else {
    var hb = text('拼手气红包').findOne(timeout);
    if (hb) {
      var hbId = hb.id();
      if (hbId.includes('tv_redpackets_type') || hbId.includes('theme_redpackets_type')) {
        return hb;
      }
    }
  }
  return null;
}

// 找到定时红包
function dd_find_timed_hb (timeout) {
  return id("pick").findOne(timeout);
}

// 找到红包弹层打开红包按钮
function dd_find_hb_pop_btn (timeout) {
  // 先查找 iv_pick
  var hb_btn = id("iv_pick").findOne(timeout);
  // 如果没找到，再查找 theme_redpacket_pick
  if (!hb_btn) {
    hb_btn = id("theme_redpacket_pick").findOne(timeout);
  }
  return hb_btn;
}

// 找到红包弹层文案内容
function dd_find_hb_pop_text (timeout) {
  // 先查找 tv_bless_word
  var hb_text = id("tv_bless_word").findOne(timeout);
  // 如果没找到，再查找 theme_bless_word
  if (!hb_text) {
    hb_text = id("theme_bless_word").findOne(timeout);
  }
  // 如果没找到，再查找 theme_missed_bless_word
  if (!hb_text) {
    hb_text = id("theme_missed_bless_word").findOne(timeout);
  }
  return hb_text;
}

// 找到红包弹层根视图
function dd_find_rl_root_view (timeout) {
  return id("rl_root_view").findOne(timeout);
}

// 进入了红包详情页
function dd_find_hb_detail (timeout) {
  // 尝试找到 id 为 redpackets_picked_detail 的元素，确保以及到了红包详情页
  return id("redpackets_picked_detail").findOne(timeout);
}

// 找到红包详情页返回按钮
function dd_find_hb_detail_back (timeout) {
  return desc("返回").findOne(timeout);
}

// ========================================= 《 微信红包 》

// 已移除微信支持，仅保留钉钉功能

// ========================================= 《 启动 》

// 调用
main();
// 单独调试
// threads.start(function () {
//   // 钉钉抢红包
//   dd_start();
// })


