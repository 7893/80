---
title: PGP tools with FastMail
date: 2017-01-17 07:35:18
tags:  [FastMail,PGP,encryption,Firefox,Chrome,GNU]
---

这篇文章翻译自 [FastMail][1] 官方博客
原文：[https://blog.fastmail.com/2016/12/23/pgp-tools-with-fastmail/][2]

这是 [2016 FastMail Advent Calendar][3] 系列的第 23 篇也是倒数第二篇文章。敬请期待明天的最后一篇更新。

------------------------------------------------------------------------

我们之前的 advent 系列文章里，介绍过 为什么 FastMail 不支持 PGP（ [why FastMail doesn't have PGP support][4]）,并且我们提到过最佳的使用 PGP 的方式是通过命令行工具或 IMAP 客户端软件。

正如我们之前承诺的，一个适用于 FastMail 的关于（部分）开源的 PGP 客户端说明现在可以参阅了！我们强烈推荐使用开源加密软件，最好 [reproducible builds][5] .

不清楚类似 [PGP][6] 的加密如何工作的？这里是一个引导你进入使用 PGP 加密你的邮件（[PGP to encrypt email][8]）的基础的加密概述（[overview of encryption][7]）。如果你打算认真对待你的隐私问题，我们推荐进一步阅读以理解加密软件的风险，它带来的好处以及它们的可用性。

虽然我们在这方面已经做了一些基础的研究工作，但我们不能承诺这一定就适用于你的特定情况。

# Browser plugins #

## [Mailvelope][10] ##

- 支持平台：Firefox Chrome
- [使用说明][11]

## [WebPG][12] ##
- 支持平台：Firefox Chrome 雷鸟 SeaMonkey
- 先决条件：需要系统中已经安装 [GnuPG 和 Key Agent][13]
- [使用说明][14]

# Native clients #

## MacOS ##

### [GPGTools][15] ###
- 支持平台：macOS
- 可以用于系统自带邮件客户端，但是当前不兼容 macOS Sierra(10.12版本),临时方案（[workaround][16]）.
- [使用说明][17]

## iOS(iPhone/iPad) ##
当前没有可用的开源 iOS 软件，但是这些软件可以使用（基于 Open PGP 实现）如果你正在寻找替代方案的话。

### [iPGMail][18] ###
 - [使用说明][19]

### [PGPEverywhere][20] ###
 - [使用说明][21]<br>
 - 常见问题中说他们正在[考虑开源][22]

## Windows/Linux ##

安装一个带有插件功能的客户端以便启用 PGP 功能 </br>

- [雷鸟][23]（多平台支持）
- [Postbox][24]（Windows，非开源软件）

Plugins:</br>

- [WebPG][25]
 - 需要系统中已经安装 [GnuPG 和 Key Agent][26]
 - [使用说明][27]
- [Enigmail][28]
 - 需要已经安装 [GnuPG][29]
 - [使用说明][30]

## Android ##

### [openKeychain][31] ###
- 和邮件客户端配合使用比如 K-9
- 他们有[一个兼容的客户端列表][32]
- [使用说明][33]

## Command Line ##
我们推荐以命令行方式使用 [GNU Privacy Guard][34].支持很多平台，[开源代码和可执行文件][35]。

[Chris][36] 是我们的一名测试人员，他在他的工作笔记本上配置了 gpg 用它来安全传输数据到家里的电脑而不用带着私钥去工作。下面是他给出的一系列包括 aliases 在内的配置步骤：

生成密钥：`gpg --gen-key`（会问一些问题）
导出密钥：`gpg --armor --output ~/example.fm.key --export chris@example.fm`
这个步骤大致如下：

    -----BEGIN PGP PUBLIC KEY BLOCK-----
    Version: GnuPG v1
    
    mQENBFhbajUBCADO7Rp0dVuVb2JWv86zvnqUC32NuarYXIeCpesvqIxU8wqr7hh5
    R4IwZyVEcBYTyVaMWVhjGmxGCBhvauKb8ZivRwuUw0bHwVKCfjI+uWjB27lVwRLE
    9zxNa2NA8svzY8EgImo48KO2/YA4Rw9ozMLxM/KkmRnmnoo5oDk1jXe7I0ILOPb1
    6pQVDT/PJRrb+QXc7AMCD/Jj61PgFnPBGqLvICTTKwoeIE8dfFu7l0hwOTSloDv7
    KiiM4+Xwz2Lptt7eJAlpKImCzeH96/yPK4IfkAId2IJCC5GfChG2aovNFBrhPsMv
    9jWVNDvFvoLTyYqM5V2slaa/U6qTkWiyV3tpABEBAAG0NUNocmlzIEV4YW1wbGUg
    KFRoaXMgaXMgYSBkZW1vIGtleSkgPGNocmlzQGV4YW1wbGUuZm0+iQE4BBMBAgAi
    BQJYW2o1AhsDBgsJCAcDAgYVCAIJCgsEFgIDAQIeAQIXgAAKCRAZ87lBaIIEbq/d
    B/0Z2K9gF+e65B9da2Gim0bpEH8MNmHJlkcHgIxheMyQ7s8ClrqRRnGZRFEBw55F
    x7VGphBjav8H2czp3LKE5OrAyoT1z+kCmXZff7iHII2YIK0zzU3DsyUTpM2AOZKL
    fQ5d9nZMJY7Jg7BbDM+N1SJsw6+nRuyG0FnZfF57Qk+h1p2rZn/jadno/XeargeZ
    I2TI7GhkBg4ujB0k6Cpvr8gq394TohDcCPEYUBDI5m/5FkyHkUFO8SUGQu0fJ9/t
    xX1J91z9EW0xbcjIsmg7TtIpbM3UocoSz++svSjYz2mU546gz/76688nSrYKJ+Os
    IZ+wmJdOBc3Du28QbffXGRahuQENBFhbajUBCAC+rldeh9LKxoRblhUfaCxttOQ8
    PeqSlNC5IvPikTnjWtkThbVCsM3OYITh18Q66WSSK+2AkWlHdSH6HdaA6zNP7wqZ
    iAWf7LP1maLg/a/e8zbC3rTL5LXrtkln0IIje6aXtyq4bLGDuLQEJBo7eBqetr27
    Cb5pCatDBkOmxpQxzFQmnYfCMyC8Dm6Z2GIrLj6u5Zb0GIrNoBqhPFxD1MRsromU
    ERwWYNQjKodEllv/DMt3yAn2CQRlABxPFem16cDqFEGD/UhcJQrvpVrMbHpANWqh
    nLgcBPLhXcmJ5Zd0JhtkwapZ/mLqZkTWWmGGQRdE9RlbKoYsT1yNVeX0RntRABEB
    AAGJAR8EGAECAAkFAlhbajUCGwwACgkQGfO5QWiCBG5MYwf/ff7WBragmfCXOaTz
    LjERK1nScXzlTZ5ZeEUQTcoujbQvSuFBTw0XtiKWNN3imGhmhorjmQyMFjCmIys2
    YCur+c3Jmh6BO8q0xRJwS0jxtNjkObSx2+ICBi6gTTkrBb3ya6Uy2k4BhVfQArlv
    5UZeMcxZB8Gh8S0pC4S9s4dTBn1+i4aKSJSGITleDtSj4ZfrZ2JI/mMaJSpk1BKg
    JtTb9s+AcWpurV5HW5HCb8PKQsLndPJH5cH0xqIjW8Ha6dbsXmlCfpTNaAoOkQDC
    rqWyA3a+f4o/kgq/0cOlJHponcxWmbvTXIBwMtR0O91E5pqp4/no9SmSWefLd0yM
    zbOJdA==
    =K7Ec
    -----END PGP PUBLIC KEY BLOCK-----

在另一台机器上，比如你的工作机（其他任何你想发送消息/文件的地方），导入密钥：`gpg --import-key ~/example.fm.key` 然后添加下面的内容到你 ~/.bashrc 文件：

`alias ToChris='gpg --encrypt --recipient="chris@example.fm" --armour'
alias scramble="gpg --output encrypted.gpg --encrypt --recipient chris@example.fm "`

由于工作机没有你的密码或私钥，你可以使用如下命令行来创建加密的消息/文件：

    echo "This is a private message. Remember to feed Ninja" | ToChris
    -----BEGIN PGP MESSAGE-----
    Version: GnuPG v1
    
    hQEMA9bIhjnGSgZUAQf+N6nr/t0uGi8HRYAhaxNteWgWR0uwkDPvec6tjHj0gk50
    wtBGm1agVAIRWBg5e6w2wkfk2RqQ+ecqPCV4SpgBxdFkcEhsbYOSd81hS2jtQZtH
    EUjHK/s0ANqeN8L5a9j6NynwRYjrnFpGWKsSA+Ubd4xUb2vIktXi+BnwNsXdfRw9
    A27LZch69w2pr4zHjAyZO/PIq/SEuQ8Xu/+xhR+bq7gHBGOo9sokOle7yTDXnNdR
    VsTJaFev4K3didFsNPQWENC6dQ3gHds8qMYGMR4Nt5hIfIfrulyQItjYi/z5LGBq
    i6f7y2jSB27wUaGr4EY6vZMyjHpoIlSK0eq4h9bvRNJrAQhcLoEzDxD83oECGXTD
    8KIEc78TYlIPgPyGZ3O7GanBxg9tX0UWnjZ8ohk+QStgDiZdivkGOUL1UfByQE7B
    qwvgjYrTzu9JJll9LUDjTR0ow4OLaJdIIdPq7uRoBEyhX23mfZIFAruoc3w=
    =mjJW
    -----END PGP MESSAGE-----

然后你可以发送 GPG 消息其他人便不能阅读了（比如，复制粘贴到 FastMail 网页客户端并且作为邮件正文）

如下命令创建可以作为邮件附件的 encrypted.gpg 文件：`scramble <filename>`

# Key parties #

有许多关于 准备签名密钥（[prepare for a key signing party][9]） 的网络资料。部分是有关于学术会议的，你可以和其他人在你的领域建立一个可信的 web .需要注意的是要知道正在操作什么类型（which kind of [key party][10]）的密钥。

# Example GPG bootstrapping #

下面是 Bron 演示的创建密钥完整密钥并且替换过期密钥以及用它来签名文档的完整过程：

    brong@wot:~$ gpg --list-keys brong@fastmail.fm
    pub   rsa2048 2015-09-20 [SC] [expired: 2016-09-19]
          0FBAC288980E770A5A789BA1410D67927CA469F8
    uid           [ expired] Bron Gondwana <brong@fastmail.fm>

看看自从我上次签名东西已经过了多久了！

    brong@wot:~$ gpg --gen-key
    gpg (GnuPG) 2.1.15; Copyright (C) 2016 Free Software Foundation, Inc.
    This is free software: you are free to change and redistribute it.
    There is NO WARRANTY, to the extent permitted by law.
    
    gpg: starting migration from earlier GnuPG versions
    gpg: porting secret keys from '/home/brong/.gnupg/secring.gpg' to gpg-agent
    gpg: key 410D67927CA469F8: secret key imported
    gpg: migration succeeded
    Note: Use "gpg --full-gen-key" for a full featured key generation dialog.
    
    GnuPG needs to construct a user ID to identify your key.
    
    Real name: Bron Gondwana
    Email address: brong@fastmail.fm
    You selected this USER-ID:
        "Bron Gondwana <brong@fastmail.fm>"
    
    Change (N)ame, (E)mail, or (O)kay/(Q)uit? O
    We need to generate a lot of random bytes. It is a good idea to perform
    some other action (type on the keyboard, move the mouse, utilize the
    disks) during the prime generation; this gives the random number
    generator a better chance to gain enough entropy.

这个时候弹出了一个对话框让我选择一个密码。

    We need to generate a lot of random bytes. It is a good idea to perform
    some other action (type on the keyboard, move the mouse, utilize the
    disks) during the prime generation; this gives the random number
    generator a better chance to gain enough entropy.
    gpg: key D92B20BCF922A993 marked as ultimately trusted
    gpg: directory '/home/brong/.gnupg/openpgp-revocs.d' created
    gpg: revocation certificate stored as '/home/brong/.gnupg/openpgp-revocs.d/8D8DEE2A5F30EF2E617BB2BBD92B20BCF922A993.rev'
    public and secret key created and signed.
    
    pub   rsa2048 2016-12-22 [SC]
          8D8DEE2A5F30EF2E617BB2BBD92B20BCF922A993
    uid                      Bron Gondwana <brong@fastmail.fm>
    sub   rsa2048 2016-12-22 [E]
    
    brong@wot:~$`

现在我有了一个新密钥。让我们来上传到公钥服务器（keyservers）吧：

    brong@wot:~$ gpg --send-keys 8D8DEE2A5F30EF2E617BB2BBD92B20BCF922A993
    gpg: sending key D92B20BCF922A993 to hkp://keys.gnupg.net
    brong@wot:~$
    
    brong@wot:~$ echo "So you can all encrypt things to me now, 
    and verify my signature (assuming you trust a fingerprint from a blog)" | gpg --clearsign
    -----BEGIN PGP SIGNED MESSAGE-----
    Hash: SHA256
    
    So you can all encrypt things to me now, and verify my signature (assuming you trust a fingerprint from a blog)
    -----BEGIN PGP SIGNATURE-----
    
    iQEcBAEBCAAGBQJYW7nPAAoJENkrILz5IqmT554IAL6cg6+ILkrKeLQlzDtA7pZ9
    IluYJCt+HpvGw4wXnOmxLyWa/PkWvHUwAAQ9GpgZq7ZB8Sv4HPkm4sRz3zRvcsfR
    gpfp5YmYk/i8Oj482jYp1lsngTCEeHkLNWrvXZyoiVUzWbfhYOzrkIDRwgNUCXuF
    i/pgYT4K36d6OdfKbI4jsC62sJT20H8qjO9/I5o0gcmb+axv/kSuO87jvGySMXT5
    EAYtogDd+jCL1FB0iyu01oUUoTRqgayMUWChJeofVZ9sehqyhXNoYNp4+/+jusmG
    nblWeEYZ2S9d5jBNcHgd5cWQDwlBCJKnx1O8Qj9VO+hkBJBB7wHMAIyei8VsIbM=
    =QT0N
    -----END PGP SIGNATURE-----

现在你可以说我些的这个没有任何一个我的同事可以编辑而且是绝对私密的了（And you can tell that I wrote this and none of my colleagues can edit that text and put words in my mouth）（除非他们用我的电子邮件创建了不同的密钥伪造了这篇文章中关于创建密钥的部分！！！）

命令行方式是最安全的使用 PGP 的方法，这种方式下你的电子邮件客户端和加密软件是完全分开独立运行的，只有密文或签名后的密文被传输到了你要从你的安全计算机外发的邮件中。

 [1]: https://www.fastmail.com/?STKI=16759801
 [2]: https://blog.fastmail.com/2016/12/23/pgp-tools-with-fastmail/
 [3]: https://blog.fastmail.com/2016/12/01/fastmail-advent-2016/
 [4]: https://blog.fastmail.com/2016/12/10/why-we-dont-offer-pgp/
 [5]: https://reproducible-builds.org/
 [6]: https://en.wikipedia.org/wiki/Pretty_Good_Privacy
 [7]: http://www.explainthatstuff.com/encryption.html
 [8]: http://www.bitcoinnotbombs.com/beginners-guide-to-pgp/
 [9]: http://www.phillylinux.org/keys/terminal.html
 [10]: https://www.mailvelope.com/
 [11]: https://www.mailvelope.com/help
 [12]: https://webpg.org/
 [13]: https://webpg.org/docs/webpg-userdocs/#!/guide/prerequisites
 [14]: https://webpg.org/docs/webpg-userdocs/#!/guide/introduction
 [15]: https://gpgtools.org/
 [16]: https://gpgtools.tenderapp.com/kb/gpgmail-faq/gpgmail-no-longer-working-after-macos-update4
 [17]: https://gpgtools.tenderapp.com/kb/how-to/first-steps-where-do-i-start-where-do-i-begin
 [18]: https://ipgmail.com/
 [19]: https://ipgmail.com/guide/
 [20]: http://pgpeverywhere.com/
 [21]: http://pgpeverywhere.com/help.html
 [22]: http://www.pgpeverywhere.com/faq.html
 [23]: http://www.mozilla.org/thunderbird/
 [24]: https://www.postbox-inc.com/
 [25]: https://webpg.org/
 [26]: https://webpg.org/docs/webpg-userdocs/#!/guide/prerequisites
 [27]: https://webpg.org/docs/webpg-userdocs/#!/guide/introduction
 [28]: https://www.enigmail.net/index.php/en/
 [29]: https://enigmail.wiki/Installation_of_Enigmail
 [30]: https://www.enigmail.net/index.php/en/documentation/user-manual
 [31]: https://www.openkeychain.org/
 [32]: https://www.openkeychain.org/apps/
 [33]: https://www.openkeychain.org/howto/#/
 [34]: https://www.gnupg.org/
 [35]: https://gnupg.org/download/index.html
 [36]: https://blog.fastmail.com/2016/12/18/interview-chris/
