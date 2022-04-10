---
title: Guide to use Google Cloud DNS
date: 2018-01-03 22:49:17
tags: [DNS,SPF,DKIM,DMARC,Google,Anycast,CloudDNS,DNSSEC,GoogleCloudPlatform,gCloud,SOA,CAA,GoogleDomains]
---

# 介绍 #
Google Cloud DNS 是运行在 Google 基础架构上的可扩展、可靠、托管式的权威域名系统 (DNS) 服务。它延迟低、可用性高，是将您的应用和服务提供给用户的一种经济实惠的方式。Cloud DNS 是可编程的。您可以使用我们简单的界面、命令行界面或 API 轻松地发布和管理数百万个 DNS 地区和记录。由于谷歌试用了 Anycast（任播）技术并且云平台是弹性的，所以可以提供给用户 生产级质量的高流量权威 DNS 服务 而且可在全球任何地方以高可靠低延迟访问。100% SLA 保证。同时，所有的访问都是支持 DNSSEC 的，这保证了一定的安全性。

# 价格 #
Google Cloud DNS 根据网文介绍之前是有 5K 每天的免费查询额度的，但是现在已经取消了免费额度。所有的服务都是收费的，其实收费机制也很简单，只有两部分组成：托管的域名数量和域名查询数量。而且，无论是域名数量还是查询数量，都是越多越便宜。对于最低配置而言，总量 25个 域名以内的 1个 域名按照每月最低套餐的 100万 查询以内的话，则是 域名托管费用 $0.20 + $0.40 = $0.60 ，价格是相当的经济实惠。[价格细节][1] 

# 规模 #
当前（2018年1月3日），Google Cloud DNS 有 ns-cloud-a1.googledomains.com 到 ns-cloud-h1.googledomains.com 这么 8 大组解析服务器，每组又有 ns-cloud-a1.googledomains.com ns-cloud-a2.googledomains.com ns-cloud-a3.googledomains.com ns-cloud-a4.googledomains.com 这么 4 小组解析服务器。
不幸：每一大组的第一个 ns-cloud-*1.googledomains.com 中国大陆均无法 ping 通。虽然你可以删除第一个，但是无法保证获得 100% SLA。

# 特性 #
1. 前面已经提过支持 Anycast 和 DNSSEC 并且 100% SLA 保证。
2. 除了常规的记录类型以外，当前还支持 CAA IPSECKEY NAPTR NS PTR SOA SSHFP 和 TLSA 记录。虽然支持 SPF 类型，但我还是强烈建议把 SPF 按照 TXT 类型来写。[支持记录类型细节][4]
3. 最低 1秒 TTL。
4. SOA 可以编辑
5. 支持多级域名，不限于顶级域名。

# 先决条件 #
使用 Google Cloud DNS 之前，需要满足这两个条件：

1. **启用账单**，就是添加了信用卡而且你当前的项目链接到了某个账单账户。对于中国大陆用户而言，Google 接受 Visa MasterCard 借记卡和 Visa MasterCard AmericanExpress 大莱卡（Diners Card）和 JCB 实体信用卡。不接受虚拟卡和预付卡。国内发卡行发行的信用卡（62 开头银联不行）基本都是可以接受。[支付细节][2]
2. **安装 gcloud** 。（这个主要是为了导入和进行大量操作而准备，如果你的域名和域名记录数不多的话或者你可以接受手工操作的话则不必安装（仅仅针对 Google Cloud DNS 而言，对于其他 Google Cloud Platf 产品而言是否需要安装取决于你自己的需求））。我比较推荐在国外的 VPS 上安装 gcloud 客户端，如果你在试用国内的 VPS 的国内节点或者是国外 VPS 的国内节点等不能从 VPS 内访问谷歌的话则不要安装在此类 VPS 上。要安装在可以访问谷歌的 VPS 上。[安装细节][3]

