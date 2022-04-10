---
title: 推荐 IBM Plex 字体
date: 2018-07-24 12:19:00
tags: [IBM,Plex,fonts,Linux,Windows,recommendation]
---


## 介绍 ##

----------

IBM 去年 2017年11月 推出了一套叫做 Plex 的字体！
为啥呢？有两个目标：1.自己用 2.给你用

这套字体历时两年，是一套开源并且可以免费下载和使用的英文字体。当前提供 Sans, Serif, Mono 和 Sans Condensed 形式并且满足在所有环境下使用。

## 下载 ##

----------

主页：https://github.com/IBM/plex

下载：https://github.com/IBM/plex/releases

## 使用 ##

----------

网页使用指导：https://github.com/IBM/plex#web-usage

Windows 安装：

注意下载页面提示：【TrueType.zip is recommended for MacOS and Windows.】

下载然后解压，把所有文件夹内的 .ttf 复制到 C:\Windows\Fonts 文件夹内即可，然后就可以在任何你想使用并且可以设置字体的软件内使用了。

小提示：可以在解压后的文件夹内搜索 “*.ttf” 然后全选复制，避免了一个一个文件夹去打开多次复制的繁琐。

Linux 安装：

Linux 中的字体可分为两大类：

> **轮廓或矢量字体**
> 
> 包含作为字形组成相关绘图指导的数学描述。因此，每个字形都可以缩放为任意大小而无损质量。在可以使用此类字体（或字形）之前，需要将数学描述转换为光栅（网格）。此过程称为字体光栅化。字体微调（嵌入在字体中）可改进和优化特定大小的渲染效果。光栅化和微调通过 FreeType 库实现。
> 
> Linux 下的常用格式为 PostScript Type 1 和 Type 2、TrueType 及 OpenType。
> 
> **位图或光栅字体**
> 
> 包含一个为特定字号设计的像素阵列。位图字体渲染速度极快，而且非常简单。然而，与矢量字体相比，位图字体无法在不损质量的情况下进行缩放。因此，这些字体通常以不同的大小发布。现在，Linux 控制台中仍然使用位图字体，有时终端中也会使用这些字体。
> 
> 在 Linux 下，便携式编译格式 (PCF) 或字形位图分布格式 (BDF) 是最常用的格式。

> 这些字体的外观主要会受两个方面的影响：
> 
> 1. 选择合适的字体系列，
> 
> 2. 采用某种算法渲染字体，达到接收者眼睛最舒服的效果。
> 
> 最后一点只与矢量字体相关。虽然上面两点都需要根据个人情况而定，但仍有一些默认值需要创建。
> 
> Linux 字体渲染系统由具有不同关系的几个库组成。基本字体渲染库是 FreeType (http://www.freetype.org/) ，它会将支持的格式的字体字形转换为优化的位图字形。渲染过程由算法及其参数（可能受专利问题影响）控制。
> 
> 使用 FreeType 的每个程序或库都应该参考 Fontconfig (http://www.fontconfig.org/) 库。
> 此库会从用户及系统那里收集字体配置。用户修改其 Fontconfig 设置后，此更改将导致发生 Fontconfig 感知的应用。
> 
> Arabic、Han 或 Phags-Pa 等脚本所需的更复杂的 OpenType 成型以及其他更高级别的文本处理依赖于 Harfbuzz (http://www.harfbuzz.org/) 或 Pango (http://www.pango.org/) （这只是一部分示例）。

Linux 系统有这么几个地方存放字体：

	# 系统目录 适用于每个系统用户
	/usr/share/fonts
	/usr/local/share/fonts

	# 用户目录 适用于当前用户
	~/.config/fonts
	~/.fonts

*详细目录区别请参考：**Filesystem Hierarchy Standard (文件系统层次标准，FHS)**标准*

下载字体文件：

	wget https://github.com/IBM/plex/releases/download/v1.0.2/TrueType.zip

解压字体文件包：

	unzip TrueType.zip

复制字体到字体文件夹：

	sudo cp -R TrueType /usr/share/fonts/

刷新字体缓存：

	sudo fc-cache -fv

Done.
