---
title: 2017年 DNS 解析服务商列表
date: 2017-12-27 16:48:11
tags: [DNS,DNSPpod,Cloudflare,DigitalOcean,Vultr,Linode,ns1,Dyn,DNSimple,DNSMadeEasy,UltraDNS,Cloudns,GoDaddy,EasyDNS,dnspark,entrydns,Verisign,manageddns,Namecheap,GoogleCloudPlatform,CloudDNS,Amazon,Route53,AWS,ZoneEdit,DNSSEC,CAA,HINFO,AFSDB,Anycast,GEO,VanityDNS,MasterDNS,SlaveDNS,rDNS,AXRF,TSIG,S3]
---

    1. 提到的服务或/和价格可能在你查看本贴的时候改变了；
    2. 如果你还知道靠谱的服务可以反馈给我；
    3. 转载不需要获得授权但需要链接到本文；


----------


## [DNSPod 中国版][81] ##
**方案：**免费版，个人专业版，企业基础版，企业标准版，企业旗舰版

没有被腾讯收购前尤其是没有编入腾讯云之前，大红大紫是个人都喜欢，限制小功能强大。后来被腾讯收购以后现在变成了 腾讯云解析 ，官网基本上就是个空壳了感觉，限制也特别大，曾经追捧 DNSPod 免费版的个人站长和一些博客博主很多人都觉得 DNSPod 免费版的服务质量在下降。 

**腾讯云解析价格总览：**[这里][1]  。而且貌似 发生过多次让大家不爽的事情 [事件1][2] [事件2][3] 。

它的优势在于对于国内刚需（忽略备案）和域名实名制问题以后的企业而言，运营商线路细分和省份线路细分会有一定的优势，对于死不回国（不接受实名制和备案）的个人用户而言，意义不大。同时，免费版不提供 SLA，而个人收费版 99% SLA 和企业版 最低 99.9% SLA。
 
## [DNSPod 国际版][82] ##
出了国门的 DNSPod 就什么都不是了，没有那么强的竞争力了，毕竟，能撑起半个互联网的 DNS 解析服务商也是有的，超长历史的 DNS 解析服务商也是有的。如果国内版 DNSPod 面向中国大陆，那无疑国际版就面向海外用户了，主要是加快了海外用户的解析速度，据说解析服务器全部在美国。当然，不用把域名实名制和备案。

国际版网站给出了一个[成功案例][4]，里面有[星巴克中国][5]，星巴克中国作为腾讯的战略合作伙伴选择的不是国内版 DNSPod 而是国际版，囧，这当然不是考虑到备案和域名实名制问题（星巴克中国在上海）。当前（2017年12月27日）DNSPod 国际版首页顶部出现提示文字：
> DNSPod 国际版解析业务暂停维护，不影响您继续使用。如操作过程中给您带来不便，敬请谅解！国内用户请访问 www.dnspod.cn 。

## [Cloudflare DNS][83] ##
**方案：**免费版，专业版，商业版，企业版

全球知名的 CDN 服务商，世界级 DNS 服务商，属于这个行业的第一梯队的企业。

**特点：**低延迟，超低延迟而且全域名提供 DNSSEC 支持，但是免费版只有两组解析服务器，收费版最便宜的价格是20美元，但是提供四组服务器，提供 DDOS 保护服务，流量统计，SSL加密，加速，缓存，流量控制等等众多强大功能，支持 Anycast 技术，支持 IPv6，但是只支持顶级域名。当前（2017年12月27日）他家的 CAA 记录正在测试？我没有申请参加测试但是我新添加的域名里面已经可以添加 CAA 记录了，但是 CAA 添加的界面这几天经常变化；而且，他家的 CAA 记录，会额外添加几个 CA，比如你只授权了：

> issue: letsencrypt.org flags:0

那么额外的几个将是：

    issue: comodoca.com flags:0
    issue: digicert.com flags:0
    issue: globalsign.com flags:0
    issuewild: comodoca.com flags:0
    issuewild: digicert.com flags:0
    issuewild: globalsign.com flags:0

