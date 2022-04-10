---
title: 给 Linux 系统添加 swap 交换空间
date: 2018-07-26 09:20:17
tags: [CentOS,Linode,DigitalOcean]
---


对于虚拟机而言，一般服务商给 虚拟机（VM（Virtual Machine））不会分配交换空间，有较少数的服务商在图形界面面板里可以配置交换空间（例如 Linode）。这样的话通过把已有硬盘划分一块给一个单独的文件并把这个文件格式化成交换分区的格式然后挂载给系统然后永久启用就可以了，具体如下：

需要创建一个 2GB 大小的 /swapfile 文件，文件路径随意，但是为了好管理，所以放在了根目录下：

    dd if=/dev/zero of=/swapfile bs=1024 count=2048000
*（坑：不能使用 fallocate 否则后续会报错 理由 https://unix.stackexchange.com/questions/294600/i-cant-enable-swap-space-on-centos-7）*

输出：

    2048000+0 records in
    2048000+0 records out
    2097152000 bytes (2.1 GB) copied, 6.28804 s, 334 MB/s

查看一把生成的文件：

    ls -lh /

输出：

    -rw-r--r--.  1 root root 2.0G Jul 11 23:30 swapfile

改变文件权限：

    chmod 600 /swapfile

查看一把改变以后的权限：

    ls -lh /swapfile

输出：

    -rw-------. 1 root root 2.0G Jul 11 23:30 /swapfile

格式化当前文件为交换空间文件系统：

    mkswap /swapfile

输出：

    Setting up swapspace version 1, size = 2047996 KiB
    no label, UUID=cd2e05ae-daf4-4917-a4a7-7317ab989440

把这个文件设置为交换空间：

    swapon /swapfile

查看当前交换空间是否生效：

    swapon -s

输出：

    Filename	Type	Size	Used	Priority
    /swapfile   file	2047996	0		-1


使交换空间永久生效：
备份需要更改的系统文件：

    cp /etc/fstab /etc/fstab_20180711_original
	vim /etc/fstab

编辑文件把下列内容加入文件末尾：

	/swapfile   swap    swap    sw  0   0

保存文件重启系统。
