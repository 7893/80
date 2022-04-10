---
title: 新功能介绍：DigitalOcean 自定义镜像
date: 2018-10-06 09:19:00
tags: [DigitalOcean,VirtualBox]
---

![Introducing Custom Images on DigitalOcean](https://assets.digitalocean.com/ghost/2018/09/Custom-Images-Blog-Header.png)

前段时间 [DigitalOcean](https://m.do.co/c/7210ed2e262d) 页面左侧【Images】菜单中出现了一个子菜单【Custom Images】但是点进去页面错误直接就是 DO 的鲨鱼了。今早，DO 发邮件说他们的这个功能上线了。

# 价格

试用自定义镜像导入创建虚拟机是免费的，还是和以前一样只收虚拟机的钱。但是！存储镜像是收费的，$0.05/GB/月。

# 支持哪些镜像

所有预装了 cloudinit 0.7.7, cloudbase-init, coreos-cloudinit, ignition, 或 bsd-cloudinit 并且是 ext3/4 文件系统的 Linux 系统都支持。

支持的镜像后缀是：raw, qcow2, vhdx, vdi, 和 vmdk。（**没错，暂时没有 iso 文件**）。官方建议为了节省空间可以试用 gzip 和 Bzip2 压缩工具压缩一下。

# 支持哪些方式

页面支持本地【拖放/上传】镜像和从【网络地址 URL 获取】镜像（如同 Vultr 一样）。

官方建议如果上传自定义镜像的话，建议现在类似 VirtualBox 这类虚拟机工具里创建一个受支持的文件类型，然后利用 DO 页面工具上传。

官方建议如果文件过大可以上传到 DigitalOcean 提供的存储服务 【Spaces】 里面然后利用 URL 导入。但是，这项服务仍然是收费的，我不推荐使用。

我个人建议，如果你的镜像是自定义的，由于存储在这里是需要收费的，所以可以从本地利用工具上传到 VPS 内然后利用 URL 导入即可。而且利用 FTP 等上传比页面方式上传稳定许多。

# 如何创建

当自定义镜像上传完成后，就可以和正常创建虚拟机一样使用自定义镜像创建了。

# 后续

DigitalOcean 官方表明他们会后续继续扩展完善这个功能以便支持ISO 镜像。

# 延展阅读

官方博客：《[Bring Your Custom Images to DigitalOcean](https://blog.digitalocean.com/custom-images/)》
