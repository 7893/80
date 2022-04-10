---
title: openSUSE 15.0 升级 openSUSE 15.1
date: 2019-05-24 16:27:17
tags: [openSUSE,upgrade]
---

openSUSE 15.1 于 2019年5月22日发布了。

openSUSE 15.1 中文 发行注记/发行说明： [https://doc.opensuse.org/release-notes/x86_64/openSUSE/Leap/15.1/](https://doc.opensuse.org/release-notes/x86_64/openSUSE/Leap/15.1/)

备份现有源：

	sudo cp -Rv /etc/zypp/repos.d /etc/zypp/repos.d.Old

替换 openSUSE 15.0 源为 openSUSE 15.1 源：

	sudo sed -i 's/15.0/15.1/g' /etc/zypp/repos.d/*

如果复制上面的命令到控制台出现字符错误提示，那么手动输入。

刷新源：

	sudo zypper --gpg-auto-import-keys ref

更新：

	sudo zypper dup

最后重启完成。

参考来源： [https://en.opensuse.org/SDB:System_upgrade](https://en.opensuse.org/SDB:System_upgrade)