**方案比较：**[https://www.cloudflare.com/plans/#compare-features][6]

**网络节点地图**：[https://www.cloudflare.com/network/][7]

**提示：**免费版只支持顶级域添加；

## [DigitalOcean DNS][84] ##
**方案：**免费

这个网站中国大陆网民特别熟悉了，他家的“Networking”里面又个“Domains”的子功能就是 DNS 了。DigitalOcean DNS 是免费服务，无论你是否使用了他家的 VPS 都可以免费使用，有三组免费的解析服务器。

**特点：**提供 A，AAAA，CNAME，MX，TXT，NS，SRV 和 CAA 记录解析而且界面美观生效速度快？
> This provider uses CloudFlare Virtual DNS to proxy-cache DNS request through CloudFlare

可见，基本可以理解为 DO 的 DNS 是 Cloudflare 的一个代理或者是一个前端。暂时没有发现有什么官方说明的限制。

**官网指导：**[https://www.digitalocean.com/community/tutorials/how-to-point-to-digitalocean-nameservers-from-common-domain-registrars][8]

DigitalOcean DNS 算不上专业的 DNS，官网的介绍页面也很少，但是可以 DO 的定位是 Developer VPS，所以参考这一条可以理解一下他的 DNS 满足 Developers 应该是没有什么问题的。大的亮点没有，大的问题也貌似没有。

## [NSone][85] ##
**方案：**入门版（STARTER），基础版(BASIC)，高级版(ADVANCED)

世界级 DNS 服务商，后起之秀，专门做 DNS，CDN 的厂商，从解析速度，专业程度，知名客户程度判断的话可以列入 DNS 服务商第一梯队，也支持很多高级的特性，也有很多大厂知名客户。
有免费套餐，注册必须使用信用卡而且我注册的时候被要求发了真实信用卡的照片到邮箱通过了人工审核。

**各种方案：**[https://ns1.com/pricing#managed][9]

**特性：**支持流量控制，有专门针对中国大陆的 Managed DNS for China 服务，支持 Anycasted 任播，高频监控，支持 GEO 路由，支持 Linked Zones，支持导入，支持部分修改 SOA 记录，支持超全记录类型包括 AFSDB，CAA，CERT，DS，HINFO，NAPTR，PTR，RP这些，根据我前段时间（2017年12月）的邮件咨询，DNSSEC 支持将在 2018年第一季度上线，同时支持当作 Secondary Zone/从属 DNS/slave dns 使用，同时支持 DNS 记录在线迁移 zone transfers 功能（[AXFR][10]），可以把 DNS 同步到另一个 DNS 那里比如 he.net 使它作为从 DNS 使用。当然 也支持 API 编程。而且可以统计 24 小时内某条记录的被查询数，几乎实时统计。

**免费限制：**每月 50 万次查询，这个规模不适合大规模应用，小站长博主，小型企业没有任何问题；虽然 DNS 记录数没有限制，但是所有的域名加起来只支持 50 条 DNS 记录，包含一个监控器。

## [Linode DNS][86] ##
**方案：**有条件免费

如同 DigitalOcean 一样，
*This provider uses CloudFlare Virtual DNS to proxy-cache DNS request through CloudFlare*。但是不同的在于 Linode DNS 只有你在使用它家的 VPS 的时候（至少有一台 VPS 在计费）才可以使用，否则不能使用，如果你没有开通 VPS，则会被告知：

> Your zones will not be served by Linode's nameservers unless you have at least one active Linode on your account.

**特点：**五组服务器，支持常规记录以外还支持 CAA 记录，也支持当作 Slave DNS /从属 DNS 使用。

**官方介绍：**[https://linode.com/docs/networking/dns/dns-manager-overview/][11]

对 DNS 有高要求的个人和企业不建议使用，作为普通解析用用小流量还是可以的，也是一款 Developers DNS。支持 DNS 记录导入。

## [Dyn][87] ##
**方案：**付费 / 开发者版，商业版，企业版

世界级 DNS 服务商，DNS 服务领域全球老大哥，扛着着半个互联网，后来被 Oracle 甲骨文收购了。以前有免费服务，现在没有免费服务了，最低是 $7/月 的 developer plan。

**价格详细：**[https://dyn.com/dns/pricing/][12]

**特性：**毋庸置疑能想到的都支持，比如支持全球范围 Anycast 技术，支持日志，支持 API，DDOS 保护，GEO 路由，Failover，DNSSEC（貌似只支持有限的域名后缀种类），同时有 Secondary DNS 服务，也有 动态 DNS/Dynamic DNS 服务。是不差钱的土豪企业和个人的最佳选择。看个新闻就懂了这家老大哥在互联网领域的地位 《[DNS服务遭攻击 欧美大半个互联网沦陷了][13]》

**提示：**

1. 官方时不时在一个专门的页面有优惠券送；
2. 如果你的账号一段时间内没有激活的服务则账号会被关闭；
3. （第三方搜到的优惠券可能比官方的优惠力度大）；

## [Constellix][88] ##
方案：付费 / 开发者版，企业版

计费模式很复杂，具体请看 [https://constellix.com/pricing/dns/][14] ，当然官方也提供了一个计算器 [https://constellix.com/pricing/pricing-calculator/][15] 帮你搞定费用问题。

DNS 领域的全球老大哥 DNS Made Easy 团队设计开发的 DNS 产品，没有查到历史有多久远，但是域名 [https://www.whois.com/whois/constellix.com][16] 是 2009年11月23日 注册的。由于 DNS Made Easy 良好的口碑和业界的认可程度，应该不会有很大问题。

**支持特性：**企业级 100% SLA 支持，GEO 路由支持，对于企业级支持 Secondary DNS，对于开发者 支持 CND，支持 API，支持流量优化/控制，流量分析，支持 CAA，支持 DNSSEC，支持 Vanity DNS，支持日志。

## [Zilore][89] ##
**方案：**付费 / 个人版，专业版，商业版

专业 DNS 服务商，个人版差不多在 $5/月左右徘徊，没有免费服务。个人版支持 5 个域名，但是记录数无限制，查询数也没有限制，每多一个域名 $0.5 。年付的价格是 $50/年，但是如果年付的话每多一个域名则价格为 $5/月/个

**特性：**支持 GEO 路由，支持 Failover，支持 Failover Website（包括 SSl），支持 Anycast DNS（任播技术），DDOS 保护，IPv4/IPv6支持，支持 ALIAS 记录，支持新域名后缀，个人版最低 TTL 300秒，专业版最低 TTL 60秒，企业版最低 TTL 30秒。支持域名快照，支持预设，支持解析记录模板，支持统计，支持邮件转发，最少 99.90% SLA 保证。支持 Aname记录。

## [DNSimple][90] ##

**方案：**付费 / 开发者版，专业版，企业版

新兴 DNS 服务商，知道它是从 [Github Education Student Developer Pack][17]  里面送过大额的代金券，貌似是 $100（现在已经没有了），从整个网站来看 DNSimple 是一家很热爱 DNS 的公司（废话），而且他们的 logo 比较萌。

**价格方面：**开发者服务 $5/月 or $50/年；专业版 $25/月 or $250/年，企业版 $250/月 or $2500/年，价格还是相当可以的。各个版本的差异可以到 [https://dnsimple.com/pricing][18] 查看包括价格在内。

**特性：**相当的都支持，包括个人乞丐版支持 Anycast 技术，API 支持，Secondary DNS，DNSSEC 也支持，解析速度也比较快。

**特色中的特色：**可能整个公司的员工是文艺青年的缘故，他们会根据你的 DNS records 来给你作曲一个，最下面有一个播放按钮。这个叫做 [DNSound，Hear your domains][19] 是他们的介绍和整个功能的界面预览。

**提示：**
> This provider uses CloudFlare Virtual DNS to proxy-cache DNS request through CloudFlare*

## [DNS Made Easy][91] ##
**方案：**付费 / Small Business，Business，Corporate / No Obligation Free Trial

世界级 DNS 服务商，DNS 服务领域全球老大哥，DNS 行业领域的零大哥级别。都是年付，没有月付价格，没有试用。

不同的特性支持依赖于不同的付费方案，具体可以参看 [https://dnsmadeeasy.com/pricing/][20] ，支持的域名和查询次数也是有限的。值得一提的是在 DNS 解析整个领域，DNSMadeEasy 是有话语权和一席之地的鼻祖级企业。

还值得一提的是，国外的企业，有一部分会在自己的网站上列举一些竞争对手和自己的产品的特性或者价格比较等等，这点 DNSMadeEasy 也不例外，在这里 [https://dnsmadeeasy.com/pricing/pricecomparison/][21] 。这个行为貌似通常在国内的行业内不会？还有比如 Namecheap 啊 Namesile 啊 GoDaddy 啊等等都有过这种做法，把自己和别的竞争对手比较，还有一些主机商，域名注册商也都是如此。

**特性：**100% SLA，Failover，API，实时统计，支持 ANAME 记录，支持 GEO 路由，支持 Vanity DNS，支持 Record Templates。

## [UltraDNS][22] ##
**方案：付费**

据称是企业 Managed DNS 领域具有一定历史和地位的服务N多高端客户的 DNS 专业服务商，据说 Amazon 就试用他家的服务，价格奇贵，而且是根据查询数来购买的，对于低级的套餐支持的特性比较少，高级的则比较良好，属于贵族 DNS，个人基本没有办法使用。

具体请看 [https://www.security.neustar/dns-services/managed-dns-packages][22] （**请用 Google Chrome 打开，否则可能不能正常显示！**）

## [ClouDNS][92] ##
**方案：**免费 专业版 创业版 商业版

专业 DNS 服务商，他们包含有只支持 3个 域名而且有限特性的免费版功能。收费方案包括三个大类，第一类 Premium DNS hosting 有 free，Personal $2.00/month ，StartUP $5.00/month 和 Business $15.00/month 。然后还有 DDOS Protected DNS 和 GEODNS 两大类方案。整体而言，虽然价格很灵活，但是价格是比较合理的，而且官网常年有活动，价格非常低廉。要说唯一的缺点，就是网站不够酷炫不够现代（可能是另一种我欣赏不了的美吧！）

如果不区分付费方案的话，支持的特性包括几乎听过的全部特性，包括：DNSSEC，甚至包括 DNSSEC for Secondary DNS（这是非常少见的），Zone transfers（[AXFR][10]），动态 DNS，反向 DNS，SOA 可编辑，还可以针对每个记录设置 TTL，100% SLA，支持 NAPTR，支持 GEO 路由，当然也支持 DDOS 保护。支持 Anycast 技术。

## [GoDaddy Premium DNS][93] ##
**方案：**付费 / starting at $2.39/月

由于 GoDaddy 业内域名数量第一的缘故，所以 GoDaddy 的 DNS 市场占有率超高，无法知道到底是 免费+收费 市场占有率高，还是免费市场占有率高，还是收费市场占有率高。只说收费 DNS 的问题吧，价格不贵，而且 GoDaddy 常年海量的优惠券和满额优惠的活动，价格确实不贵，但是国内使用的话就要考虑连通率的问题了（这不是 GoDaddy 的错）。

**支持特性**：最多支持 5个 域名启用 DNSSEC，支持 Secondary DNS，支持 5个9 的 99.999% SLA，支持 records Templates，内置错误检查。支持无限多个域名，支持无限多个记录，支持 Anycast 任播技术。

由于 GoDaddy 比较适合大宗购买域名，所以他们的 DNS 适合大量囤积域名的时候使用而不启用 DNSSEC，对于主要使用的非停靠域名，还是使用 DNSSEC 比较好。

## [RcodeZero][94] ##
**方案：**付费 €19/月起步

**价格详细：**[https://www.rcodezero.at/en/home/#pricing][23]

欧洲一家专业的 DNS 服务商，价格比较贵，该支持的都支持，但是价格低廉的套餐就不一定支持。

不考虑套餐的情况下支持的特性：统计，DDOS保护，DNSSEC支持，AXRF支持并且支持TSIG（这个很少见），API，无限制查询数，当然也支持 IPv6。每个域名支持 100条 记录。

## [EasyDNS][95] ##
**方案：**付费 $35/年起步

专业 DNS 服务商，有三类三产品：

**DNS Standard：$35/年**

**特性：**API，3 Anycast，3 easyMail Mailboxes（难道是送3个邮箱？）

**DNS Pro：$55/年**

**特性：**100% SLA，API，Failover，修改 SOA记录，动态DNS，每条记录分别设置 TTL值，500万查询数每月，4 Anycast，10 easyMail Mailboxes。

**Enterprise DNS：$153/年**

特性：相比 DNS Pro 多了客服支持，100% SLA，电话支持等等。

## [HE.net DNS][24] ##
**方案：**免费

免费，稳定，强大，古老的 HE DNS 几乎无人不知。

最近的添加是支持了 CAA记录，优点就不说了，总之都是优点，只说缺点吧。HE DNS 是很多人想起“免费DNS”的第一反应，支持五组 DNS 服务器，同时，支持 AXFR 域名迁移（但是不支持 TSIG），还支持查看当前 Zone 文件；

**缺点：**别人支持的强大的功能它不支持的都是缺点，生效速度比较慢，不能修改 SOA，不支持 API，现在支持 50个 域名（包括从DNS（slave dns）和反向DNS（reverse dns））。

**提示：**

1. 因为生效速度慢的问题，所以先把你要解析的域名的 ns 修改成 he 的（ns1.he.net ns2.he.ent ns3.he.net ns4.he.net ns5.he.net），然后再去添加域名;如果你的 NS 只能添加四条的话，随便选择四条即可，建议写除了 ns1 以外的四条；
2. 官方提示建议把资料改成你真实的，以便在需要的时候证明你的身份和你的拥有关系；
3. 修改个人资料的地方是 页面左侧“Quick Links”中的“Certification”页面，登陆以后点击左上角的“Update Info”即可修改个人资料；
4. 由于 HE.net 账号是可删除的，而且支持二次验证登陆，所以当你有重要的域名在上面的时候建议启用二次验证。

## [CloudfloorDNS][96] ##
**方案：**付费 / 企业版 $50/月起，Secondary DNS $40/月起

专业 DNS 服务商，只有企业版和 Secondary DNS 两种方案。

**特性支持：**无限个域名，无限查询数，免费负载均衡，DDOS保护，DNSSEC，可选的 GEO 支持（Starting at $100/month）100%SLA，可选的 Failover支持（Starting at $85/month）。

## [Vultr DNS][97] ##

**方案：**免费

如同 DigitalOcean 和 Linode 一样，Vultr 也有自己的 DNS 服务，首先看官方介绍 [https://www.vultr.com/docs/introduction-to-vultr-dns][24] 。同时，Vultr 是无条件免费使用的，限制暂时没有发现，官方介绍也很少（和其他两个 VPS 服务商一样）。

**特性：**支持CAA记录，最近支持了 DNSSEC，SOA部分可编辑比如电子邮件地址，支持SSHFP记录。关于特性的官方介绍 [https://www.vultr.com/news/Get-More-With-Vultr-DNS/][25] 。如果你想很方便地使用以下 DNSSEC 的话，大部分都可以从这里开始因为很简单。

## [DNSPark][98] ##
**方案**：免费版，基础版，标准版

专业 DNS 服务商，免费版几乎什么特性都不支持而且只支持 10条 记录。

不考虑收费方案的情况下，**特性支持包括**：Anycast支持，动态DNS，API，Secondary DNS，AXRF 支持，支持 TSIG，支持 DNSSEC（support DNSSEC via our secondary DNS service）。

## [EntryDNS][99] ##
方案：有条件免费版，专业版

先说说收费的事儿，收费很有意思。不论你选择那种服务方案，你注册账户都必须付费注册费 $10，然后你使用免费版的话就可以随便用了，如果使用收费版的话 $10/年。

**免费版特性：**最多支持 25个 域名，支持 25个 子域名，API，记录类型免费版收费版没有区别，TTL 设置免费版收费版美区别。

**收费版特性：**域名和子域名数量无限制，DNSSEC 支持，IPv6 支持动态 DNS，Vanity DNS。

## [Verisign Managed DNS][100] ##

**方案：**付费

Verisign 有一些人可能不太了解，一句话介绍就知道它在互联网上的地位了：它运营着 .com .net .gov .name .edu .tv 等一大堆。还有你听过的传输中的 13组（注意是13组，不是13太，关于为什么是13组，请参考知乎 [https://www.zhihu.com/question/22587247][26]） 顶级 DNS 服务器中的 2组 。Verisign 称得上是真正的“互联网基础运营商”。那么问题来了，他家的 DNS解析服务，如果说不上数一数二，那肯定也不差。

**特性：**监控，Failover，GEO，Weighted Load Balancing 加权负载均衡，动态流量控制，DDOS 保护，支持主从DNS，DNSSEC 支持，API。

**购买：**当前 Verisign 只能通过代理商购买，当前官网给出要给供应商叫做 analyze 页面：[https://vsr-reseller.analyzecorp.com/vsr/quote.html][27]

## [Namecheap DNS][101] ##
**方案：**免费的 BasicDNS 和 付费的 PremiumDNS

Namecheap 作为 eNom 的代理商，是价格合理，活动多，服务比较不错的，尤其是随时在线的 Live Chat 客服更是基本是行业里最好的了，有什么不清楚，只要有登陆账号不管是不是他们的产品付费用户都可以问，态度也都很不错。 Namecheap 提供有域名自带的免费的 BasicDNS 和 付费的 PremiumDNS 两种服务。这里重点说下付费的 PremiumDNS 服务，该服务由前面提到的 Verisign Managed DNS 提供，可靠性自然不用说。

**特点：**100% SLA，DDOS 保护，DNSSEC 支持，Anycast 技术，月查询限制200万次。价格是 $4.88/年/域名

**几条友好提示：**

1. 付费 PremiumDNS 可以给任何注册商的任意域名使用，不管域名是不是注册在 Namecheap；
2. 一个付费 PremiumDNS 只能使用一个域名，以后不能切换到其他域名；
3. 如果你要使用 DNSSEC 功能的话，则域名必须注册在 Namecheap；
4. 当前只支持14中后缀的域名使用 DNSSEC，具体参看 [https://www.namecheap.com/support/knowledgebase/article.aspx/9718/2232/nameservers-and-tlds-supportedunsupported-by-dnssec][28] 

**特别注意：**.org 不支持 DNSSEC

## [Google Cloud DNS][102] ##
方案：付费 / 按量付费

看到名字就知道个大概了，没错，它是 Google 出品，是 Google Cloud Platform 中网络相关产品中的一个。Google Cloud DNS 是 Google 推出的一款可靠的，弹性的高可用低延迟价格低廉的权威域名解析服务。由于 Google 的作风重视开发者，重视底层服务，我们肯定猜得到必然是可编程的 DNS 服务，而且一定是提供了比较先进的特别遵循 RFC 标准的解析服务。

**价格方面：**按量付费，此服务不包含在 Google Cloud Platform 的免费套餐 [https://cloud.google.com/free/][31] 里，也不包含在永久免费套餐 [https://cloud.google.com/free/docs/always-free-usage-limits][32]里。价格由两部分组成，一个是托管的域名数量，一个是域名被查询的数量，二者结合实行阶梯计价的，对于第一阶梯来说，对于 0-25 个域名内，$0.20/月/个 域名，对于 0-1百万查询内，$0.40/月/域名。比如你有5个域名，一共加起来月查询数是1000万次，那么价格是 域名 0.2*5=1 ，查询 10*0.4=4，则一共是 1+4=5美元/月。而所有域名在功能方面都是一样的，都可以使用全部的功能和享受全部的特性。

**特性支持：**毋庸置疑首先支持的必然是 Anycast 任播技术，高可用 100% SLA，API，最低 1秒 TTL，超全记录类型支持比如 CAA DNSKEY DS NS IPSECKEY NAPTR SSHFP TLSA，当然支持 IPv6，SOA可编辑，以前不支持 DNSSEC 最近刚刚支持 DNSSEC 了（2017年12月）而且是所有后缀类型域名都支持，除了支持 API 是可编程的 DNS 以外还提供命令行工具来控制，命令行提供了 Zone 文件的导入功能可导出功能（导入导出在 WEB 界面是不提供的）。

**友好提示：**根据网友 [提示1][29] [提示2][30] Google Cloud DNS 中国大陆使用可能会有连通率问题。

## [Amazon Route53][103] ##
**方案：**付费 / 按量付费

当然，是 Amazon AWS 众多服务中的一个，高可用，可扩展，可编程强大 DNS 中的一个， Route53 在众多知名网站中使用率很高，这和亚马逊云计算强大稳定是分不开的。

Route 53 支持两种服务，一种是公网解析，就是我们平常所说的域名解析；还有一种是私网解析，如果你有多台亚马逊的云主机，可以组合一个私网，用 Route53 来解析他们。

除此之外， Route53 还支持很多高级的特性。当然，可编程是一定的。除此之外，Route53 是 DNS 解析服务中少见的支持查询日志记录的服务商，不但记录日志，而且日志可以导出到 Amazon S3，还可以和其他亚马逊的服务集成，对日志做深度分析。查询日志是按照一定的规则组织的，当然基本上包括了日志需要记录的常规数据。

**费用方面：**费用由这么几个方面组成：

1. 托管的域名数量
2. Traffic Flow 记录数
3. 标准查询数
4. 基于延迟的路由查询数
5. Geo DNS 和临近地理位置查询
6. 运行状况检查 

如果不是大流量的企业客户，只需要关注托管的域名数量和标准查询的数量即可，基本上标准查询大多数普通用户也都再第一阶梯内，值得注意的是，Route53 设置域名以后不会立马收费，如果你在12小时内删除（比如仅体验或者做测试）则是不收费的，如果是超过12小时，则按照完整一个月的费用收取。于定价的详细信息 [https://aws.amazon.com/cn/route53/pricing/][33]

**特性支持：**除了和已有地 AWS 深度集成这个特有功能比如 Amazon VPN 和 私有 DNS，支持 CloudFront 和 S3 的裸域，同时和 ELB 深度集成，还支持流量控制，基于延迟的路由，Geo DNS，故障转储，运行状态检查，支持加权轮循（WRR），Failover 当然也是支持的，Anycast 当然也不例外也支持。

**目前唯一的缺点：**不支持 DNSSEC 。

## [Zoneedit][104] ##
**方案：**免费 付费增值服务

互联网上非常老牌的免费 DNS 服务商，和 EasyDNS 是同一家；如果他自称爸爸就没有敢自称爷爷的了。几年前改版了一次，貌似发生了一次并购，以前的账户几乎不能用了，反正我试了官方提供的各种方法都没有找回自己的老账号，然后就迫不得已重新注册了一个。

**限制：**免费账户最多3个域名；非商业使用；25万查询/月；没有 SLA；只支持顶级域添加；

**费用：**默认的免费账户只有2个域名可以添加，如果你注册了账户收到一个问卷调查的话会多增加一个域名使用资格，一共就可以添加3个域名。

他们家的收费和别人不太一样，别人直接收货币而且一般都是美元，他家是按照点数计算的，一个点购买价格是 $1.4 ，如果购买 5点 的话是 $5，购买多则优惠多。Managed DNS 增值服务需要1个点数服务包包括 4组 NS 服务器，免费的只有两组；Dynamic DNS 动态DNS，WebForward 和 MailForward。Tertiary DNS 需要1个点数；Failover 需要1个点数；Backup MX需要1个点数；费用的具体可以参考 [https://www.zoneedit.com/pricing/][34]

**特点：**老牌大致的意思就是稳定，SOA 只支持修改时间相关；动态DNS；支持隐式转发（stealth forwarding）；支持CAA；支持一个查询数量的统计，不是实时的，只是一个数字，每天有多少多少；支持图形化导出和导入，支持查看当前 Zone 文件；和其他不太一样的是它提供一个查看当前添加的域名过期信息的小功能，虽然用处不是特别大但是感觉也算贴心吧；同时支持 DNS 记录在线迁移 zone transfers 功能（[AXFR][10]），这个可以配合把比如 HE.NET 或者 NS1 这种当作一个 slave DNS 使用，但是这个传输目前没有发现支持加密 TSIG

## [1984hosting][105] ##
方案：免费

自我介绍里面说是冰岛一家2006起步的公司，主要是卖主机的但是也提供免费的 DNS ，他们说自己已经成为了冰岛最大的主机商，作为小厂（对于其他竞争对手来说）本来是不会单独提出来的，主要是，他家的免费 DNS 在 2017年末这个大部分商家都不提供 DNSSEC 的情况下它提供针对全部域名支持的 DNSSEC 服务。

免费DNS提供主要DNS（Master DNS），从DNS(Slave DNS)和动态DNS（Dynamic DNS）。根据查询 NS 服务器得知他家的 DNS 架构在 Vultr 的机器上。

**特点：**最大的亮点支持 DNSSEC，支持 [AXFR][10] zone transfers 功能，支持记录模板可以快速添加常见的服务的解析比如 Office 365 需要的记录，支持 CAA，支持 SSHFP 记录，最小 TTl 900秒，支持二级域使用 DNS 服务，有个"Zone History"功能。

## [微林vxDNS][106] ##
方案：免费

微林一般人知道都是从网络加速，服务中转知道的。他家也提供DNS解析服务，并且免费。官方页面一贯地简洁，介绍不多，已知的限制是只能添加顶级域。

**特点：**内置支持主要国家的地理信息解析，高度可配置的地理信息，比如你设置可以直接给北京联通的一个网段配置一个解析；支持24小时内的查询数以图标方式展示统计；自带 A记录宕机切换 功能，默认关闭的，打开就可以了。有三组服务器。支持 API 可编程 DNS。支持裸域设置 CNAME 记录。最大最大的特点是高度可配置的区域信息，如果你需要高粒度的GEO解析，请用微林vxDNS。

[1]: https://cloud.tencent.com/document/product/302/3466
[2]: https://sdjkx.me/2013/11/dnspod-lookup-error/
[3]: https://www.v2ex.com/t/94216
[4]: https://www.dnspod.com/Customers
[5]: https://www.starbucks.com.cn/
[6]: https://www.cloudflare.com/plans/#compare-features
[7]: https://www.cloudflare.com/network/
[8]: https://www.digitalocean.com/community/tutorials/how-to-point-to-digitalocean-nameservers-from-common-domain-registrars
[9]: https://ns1.com/pricing#managed
[10]: https://en.wikipedia.org/wiki/DNS_zone_transfer
[11]: https://linode.com/docs/networking/dns/dns-manager-overview/
[12]: https://dyn.com/dns/pricing/
[13]: http://cq.qq.com/a/20161024/008099.htm
[14]: https://constellix.com/pricing/dns/
[15]: https://constellix.com/pricing/pricing-calculator/
[16]: https://www.whois.com/whois/constellix.com
[17]: https://education.github.com/pack
[18]: https://dnsimple.com/pricing
[19]: https://dnsimple.com/dnsound
[20]: https://dnsmadeeasy.com/pricing/
[21]: https://dnsmadeeasy.com/pricing/pricecomparison/
[22]: https://www.security.neustar/dns-services/managed-dns-packages
[23]: https://www.rcodezero.at/en/home/#pricing
[24]: https://www.vultr.com/docs/introduction-to-vultr-dns
[25]: https://www.vultr.com/news/Get-More-With-Vultr-DNS/
[26]: https://www.zhihu.com/question/22587247
[27]: https://vsr-reseller.analyzecorp.com/vsr/quote.html
[28]: https://www.namecheap.com/support/knowledgebase/article.aspx/9718/2232/nameservers-and-tlds-supportedunsupported-by-dnssec
[29]: https://www.v2ex.com/t/178855
[30]: https://www.v2ex.com/t/356301
[31]: https://cloud.google.com/free/
[32]: https://cloud.google.com/free/docs/always-free-usage-limits
[33]: https://aws.amazon.com/cn/route53/pricing/
[34]: https://www.zoneedit.com/pricing/
[81]: https://cloud.tencent.com/product/cns
[82]: https://www.dnspod.com/
[83]: https://www.cloudflare.com/dns/
[84]: https://m.do.co/c/7210ed2e262d
[85]: https://ns1.com/
[86]: https://www.linode.com/?r=9dd9eb40f50f375f380ea307f0bed3747331239f
[87]: https://dyn.com/
[88]: https://constellix.com/
[89]: https://zilore.com/en/dns
[90]: https://dnsimple.com/r/ddd3dcb33ea169
[91]: http://www.dnsmadeeasy.com/
[92]: https://www.cloudns.net/
[93]: https://ca.godaddy.com/hosting/premium-dns
[94]: https://www.rcodezero.at/en/home/#technology
[95]: https://www.easydns.com/
[96]: https://www.cloudfloordns.com/
[97]: https://www.vultr.com/?ref=6832994
[98]: https://www.dnspark.com/
[99]: https://entrydns.net/
[100]: http://www.verisign.com/en_US/security-services/dns-management/index.xhtml
[101]: https://ap.www.namecheap.com/settings/tools/affiliate/
[102]: https://cloud.google.com/dns/
[103]: https://aws.amazon.com/route53/
[104]: https://aws.amazon.com/route53/
[105]: https://1984hosting.com/product/freedns/
[106]: https://code.so/?rc=29417