# 日志记录 #
当前（2018年1月4日）不支持查询日志记录，但是支持你的操作的审计日志（audit logs）将会被保存 400 天。这部分内容可以到 [https://console.cloud.google.com/logs/][6] 查看。

# 基本使用 #

大部分的操作都可以在网页提供的图形界面中操作，**除了导入和导出和事务还有变更等高级操作**。当然，如果你有大规模操作的需求或者事务的操作需求，则必须试用命令行。

gcloud dns 工具提供了三类操作对象：**managed-zones** **project-info** 和 **record-sets**

**managed-zones**: 管理域名基本操作。提供的操作有 添加域名 删除域名 列举域名 和 描述域名细节

**project-info**: 项目信息细节描述，这个需要项目 ID 。就是创建 Google Cloud 项目的时候你指定的那个 ID ，一般是字母和数字的一个组合而且是全局唯一。

**record-sets**:记录管理基本操作。提供的操作除了有 导出 导入 列举当前记录 这三个显而易见的以外，还提供有 事务（transaction）和 变更（changes）的操作。

假设我们要操作如下任务：

1. 添加一个叫做 "staff-mail" 的 staff.mail.eg.zone 域名到一个叫做 "project-demo-20180104" 的项目下；
2. 给这个域名添加 1 个 A 记录 和 1 个 AAAA 记录；
3. 给这个域名添加 1 个 DKIM 和 1 个 DMARC 的 TXT 类型记录；（关于 SPF DKIM 和 DMARC [参考本文][7]）
3. 给这个域名添加 2 个 MX 记录；
4. 把 MX 和 DKIM 和 DMARC 放到一个叫做 "exmail" 的事务中；
5. 控制 "exmail" 事务的行为；
6. 查看记录变更细节；

## 添加域名 ##

    gcloud dns managed-zones create "staff-mail" --dns-name="staff.mail.eg.zone." --description="A zone for staff mail"

注意：Google Cloud DNS 每次操作的时候都根据 Zone name 来标示域名而不是根据域名来标示。也就是上面的例子中的 "staff-mail"。

同时，Google Cloud DNS 支持全局 flag 来控制命令行工具的一些行为和属性。[细节][5] 页面中的 "GLOBAL FLAGS"部分

## 列举域名 ##

    gcloud dns managed-zones list

## 描述域名细节 ##

    gcloud dns managed-zones describe "staff-mail"

## 删除域名 ##

    gcloud dns managed-zones delete "staff-mail"

## 描述项目信息 ##

    gcloud dns project-info describe "project-demo-20180104"

这个操作可以获取当前项目下的资源试用限额，如果你的资源使用量大，就用这个查看，查询结果大致如下：

    id: project-demo-20180104
    kind: dns#project
    number: '964123456789'
    quota:
        kind: dns#quota
        managedZones: 10000
        resourceRecordsPerRrset: 100
        rrsetAdditionsPerChange: 1000
        rrsetDeletionsPerChange: 1000
        rrsetsPerManagedZone: 10000
        totalRrdataSizePerChange: 100000

## 导入记录 ##

假设我们有一个 "staff-mail.zone" 文件是从其他地方导出获得的，注释掉 SOA 和 NS 记录，大致内容如下：


    staff.mail.eg.zone. 300 IN A 10.134.12.34
    staff.mail.eg.zone. 300 IN AAAA 2604:a880:1a:2c::6b:1

    staff.mail.eg.zone. 300 IN MX 10 alt1.aspmx.l.google.com.
    staff.mail.eg.zone. 300 IN MX 20 alt2.aspmx.l.google.com.

    ;staff.mail.eg.zone. 21600 IN NS ns1.he.net.
    ;staff.mail.eg.zone. 21600 IN NS ns2.he.net.
    ;staff.mail.eg.zone. 21600 IN NS ns3.he.net.
    ;staff.mail.eg.zone. 21600 IN NS ns4.he.net.
    ;staff.mail.eg.zone. 21600 IN SOA ns1.he.net. dnsmaster.he.net. 2 21600 3600 259200 300

    _dmarc.staff.mail.eg.zone. 300 IN TXT "v=DMARC1; p=none; sp=none; fo=1; aspf=s; adkim=s; rua=mailto:postmaster@example.com; ruf=mailto:postmaster@example.com"

    exmail._domainkey.staff.mail.eg.zone. 300 IN TXT "v=DKIM1; k=rsa; p=H23456789039digNp7HWM3+FK9xfWR4vFAX7Xpdy1Q78eR7MsysdGK0i9Wn8OzHFNZsicBuDU8PFtq39TLVq1ahlNHhgMIGfMA0GCSqGSIb3DQEBAQUAAaassB0EZueo2GCtZE5dmbrwIDAQAB"

使用命令导入：

    gcloud dns record-sets import ./staff-mail.zone --zone-file-format -z "staff-mail"

然后你会看到大致如下：

    Imported record-sets from [./staff-mail.zone] into managed-zone [staff-mail].
    Created [https://www.googleapis.com/dns/v1/projects/project-demo-20180104/managedZones/staff-mail/changes/1].
    ID  START_TIME                STATUS
    1   2018-01-03T17:49:26.367Z  pending

关于导入的小提示：

1. 注释掉 ns 和 soa 记录，因为你的 zone 文件来自于先前的 dns 服务商，很明显这里要使用 Google Cloud DNS 的新内容了，如果你对 SOA 记录的部分内容有修改需求，可以等导入以后再图形界面修改即可。
2. 部分 txt 字段过长可能会导致导入失败，当前已知如果你的 Gsuite 的 dkim 使用了 2048 位的话会因为记录过长而导入失败，所以需要改成 1024 位。

## 导出记录 ##

    gcloud dns record-sets export staff-mail.zone --zone "staff-mail" --zone-file-format

## 列举当前变更 ##

    gcloud dns record-sets changes list -z "staff-mail"

然后你会看到大致如下：

    ID  START_TIME                STATUS
    1   2018-01-03T17:49:26.367Z  done
    0   2018-01-03T17:10:13.956Z  done

可以看到 ID 为 1 的 changes 已经从 pending 变为 done 了。

描述当前变更细节：

此处我们查看上面我们导入操作这个 changes 的细节内容，所以 ID 指定的是 1：

    gcloud dns record-sets changes describe 1 -z "staff-mail"

得到回馈大致如下：

    additions:
    - kind: dns#resourceRecordSet
      name: _dmarc.staff.mail.eg.zone.
      rrdatas:
      - '"v=DMARC1; p=none; sp=none; fo=1; aspf=s; adkim=s; rua=mailto:postmaster@example.com;
    ruf=mailto:postmaster@example.com"'
      ttl: 300
      type: TXT
    - kind: dns#resourceRecordSet
      name: exmail._domainkey.staff.mail.eg.zone.
      rrdatas:
      - '"v=DKIM1; k=rsa; p=H23456789039digNp7HWM3+FK9xfWR4vFAX7Xpdy1Q78eR7MsysdGK0i9Wn8OzHFNZsicBuDU8PFtq39TLVq1ahlNHhgMIGfMA0GCSqGSIb3DQEBAQUAAaassB0EZueo2GCtZE5dmbrwIDAQAB"'
      ttl: 300
      type: TXT
    - kind: dns#resourceRecordSet
      name: staff.mail.eg.zone.
      rrdatas:
      - 10.134.12.34
      ttl: 300
      type: A
    - kind: dns#resourceRecordSet
      name: staff.mail.eg.zone.
      rrdatas:
      - 2604:a880:1a:2c::6b:1
      ttl: 300
      type: AAAA
    - kind: dns#resourceRecordSet
      name: staff.mail.eg.zone.
      rrdatas:
      - 10 alt1.aspmx.l.google.com.
      - 20 alt2.aspmx.l.google.com.
      ttl: 300
      type: MX
    - kind: dns#resourceRecordSet
      name: staff.mail.eg.zone.
      rrdatas:
      - ns-cloud-c1.googledomains.com. cloud-dns-hostmaster.google.com. 2 21600 3600 259200
    300
      ttl: 21600
      type: SOA
    deletions:
    - kind: dns#resourceRecordSet
      name: staff.mail.eg.zone.
      rrdatas:
      - ns-cloud-c1.googledomains.com. cloud-dns-hostmaster.google.com. 1 21600 3600 259200
    300
      ttl: 21600
      type: SOA
    id: '1'
    kind: dns#change
    startTime: '2018-01-03T17:49:26.367Z'
    status: done

## 列举记录集 ##

    gcloud dns record-sets list -z "staff-mail"
    
得到回馈差不多和我们导入的 zone 文件内容一致，就是当前的记录集。

## 导出 ##

    gcloud dns record-sets export staff-mail.zone --zone "staff-mail" --zone-file-format

## 添加事务 ##

这里我们添加两个事务，不使用 --transaction-file 表示使用了默认的事务文件名即"transaction.yaml"。

    gcloud dns record-sets transaction start --zone="staff-mail"
    gcloud dns record-sets transaction start --zone="staff-mail" --transaction-file="exmail.yaml"

## 添加记录到事务 ##

这里我们把上面提到的 A 和 AAAA 添加到默认事务，把 MX 和 DKIM 和 DMARC 添加到 "exmail.yaml" 事务中。

    gcloud dns record-sets transaction add --name "staff.mail.eg.zone." --ttl 300 --type "MX"  "10 alt1.aspmx.l.google.com." --zone "staff-mail" --transaction-file="exmail.yaml"
    gcloud dns record-sets transaction add --name "staff.mail.eg.zone." --ttl 300 --type "MX"  "20 alt2.aspmx.l.google.com." --zone "staff-mail" --transaction-file="exmail.yaml"
    gcloud dns record-sets transaction add --name "_dmarc.staff.mail.eg.zone." --ttl 300 --type "TXT"  "v=DMARC1; p=none; sp=none; fo=1; aspf=s; adkim=s; rua=mailto:postmaster@example.com; ruf=mailto:postmaster@example.com" --zone "staff-mail" --transaction-file="exmail.yaml"
    gcloud dns record-sets transaction add --name "exmail._domainkey.staff.mail.eg.zone." --ttl 300 --type "TXT"  "v=DKIM1; k=rsa; p=H23456789039digNp7HWM3+FK9xfWR4vFAX7Xpdy1Q78eR7MsysdGK0i9Wn8OzHFNZsicBuDU8PFtq39TLVq1ahlNHhgMIGfMA0GCSqGSIb3DQEBAQUAAaassB0EZueo2GCtZE5dmbrwIDAQAB" --zone "staff-mail" --transaction-file="exmail.yaml"

## 描述事务细节 ##

    gcloud dns record-sets transaction describe --zone="staff-mail"
    gcloud dns record-sets transaction describe --zone="staff-mail" --transaction-file="exmail.yaml"

我们会发现 SOA 属于默认事务。

## 从事务里删除记录 ##

    gcloud dns record-sets transaction remove --name "_dmarc.staff.mail.eg.zone." --ttl 300 --type "TXT"  "v=DMARC1; p=none; sp=none; fo=1; aspf=s; adkim=s; rua=mailto:postmaster@example.com; ruf=mailto:postmaster@example.com" --zone "staff-mail" --transaction-file="exmail.yaml"

## 中断事务并且删除事务文件 ##

    gcloud dns record-sets transaction abort --zone="staff-mail"
    

## 启用 DNSSEC 支持 ##

    gcloud beta dns managed-zones update "staff-mail" --dnssec-state on

## 禁用 DNSSEC 支持 ##

    gcloud beta dns managed-zones update "staff-mail" --dnssec-state off

如果启用了 DNSSSEC 的话，在域名注册商那里填写相关的 DS 记录或者其他信息即可。

## DNSSEC 状态验证 ##


- [http://dnsviz.net/][8]
- [https://zonalizer.makeinstall.se/][9]
- [http://dnssec-debugger.verisignlabs.com/][10]
- [https://zonemaster.net/][11]

# 其他使用 Google Cloud DNS 办法 #

其实是没有办法的，但是，发现 Google Domains 默认提供的 DNS 服务使用的 NS 和 Google Cloud DNS 是一样的。作为个人和小流量没有苛刻需求的情况下，可以把域名转入 Google Domains 来几乎免费使用和 Google Cloud DNS 品质一样的 DNS 解析服务。

## Google Domains 自带 DNS 解析大致特性 ##


1. 内建支持 DNSSEC 而且方便使用只需要启用即可，手动添加 DS 的步骤都省了；
2. 支持动态 DNS 解析；
3. 支持一键设置 Gsuite 各种相关的 DNS 记录；
4. 支持设置跳转；
5. 可以设置胶水记录（glue records）；
6. 支持 CAA DS SSHFP TLSA 记录；
6. 但是当前已知 Google Domains 自带 DNS 限制每个域名只有 100 条记录（对一般需求绝对够用）；

## Google Domains 官方页面 ##


1. [Google Domains 价格列表和支持的域名类型][11]
1. [Google Domains 帮助页面][12]
2. [Google Domains 官方特性介绍][13]


[1]: https://cloud.google.com/dns/pricing
[2]: https://cloud.google.com/billing/docs/how-to/payment-methods
[3]: https://cloud.google.com/compute/docs/gcloud-compute/
[4]: https://cloud.google.com/dns/overview?hl=en_US#supported_dns_record_types
[5]: https://cloud.google.com/sdk/gcloud/reference/
[6]: https://console.cloud.google.com/logs/
[7]: https://6ki.org/2017/01/spf-dkim-and-dmarc.html
[8]: http://dnsviz.net/
[9]: https://zonalizer.makeinstall.se/
[10]: http://dnssec-debugger.verisignlabs.com/
[11]: https://support.google.com/domains/answer/6010092
[12]: https://support.google.com/domains
[13]: https://domains.google/?hl=en-US&_ga=2.190674338.841723577.1515056824-1687665163.1515056824#domains-features
