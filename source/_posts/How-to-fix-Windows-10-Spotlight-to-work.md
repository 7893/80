---

title: Windows 10 聚焦无法更新
date: 2018-01-26 16:29:59
tags: [POWERSHELL,WINDOWS10]

---

# 症状：

Windows 10 锁屏界面选择了“Windows 聚焦”无法自动更新？
或者
Windows 10 锁屏界面选择了“Windows 聚焦”以后直接蓝色屏幕或者灰色屏幕而没有图片加载出来？

**网上给出的方法有关于策略组的，关于网络的，关于注册表的，关于组建完整性的；我试过的都无效。**

----------

# 解决方法：
1. 打开“此电脑”（或者叫了多年的“我的电脑”），菜单栏选择“查看”，打开“文件扩展名”和“隐藏的项目”；
2. 进入下面的文件夹：

	C:\Users\[Your-Name]\AppData\Local\Packages\Microsoft.Windows.ContentDeliveryManager_[Something-else]\Settings


注意：
	[Your-Name] 是你的登录名；
	[Something-else] 每个人不同，随机的一个字符串；

现在你看到两个文件：


	roaming.lock
	settings.dat

3. 选中这两个文件，按一次 Ctrl + c 和 Ctrl + v（就是备份一下啦:D），然后删除这两个文件；
4. 进入下面的文件夹：

	C:\Users\[Your-Name]\AppData\Local\Packages\Microsoft.Windows.ContentDeliveryManager_[Something-else]\LocalState\Assets

删除文件夹中全部文件。


说明：
	这个文件是 Windows 10 聚焦更新的图片存放的地方，有些聚焦图片确实很美，来这里把文件复制到其他地方，改一下后缀为 .jpg 即可使用。

5. 使用管理器权限（右键选择”管理员身份运行“）打开 PowerShell 工具（命令提示符（cmd.exe）不行），输入如下代码：

	Get-AppxPackage Microsoft.Windows.ContentDeliveryManager -allusers | foreach {Add-AppxPackage -register "$($_.InstallLocation)\appxmanifest.xml" -DisableDevelopmentMode}

6. 重新选择锁屏背景为”图片“，再切换到”Windows 聚焦“。Over
