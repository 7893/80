---
title: Amazon Route 53 使用指南
date: 2018-08-08 08:08:08
tags: [Amazon,AWS,Route53,DNS,Anycast,CAA,DNSSEC,SPF,DKIM,DMARC,GEO,domain,ns1]
---

# Amazon Route 53 是什么？

------

"[Amazon Route 53](https://aws.amazon.com/cn/route53/)" 看名字就知道是 亚马逊 Amazon 提供的一项服务，它属于 [Amazon AWS(Amazon Web Services)](https://aws.amazon.com/cn/) 众多服务中的一个，它是一个高可用的弹性 DNS 服务，这项服务主要包括三大功能：

- 域名注册
- 域名解析
- 检查资源运行状况

Route 53 为什么要叫 Route 53 呢？网上有答案了：Quora 【[这个帖子](https://www.quora.com/Why-did-Amazon-AWS-name-its-DNS-services-Route-53)】表明了原因：It refers to the TCP/UDP port 53, where DNS server requests are addressed.

这篇帖子针对普通用户，只说域名注册和域名解析。学识有限，如果有错误烦劳指出。

# 域名注册

------

作为云计算全球头把交椅服务商，亚马逊当然也有域名注册服务。但是亚马逊自己只提供三个后缀的域名注册即最常见的 .com .net .org 其他后缀都是和 [Gandi.net](https://www.gandi.net/zh-hans) 合作，任何除了这三个之外的其他后缀的注册商都会在 whois 信息里显示 "Registrar: Gandi SAS" 。

## 注册特性

转移锁定（Transfer lock）：当然支持，保护域名不会被所以转出当前注册商；打开之后域名状态里面会多一条 "Status: clientTransferProhibited" 这个大家都清楚；

转移密码（Authorization code）：自助获取，如果域名要转出必须；历史上，国内的域名注册奸商就是在这个环节各种限制以此限制域名转出，当年我就是写了各种纸质材料送去了北京万网总部才得以转出域名（继续在此差评并且鄙视之）；

隐私保护：免费，所有域名免费提供隐私保护；但是！我记得如果是除了 .com .net .org 以外的注册在 [Gandi.net](https://www.gandi.net/zh-hans) 的域名是不能隐藏所有人名称的，详细看【[这里](https://blog.cnlabs.net/4719.html)】  。

DNSSEC status：DNSSEC 启用需要 DNS 服务本身支持和域名注册商支持，注册在 Amazon Route 53 的域名解析服务截止当前（2018-09-23）不提供 DNSSEC 相关功能但是如果你使用的是支持 DNSSEC 的解析服务（比如 [ns1.com](https://ns1.com/)）那么是可以在这里设置相关信息以启用 DNSSEC 的。

## 域名价格

| 后缀 | 注册和续费 | 转移  |  恢复  |  转入  |
| :--: | :--------: | :---: | :----: | :----: |
| .com |   $12.00   | $0.00 | $66.00 | $12.00 |
| .net |   $11.00   | $0.00 | $67.00 | $11.00 |
| .org |   $12.00   | $0.00 | $69.00 | $12.00 |

其他域名价格请参考【[这个文档](https://d32ze2gidvkk54.cloudfront.net/Amazon_Route_53_Domain_Registration_Pricing_20140731.pdf)】。

**域名注册不能用任何代金券抵扣注册费用，其他的 Route 53 服务费用是可以抵扣。**

题外：对于老牌域名注册商 [Gandi.net](https://www.gandi.net/zh-hans) 网络上有两大派别，一大派别极力支持，另一大派别极力反对说各种坑。我个人建议是否要使用这个注册商还需要每个人自己去琢磨它的长处和短处。

## 域名转入

域名从其他注册商转入 Route 53 流程是自动的，一般情况下如果是国外的注册商转入会当天完成，有的自动处理的甚至半小时就可以完事就是收发几封邮件的事情。同其他注册商一样，转入域名需要支付一年域名费用并且会延期一年，转入以后两个月内不可以转出。


# 域名解析

------

Amazon Route 53 域名解析包括两部分：

公共域名解析（Public Hosted Zone）：大家理解的传统的域名解析，域名到 IP 地址转换。作用于整个互联网的查询；

私有 Amazon VPN 解析（Private Hosted Zone for Amazon VPN）：也是解析，但是仅限于 AWS VPC 内的资源响应，公网无法访问。

先前文章《[2017年 DNS 解析服务商列表](https://6ki.org/2017/12/list-of-dns-service-providers-in-2017.html)》当中[粗略介绍过 Amazon Route 53](https://6ki.org/2017/12/list-of-dns-service-providers-in-2017.html#Amazon-Route53) 这个优秀的互联网 DNS 解析服务。

## 品质

高可用，[AWS SLA](https://aws.amazon.com/cn/route53/sla/) 服务承诺中说明了 Route 53 提供 100% 可用。

根据 Datanyze 统计，[Alexa top 1K](https://www.datanyze.com/market-share/dns/Alexa%20top%201K/) 中有 21.10% 使用了 Route 53，第二名 Cloudflare 占有 18.87%，而第三名 Dyn 则占了 12.48%。而第二名则是由于优秀的 CDN 服务带动了 DNS 占有率，而第三名的互联网老牌服务商如今被 Oracle 收购了的 Dyn 也没有这么高的占有率。市场足见品质。

## 特性

### 优点

Route 53 是当前地表数一数二的优秀的域名解析服务商，基本上一般所有的用户诉求都能满足。常规的域名解析服务商只是做一个域名到 IP 地址的映射，稳定速度快的就已经很难得了。而 Route 不但如此，而且：

- 可编程，提供各种语言支持的 API 可以编程动态改变路由；
- 是弹性的，可扩展的提供海量查询服务的 DNS 解析服务；
- SOA 可以编辑，一般的大多数的 DNS 服务商 SOA 是不可编辑的；
- 提供流量控制，你的流量怎么路由完全可控；
- 提供基于基于延迟的路由；
- 提供基于地理位置的 GEO 解析；
- 提供 Failover 故障转移确保解析服务高可用；
- 如果您使用 AWS CloudFront CDN 服务时支持裸域；
- 如果你使用 AWS S3 支撑网站部分资源，那么支持裸域；
- 支持 Amazon ELB(Elastic Load Balancing) 集成；
- 提供加权轮询（WRR）路由功能；
- Route 53 还是截至目前为止（2018年09月25日）地表屈指可数的提供 DNS 查询日志的服务商（Google Cloud DNS 目前还不提供）而且日志提供导出到 S3 可做各种深度分析；
- 当然也支持 Anycast 任播；
- 当然 CAA 也是支持的；

### 缺点

不支持 DNSSEC 相关，这点比不上 Google Cloud DNS 了，参看上文相关部分介绍。

## 定价

Route 53 解析的价格由多个因素组合而成：

1. 托管的域名数量
2. Traffic Flow 记录数
3. 标准查询数
4. 基于延迟的路由查询数
5. Geo DNS 和临近地理位置查询
6. 运行状况检查

价格计算还有一些细节的规则，具体请查看 [Amazon Route 53 定价](https://aws.amazon.com/cn/route53/pricing/) 页面。

这里举几个例子：

- 个人博主，只有一个域名一台主机也没有特别针对的用户，每个月查询50万次，那么每月 0.5 + 0.4 * (50/100) = 0.7
- 个人开发者，有多个域名假设手里有10个设置各种乱七八糟的只是自己知道的指向几乎没有人访问，有上面同款博客一个，那么每月大约 0.5 * 10 + 0.4 * (50/100) = 5.2
- 米农，手里持有100个域名但是都只做了指向，有几个爆款指向每月大概加起来有25万次查询，那么每月 0.5 * 25 + 0.1 * (100 - 25) + 0.4 * (25/100) = 20.1

以上计算还要注意区分资源的指向是谁，建立了多长时间等等价格页面的细则。大概的套路就是每项资源使用量*单价-符合免费或折扣策略的价格=总价，除了第一个托管以外其他的都是按比例收取，托管则有一个 12 小时的免费时间窗口。

## 设置

### 公共域名解析（Public Hosted Zone）

公共解析和其他的常规 DNS 解析没有什么区别，选择合适的类型在文本区域内会有格式例子给出照着写就可以了，解释一下有别于其他常规 DNS 解析的名词：

Alias（别名）：可以理解为一类特殊的 cname 类型，但是指向的对象只能为 aws 资源或者是同类型的同域的其他资源才可以。 aws 资源可以是 CloudFront，Elastic Beanstalk 环境，ELB 负载均衡器，S3 资源。比如给一个 A 记录 hosta 创建一个 alias 叫做 hostb

TTL：如果是别名并且指向的是 aws 资源，则无法指定 TTL 值，一切由 aws 帮你搞定。如果别名指向的是同域的其他相同类型记录，则使用目标记录的 TTL 值。如果不是 alias 的话 TTL 可以设置为你想要的值，默认 300

Routing Policy（路由策略）：

- Simple：一般策略。Route 53 只根据记录值相应查询；这更像是普通的其他常规 DNS 解析，一般用于将流量路由到单个资源；
- Weighted：加权路由，权重路由，基于权重的流量路由策略。资源的权值是一个 0 到 255 的整型值。思路：把多个资源关联到同一个域名上（可以是单域名或者是子域名），可以认为是一个资源组，然后根据权重（占该组中所有记录总权重的比例）指定向每个资源路由多少流量。如果某个资源的权重为0则不向这个资源路由流量这个特性可以用作测试或者临时停机之类的用途。如果将所有资源的权重都设置为0则会以相同的概率向所有资源路由流量。比如你有3个资源权重费别为 5 10 15，那么分到第一个的流量则为 5/(5+10+15)= 5/30 = 1/6 ，第二个则为 10/(5+10+15)= 10/30 = 1/3，第三则为 15/(5+10+15) = 15/30 = 1/2. Set ID 是一个在加权记录组中唯一标识当前记录的值，可以认为是当前资源名称的一个描述或者备注之类。
- Latency：Latency-based- Routing(LBR) 基于延迟的路由策略。简单来说就是谁延迟低把流量给谁处理；创建多个同名记录的同时指定响应区域，当 DNS 查询被路由到 Route 53 以后 Route 53 会以一段时间内执行的延迟测量给出路由响应。值得注意的是，网络延迟是动态的，不是一定不变的，也可能和地理位置没有太大关系，例如：不一定香港连接台湾就比香港连接新加坡块。
- Failover：故障转移路由。这个必须和 Health checks 配合使用，就是 Health checks 发现你的第一个资源如果挂了就把请求路由到第二个资源上。系统推荐为了更高的可用性而把此类记录的 TTL 设置为 60 或更低。
- Geolocation：传说中的 GEO 路由，地理位置路由。根据用户的地理位置来选择提供流量的资源。位置可以精确到大陆、按国家/地区或者按美国各州指定地理位置。如果您为重叠的地理区域创建了单独的记录 (例如，北美一个记录，加拿大一个记录)，则最小的地理区域具有更高的优先级。系统推荐为了更高的可用性而把此类记录的 TTL 设置为 60 或更低。地理位置的路由不仅有利于提高响应速度，而且可以根据地理位置提供本地化内容，还可以控制应用权限，还可以以可预测可控的方式在终端节点进行负载均衡。地理位置路由还可以配合 [Traffic Flow](https://console.aws.amazon.com/route53/trafficflow/home#/) 使用达到更加较为精确的流量控制的目的，这部分内容参看【官方文档】。
- Multivalue Answer：多值应答路由。多值应答记录的值只能设置一个。大部分记录类型都可以设置多个值，比如 A 记录可以指定多个 IP 地址，那为什么还要使用多值应答？为了配合使用状态检查 Health checks 来提高可用性和负载均衡性。如果您没有为多值应答记录关联运行状况检查，则 Route 53 始终认为记录正常。

提示：

如果要设置裸域/顶级域，则不要输入“@”符号，保持空白即可；

三流的邮箱服务商还没上 SPF 的时候二流的服务商还在拿 SFP DKIM 和 DMARC 为骄傲的时候一流的服务商现在已经**不推荐设置 SPF 记录**了，[文档](https://docs.aws.amazon.com/zh_cn/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#SPFFormat)表达的理由是：

> RFC 7208 中的 *Sender Policy Framework (SPF) for Authorizing Use of Domains in Email, Version 1 (在电子邮件中授权使用域的发件人策略框架 (SPF)，版本 1)* 已更新为：“...[I]ts existence and mechanism defined in [RFC4408] have led to some interoperability issues. Accordingly, its use is no longer appropriate for SPF version 1; implementations are not to use it.“(...在 [RFC4408] 中定义的其存在和机制已导致一些互操作性问题。因此，它已不再适合 SPF 版本 1；实施方案中不应再使用它。) 在 RFC 7208 中，请参阅第 14.1 节 [The SPF DNS Record Type](http://tools.ietf.org/html/rfc7208#section-14.1)。

一般情况下创建了一条 DNS 记录以后这条记录大概 60秒 内传播到所有 Route 53 服务器。

### 私有 Amazon VPN 解析（Private Hosted Zone for Amazon VPN）

如要使用 Route 53 解析 aws VPC 资源，请参考【官方文档】

### 记录检查（Test Record Set）

要知道某条记录的生效情况可以选中该条记录以后单击菜单栏上的“Test Record Set”来测试，还可以指定特定的其他 DNS 服务器或者客户端 IP 地址来判断 Route 53 给他们返回了什么。

这里的检查只适用于公共域而不能用于私网。

DNS response code 状态可以参考【[这个文档](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-6)】

### DNS 查询日志（DNS query logging）

前面说了 Route 53 是当前地表屈指可数的提供查询日志的服务商，大厂里面更是几乎唯一的一个。如何配置查看 DNS 查询日志呢？

访问【[这个页面](https://console.aws.amazon.com/route53/home#hosted-zones:)】，也就是点击 Route 53 页面左侧的 “Hosted zones”这里会看到你的已经创建了解析记录的域名列表，点击你要配置查询日志的域名前面的单选框（小圆点）（不是点击域名），右侧弹出一个面板叫做“Hosted Zone Details”。页面最下方点击“Configure query logging”按钮。

查询日志只能放在 US East(N. Virginia) 不能放在其他地方。

建议为每一个域名建立一个 log group。那么选择 "New log group in US East(N. Virginia) "即可，下面的"New log group name"为了方便管理建议写成 /aws/route53/example.com 这种。

下一步，配置权限，根据需要配置完成后测试，测试成功创建即可。

查看日志：如同上面一样点击域名前面的小圆点右侧弹出面板里面点击前面写的日志组名称就可以查看了。会跳转到 CloudWatch 页面的“日志”标签。

处理日志：选中日志组名称，上面菜单按钮“操作”里面选择。

------

