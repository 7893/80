---
title: 推荐 FastMail ：优秀邮箱服务 
date: 2018-09-09 09:19:29
tags: [FastMail,Gmail,Google,Yandex,SPF,DKIM,DMARC,Yubikey,PayPal,DNS,IMAP,POP3,PGP,authentication,TOTP,U2F,domain,recommendation]
---

网上介绍/推荐 FastMail 的大佬和文章已经比较多了，最近我的 FastMail 一年付费周期快到了要续费了，想了想这个服务简直6到起飞所以我再来推一波。之前的帖子可能无法说清楚 FastMail 的方方面面，我说点（可能）其他大佬（可能）没有提到的东西。

我自己使用 FastMail 截至目前接近两年。

# 起源

网上有一小撮人说使用个人域名的邮箱是增加逼格，好的！

我想问问如果这波人如果之前使用的是【雅虎中国】的邮箱 @yahoo.cn @yahoo.com.cn 的话这玩意儿被阿里巴巴关闭之后他们是挨个修改邮箱了么？

还有，假设你使用的是某个服务商的邮箱，比如网易邮箱，你每次登陆都要看烦人的广告这个你看了很多很多年。如果有一天网易出现了安全事故（又不是没出现过）你想搬家，你不再用网易了，你能么？过去很多年的数据导出就是个很大的问题，更不用说放弃网易邮箱后缀了，一旦放弃意味着你要修改所有你使用这个邮箱地址的其他服务，你想一下现在让你更换一个手机号你的第一反应是什么？同理。

使用域名邮箱的话，服务商服务不爽？搬家走人！服务商看着奄奄一息了？搬家走人！广告？抱歉一般都没有！用了多年想换换口味？搬家走人！开始收费/涨价了接受不了了？搬家走人！。。。？搬家走人！

------

# 概要

Gmail 千好万好中的大多数都适用于 FastMail 。而且！自从 1999年 以来专门做邮箱业务至今没有倒闭而且被众多大佬发帖推荐的邮箱服务商，地表一只手都数的过来（如果还有其他的请告诉我一下。）！

