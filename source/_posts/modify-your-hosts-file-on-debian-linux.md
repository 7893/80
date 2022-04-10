---
title: Debian 无法修改 /etc/hosts 文件
date: 2019-09-07 09:19:29
tags: [Debian,hostname,hosts,hostname,AWS,Lightsail,cloud]
---

本文描述的情况使用的操作系统如下所示，可能不适用于正在阅读本文的时候已经更新的版本或不同的主机商的不同配置：

	#cat /proc/version 
	Linux version 4.9.0-9-amd64 (debian-kernel@lists.debian.org) (gcc version 6.3.0 20170516 (Debian 6.3.0-18+deb9u1) ) #1 SMP Debian 4.9.168-1+deb9u5 (2019-08-11)
	
	#lsb_release -a
	No LSB modules are available.
	Distributor ID: Debian
	Description:    Debian GNU/Linux 9.9 (stretch)
	Release:        9.9
	Codename:       stretch

当执行 sudo 的时候若收到如下提示：

	sudo: unable to resolve host xxxxxx

则需要修改 /etc/hosts 文件 文件，把 xxxxxx 解析为 127.0.0.1 即可，即：
	
	127.0.0.1	localhost xxxxxx

某些主机商（比如 Amazon AWS/Lightsail）的虚拟机（VM）上使用的 Debian 系统由于初始配置问题，不能修改 hosts 文件，会被告知如下信息：

	#cat /etc/hosts

	# Your system has configured 'manage_etc_hosts' as True.
	# As a result, if you wish for changes to this file to persist
	# then you will need to either
	# a.) make changes to the master file in /etc/cloud/templates/hosts.tmpl
	# b.) change or remove the value of 'manage_etc_hosts' in
	#     /etc/cloud/cloud.cfg or cloud-config from user-data
	#
	127.0.1.1 ip-172-26-40-252.eu-west-1.compute.internal ip-172-26-40-252
	127.0.0.1 localhost
	
	# The following lines are desirable for IPv6 capable hosts
	::1 ip6-localhost ip6-loopback
	fe00::0 ip6-localnet
	ff00::0 ip6-mcastprefix
	ff02::1 ip6-allnodes
	ff02::2 ip6-allrouters
	ff02::3 ip6-allhosts

但是查找上述文件（/etc/cloud/templates/hosts.tmpl 和 /etc/cloud/cloud.cfg 以及 /etc/init.d/cloud-config）的时候并没有 manage_etc_hosts 这个选项。

只要编辑 /etc/cloud/cloud.cfg.d/01_debian_cloud.cfg 并在其中加入 manage_etc_hosts: false 即可，如下：

	#sudo vim /etc/cloud/cloud.cfg.d/01_debian_cloud.cfg 
	
	apt_preserve_sources_list: true
	manage_etc_hosts: false
	system_info:
	  default_user:
	    name: admin
	    sudo: ALL=(ALL) NOPASSWD:ALL
	    shell: /bin/bash
	    lock_passwd: True
	    gecos: Debian
	    groups: [adm, audio, cdrom, dialout, dip, floppy, netdev, plugdev, sudo, video]
	    sudo: ["ALL=(ALL) NOPASSWD:ALL"]
	    shell: /bin/bash

重启，即可修改 /etc/hosts 文件。

	
