---
title: RHEL8/CentOS8 编译安装 Mosh
date: 2019-07-11 16:27:17
tags: [CentOS8,mosh,RHEL8]
---

本来，对于 RHEL/CentOS 系统 mosh 应该在第三方源 EPEL 里面，可是当前（2019年7月）的时间节点正是 RHEL8 发布后，CentOS8 和 EPEL8 还没有发布。所以给 RHEL8 安装 mosh 则不能使用 EPEL 源了。

编译安装 mosh：

安装需要的工具软件：

	#如果已有则会自动跳过
	sudo dnf install gcc gcc-c++ autoconf automake libtool make unzip ncurses-devel git

安装 Google Protocol Buffers 库：
解决：“ configure: error: cannot find protoc, the Protocol Buffers compiler ”问题

	#安装 Google Protocol Buffers 库
	git clone https://github.com/protocolbuffers/protobuf.git
	cd protobuf
	git submodule update --init --recursive
	./autogen.sh
	./configure --prefix=/usr #参考安装指导“Hint on install location”部分，后面 mosh 则会找不到该库
	make #可能需要等待较长时间
	make check
	make install
	ldconfig #刷新共享库缓存

编译安装 Mosh：

	git clone https://github.com/mobile-shell/mosh
	cd mosh
	./autogen.sh
	./configure
	make
	make install

参考链接：

#需要注意“Hit on install location”部分
https://github.com/protocolbuffers/protobuf/blob/master/src/README.md
https://fedoraproject.org/wiki/EPEL 
https://fedoraproject.org/wiki/Infrastructure_2020/EPEL-8 
https://github.com/mobile-shell/mosh/wiki/Build-Instructions 
https://gist.github.com/palexander/2975305
https://gist.github.com/samsonjs/4076746 
https://gist.github.com/andrewgiessel/4486779 
https://gist.github.com/jaywilliams/c9ffab789b3f622abc932dd4cfaaeef5