所有你对邮箱的期望，什么稳定，安全，快速，无广告，绑定域名，各种导入导出数据，别名，大容量，日历，通讯录，同步，推送，IMAP，二次认证，支持 Yubikey ，转发，过滤。。。只要你能想到的，基本上，都支持了。[SPF，DKIM，DMARC 支持](https://6ki.org/2017/01/spf-dkim-and-dmarc.html) 。同时，十分注重安全和隐私，十分注重邮件相关标准。

SPF DMARC DKIM 这种一看名字就高端到不行的东西。（SFP 很多国内大厂都支持了，但是后面两个别人都已经支持了很多年了，有些还只是表象上支持而已（腾讯邮箱帮助页面是写上了，可是真的支持了么？））但是，[SPF 已经不推荐设置了](https://6ki.org/2018/08/guide-to-use-amazone-route-53.html)。你等国内邮箱支持 Yubikey ？恐怕你还得至少再活 500 年！

------

# 详细介绍

## [价格](https://www.fastmail.com/pricing/)

官网页面很清楚了。可以免费试用一个月，国内手机如果无法注册请直接联系客服邮箱帮你注册一个账号。试用账号限制了可潜在造成滥用的功能，比如[限制了邮件发送数量](https://www.fastmail.com/help/account/limits.html)，[无法创建静态网站](https://www.fastmail.com/help/files/website.html)，[无法使用转发规则](https://www.fastmail.com/help/receive/forward.html)。年付有优惠具体请看价格页面。另外，使用[个人邀请](https://ref.fm/u16759801) ([https://ref.fm/u16759801](https://ref.fm/u16759801)) 首年可以打九折！就是标准版首年 $45 。

## 容量额度

25GB，如果邮箱容量用完了，购买容量等于购买了一次当前套餐。单个用户最大容量 300GB。

## 安全

用户数据，访问权限，加密收发，图片载入等等等等，他们写了一篇文章《[How FastMail provides a secure service](https://www.fastmail.com/help/ourservice/security.html)》来介绍。FastMail 至今没有出现过安全事故。

## 速度

用过都说快，移动端客户端，邮箱页面和你打开官网一样都很快。中国大陆访问没有障碍。

## 客户端

支持 iOS iPad 安卓 客户端。速度没的说。

## 主题

主题不是和QQ邮箱一样一身华丽的衣服，而是基于颜色的，总体来看界面有点高端大气（和美国科幻片里的黑客镜头很配）

## 语言

多国语言默认英语，简体中文？有，但是翻译似乎不全面，而且翻译也不是很地道。不推荐使用！

## 支付方式

支持  Visa MasterCard American Express PayPal 和 比特币。但是！没有说只接受信用卡，如果你有 Visa MasterCard 借记卡（[中国银行长城跨境通国际借记卡](http://www.boc.cn/bcservice/bc2/201704/t20170426_9329829.html)了解一下？）理论上也是可以的但是我没有试，又但是！没说不接受虚拟卡，我也没试过。支持 PayPal 中国版（绑定银联卡是可以的）。有过 Gift Card 叫做 Gift Certificate 但是现在不支持了！

## 续费策略

对于个人，我推荐使用 Standard Plan 否则的话不能绑定域名。注意这个续费策略有点不同于我们接触的大多数：你元旦买了一年服务，过了半年你想再续费一年，那么你仍然需要支付一年的费用你的使用期限延长一年，没错吧？这是我们接触到的绝大多数的订阅服务（什么 QQ会员啊 爱奇艺会员啊 等等等等的）策略。但是！！！ FastMail 不是这样的，如果你过半年后要续费一年，那么你续费的一年从你续费的当天开始计算，时间上时间只延长了半年而你的费用也只需要支付半年即可。即：续费时长从今天开始计算！

## 域名

可以绑定多个域名，也可以用系统给你的多达 120+ 域名创建别名邮箱，你无论使用什么域名，你在任何时候都只有一个收件箱。当然你可以建立文件夹使用 rules 把内容分开。是不是有 Gmail 熟悉的感觉？

## 导入导出

支持各种，邮箱，联系人，日历的导入和导出。邮件导入服务是我见过最靠谱最6的没有之一。邮箱搬家无忧零障碍。

## DNS

支持托管你的域名的 DNS，当然相比[专业的 DNS 服务商](https://6ki.org/2017/12/list-of-dns-service-providers-in-2017.html)来说就有点欠缺了但是对个人使用足够没有问题。

## 邮件路由

支持设置子域名策略和邮件路由策略。比如如何处理 anythin@user.eg.zone 这种邮件。详细内容 [帮助页面](https://www.fastmail.com/help/receive/domains-setup-mxonly.html) 。

## 账户恢复

密保邮箱，密保手机，还有 Recovery Code 备用！

## 二次验证

支持各种你想得到的软件，硬件，短信验证。支持 Yubikey !!! 足见专业！他们自己也说安全是他们的重中之重。[帮助页面](https://www.fastmail.com/help/account/2fa.html) 。

## App Passwords

使用任何客户端都必须创建一个临时密码而不是用自己的邮箱密码。什么时候，谁用，给什么权限（仅邮件？给联系人？只有 IMAP？等等）都可控！

## 邮件读写

支持从自带网盘和 Dropbox 上传文件，本地上传当然也支持了。

## 文件夹

支持层次组织，支持拖放排序。什么重命名之类的~不在话下！

## 规则

支持收件规则，支持转发规则，支持邮件组织规则。无与伦比强大，你想得到的基本都有！你想不到的也有~你还可以自己编辑过滤脚本！！！

## 垃圾邮件保护

这还用说，当然！什么“Forwarding hosts”什么“Backscatter”的都支持啦~你常见的贝叶斯分类器？当然！什么设置自定义阈值当然也支持！

## 自动回复

自动回复必须和垃圾邮件保护一起配合使用！是不是很酷炫？就这点就秒杀别人几条街了。为什么呢？可以自己思考下。

## 联系人

分组，共享，导入导出你知道的想得到的都支持。

## 日历

支持添加订阅，支持一切 CalDAV 日历，可以和 Google Calendar 同步。

## Notes

附带一个记事本功能，类似 Google Keep 这种。默认纯文本，支持富文本。当然没有 Evernote 和 Dropbox Paper 强大。

## Files

网盘！叫做 FastMail Files ，有点强大！但是没有 Dropbox 强大了。除了基本的保存上传下载文件这种以外，还支持各种域名映射，可以做静态网站使用，有个自带的相册模板可以嗖一下生成一个简单的相册。而且！静态网站还支持自动管理续期使用 Let’s Encrypt 签发证书的 HTTPS 呢！这部分后来可能会专门写个帖子介绍一下。

## 帮助文档

相当全面，相当专业，English Only.

## 博客

https://fastmail.blog/ 是他们的官方博客，专业！English Only. 我偶尔会翻译一些有意思的文章（能力学识有限，有错误也不要喷我。）

## 客服

专业不废话响应速度快。可以直接用你的邮箱给 support@fastmail.com 发邮件就等于快速开了个工单！而且，支持推特上对话帮助~

------

# 最后

## 缺点

有没有发现不支持 PGP 呢？他们又专门写了一篇文章《[Why we don't offer PGP](https://fastmail.blog/2016/12/10/why-we-dont-offer-pgp/)》 来解释。

FastMail Files 不支持 IPv6

写信不支持 MarkDown （有谁支持麻烦告诉我一下）

## 对比

了解完了是不是觉得简直强大专业了一脸？回头一想我们的网易邮箱腾讯邮箱简直……注册一个月免费试试吧！别忘了使用我的[个人邀请](https://ref.fm/u16759801) (https://ref.fm/u16759801) 在你付费的时候打九折~

那么问题来了，你觉得是 Gmail 强大呢还是 FastMail 更酷呢？

## 改进

发送给QQ邮箱的问题有大佬说已经没有了，我自己也没遇到；

使用科学上网和中国手机注册的问题有大佬说也没有了，这个我自己没有试。

# 其他中文资源

- [维基百科中文](https://zh.wikipedia.org/wiki/FastMail)
- https://blog.blahgeek.com/fastmail-is-good/
- https://www.v2ex.com/t/157584
- https://www.v2ex.com/t/323193
- [安利好用的邮件服务之Fastmail](https://medium.com/@clarkzjw/%E5%AE%89%E5%88%A9%E5%A5%BD%E7%94%A8%E7%9A%84%E9%82%AE%E4%BB%B6%E6%9C%8D%E5%8A%A1%E4%B9%8Bfastmail-3f335bebdaaf)
- https://blog.yangl1996.com/post/switch-from-gmail-to-fastmail/
