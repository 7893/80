---
title: SPF, DKIM & DMARC email anti-spoofing technology history and future
date: 2017-01-11 13:37:16
tags: [SPF,DKIM,DMARC,FastMail,SMTP,IMAP,Exchange,POP3,authentication,Yubikey,domain,DNS,SRS,spam,ARC]
---

----------

这篇文章翻译自 [FastMail](https://www.fastmail.com/?STKI=16759801) 官方博客
原文：[https://blog.fastmail.com/2016/12/24/spf-dkim-dmarc/](https://blog.fastmail.com/2016/12/24/spf-dkim-dmarc/)
这是第二十四篇也是 [2016 FastMail Advent Calendar](https://blog.fastmail.com/2016/12/01/fastmail-advent-2016/) 系列的最后一篇文章。谢谢大家阅读也一如既往地感谢大家使用 [FastMail](https://www.fastmail.com/?STKI=16759801) ！

----------

看看这封邮件是从谁发给谁的呢？

    From: PayPal <service@paypal.com.au>
    To: Rob Mueller <robm@fastmail.fm>
    Subject: Receipt for your donation to Wikimedia Foundation, Inc.

事实上，这些邮件头根本没有告诉你这封邮件真正地是从哪儿发到哪儿的。主要有两个彼此分开的电子邮件标准。[RFC5322](https://tools.ietf.org/html/rfc5322)（旧版RFC822/RFC2822）规定了电子邮件格式，包括邮件头比如 发件人/收件人/邮件标题 和电子邮件正文。然而，它并没有规定电子邮件如何在不同的电子邮件系统之间传递。[RFC5321](https://tools.ietf.org/html/rfc5321)（旧版RFC821/RFC2821）中规定了 简单邮件传输协议（SMTP），它详细地规定了电子邮件在不同系统之间的传递方式。
这种标准分开设计的结果是：邮件消息的格式不需要和邮件的发件人或收件人有任何关系。意思是，你在电子邮件中看到的 发件人/收件人/抄送 这些邮件头也许和这封邮件在 SMTP 传递过程中使用的真正的发件人或者真正的收件人没有关系。
当电子邮件标准制定的时候，互联网是一些人们互相之间认识的一些大学的计算机组成的网络。标准制定的假定情况是邮件用户和其他发送者是互信的。
所以，发件人 字段应该就是这个电子邮件地址的主人。当你要指定收件人的时候，收件人地址应该写在收件人字段并且以 SMTP 为协议发送给收件人（通过 SMTP 的 `RCPT TO` 命令）。这种分离邮件格式和传递也允许类似秘送([Bcc, blind carbon copy](https://en.wikipedia.org/wiki/Blind_carbon_copy))。任何秘送字段中的地址将不会出现在邮件头中，但是SMTP可以用来把邮件发送到正确地目的地。
随着时间的推移，这种互信的友善的网络环境变得越来越不那么可信了。我们现在的网络环境更多的是恶意和不可信的。我们现在迫切需要保护我们的系统远离垃圾邮件和钓鱼邮件的侵害，因为他们大多数都是为了欺诈用户。
从使用 实时黑名单 （RBLs Realtime Blackhole Lists)判断已知的垃圾邮件发送服务器到邮件内容分析确定是否为垃圾邮件，已有多种层次的垃圾邮件控制手段。在这里，我们将讨论主流的反垃圾邮件技术。

# SPF

反欺诈邮件最早期的一个成果是 [SPF（Sender Policy Framework 发送方策略框架）](https://en.wikipedia.org/wiki/Sender_Policy_Framework)，SPF 的主导思想是指定通过域名的邮件发送方，通过 DNS 记录来指明特定的域名允许发送邮件的服务器。比如，只允许服务器 x，y和z 发送 @fastmail.com 的邮件。
不幸的是，SPF存在许多问题。起初，SPF只能用于 SMTP 发送协议的域名，也就是 MAIL FROM 这样的信封地址。甚至没有电子邮件软件显示这个地址。（它的主要用途是当邮件发送失败的时候发送错误/退回邮件而使用。）如今，没有必要非得 MAIL FROM 地址匹配发件人字段。**所以实际上，邮件反欺诈的对象其实是一个跟本没有人看到过的地址（the only thing youʼre protecting against is the spoofing of an email address no one ever sees）**。
在这种理论之下，它却是有效地防范了大量的垃圾邮件。它减少了退信（[backscatter email](https://en.wikipedia.org/wiki/Backscatter_)），退信就是当你不能收到仿冒邮件的时候看到的邮件。
实际的情况是，只有在如果人们确实挡住了 SMTP 阶段的 SPF 检查的邮件时才有效。很少由于 SPF 有许多问提而有效。它完全打破了传统的邮件转发。当系统转发一封邮件的时候，系统假定 MAIL FROM 被保存用来当邮件转发失败的时候退回给发送者。不幸的是，这意味着某人从 Hotmail 发送了一封邮件给 FastMail，然后你从 FastMail 转发到了 Gmail，在从 FastMail 转发到 Gmail 这个过程中就有了问提。其中 MAIL FROM 地址是一个 @hotmail.com 的域名，但是 SPF 将表明的是 FastMail 是不能被允许用来发送以 @hotmail.com 为域的邮件的。
有种方法 发送者重写策略（[SRS， Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme)）试图完善这个问提，但是它过于复杂。它让 SFP 提供的保护被相对地降低了，并没有太多地方选择使用 SRS。这种方案以本着对发送方对邮件的签名的尊重就这样终止了。如果 SPF 检查通过，那么或许这封邮件是 MAIL FROM 中的域的合法的邮件。如果 SPF 检查失败，好吧，也不能说明很多问提。有可能这是一封被转发的邮件，也可能是 SPF 记录没有配置，或者许多其他的可能。

# DKIM

DKIM（DomainKeys Identified Mail 域名密钥识别邮件标准）是一个明显相比 SPF 符合和有意思的标准。它允许域所有者（同样的，通过 DNS 记录的方式）加密地签名邮件的部分内容以便收件人验证它们是否被修改了。
DKIM is a bit fiddly at the edges and took a while to get traction，但是现在它已经被广泛使用了。发送到 FastMail 的邮件大约有 80% 都是经过 DKIM 签名的。
让我们来看看开始的时候那封邮件中添加的 DKIM 签名：

    DKIM-Signature: v=1; a=rsa-sha256; d=paypal.com.au; s=pp-dkim1; c=relaxed/relaxed;
        q=dns/txt; i=@paypal.com.au; t=1480474251;
        h=From:From:Subject:Date:To:MIME-Version:Content-Type;
        bh=Vn79RZZBrNIu4HFwGMOOAezyw/2Ag+w+avW1yscPcUw=;
        b=...
    From: PayPal <service@paypal.com.au>
    To: Rob Mueller <robm@fastmail.fm>
    Subject: Receipt for your donation to Wikimedia Foundation, Inc.

使用公钥加密和 DNS 查询，邮件接收者可以判断域“paypal.com.au”签名了邮件正文和一些邮件头（这个例子中有 发件人，标题，日期，收件人 等等）。如果签名有效，则认为这封邮件的邮件头和正文在传输过程中没有被修改过。
虽然这很有效，但是仍然有一个很大的问题。
那些以 @paypal.com.au 结尾的没有经过签名的邮件呢？或许不是 PayPal 的每个部门的邮件都正确设置了 DKIM 签名。那我们是否觉得这些没有签名的邮件就是不可信的呢？
并且，我如何知道我能信任这封经过签名的邮件？在这个例子中，paypal.com.au 很可能是属于 Australian division of PayPal Holdings 公司，但是，paypal-admin.com 呢？这并没有明确我应该信任哪个域不信任哪个域。在这个例子中，发件人字段匹配域的 DKIM 签名，但事实情况不一定如此。你可以给任何域都签名 DKIM 信息。这并不能阻止骗子使用签署了 paypal-admin.com 的 DKIM 签名的 @paypal.com.au 发件人地址。
尽管如此，DKIM 提供了正确的信息。它可以使邮件接收方去 associate 域名（或者多个，由于同一封邮件拥有多个 DKIM 签名是可以的并且很多情况下是有用的）和它签名的邮件。随着时间的推移，邮件接收者可以为域和/或和它关联的 IPs 建立一个可信的衡量，发件人地址，和其他邮件特性。这对区别“可信的”邮件和“不可信”的邮件是有帮助的。

# DMARC

[DMARC (Domain-based Message Authentication, Reporting & Conformance)](https://en.wikipedia.org/wiki/DMARC) 试图解决 SPF 和 DKIM 二者遗留的可信问提。仍然，通过 DNS 记录，域所有者可以定义邮件接收者接受到邮件后的行为。就 DMARC 来说，我们通过查看发件人字段认为邮件来自一个特定的域：--当你收到邮件的时候看到的地址。
基本上，在你设置一个 DMARC 记录后邮件接收者应该：

1. 检查发件人字段的域是否匹配 DKIM 签名的域（这个过程叫做 校验（[alignment](https://en.wikipedia.org/wiki/DMARC#Alignment)））以及 DKIM 签名是否有效；
2. 检查发件人域头字段是否匹配 SMTP 的 MAIL FROM 域以及发件人的 IP 地址是否被 SPF 所允许；

如果有**其一（either）**检查通过，则这封邮件的 DMARC 则通过检查。如果都检查失败， DMARC 的 DNS 记录规定了接收方应该采取的行为，包括隔离邮件（发送到你的垃圾邮件箱）或者拒收。此外， DMARC 记录可以指定一个电子邮件地址来接受 DMARC 报告。 DMARC 还允许发送方指定 DMARC 记录生效的邮件百分比，所以可以以一种逐渐地可控地方式进行 DMARC 的配置。
回到我们的例子邮件中：

    DKIM-Signature: v=1; a=rsa-sha256; d=paypal.com.au; s=pp-dkim1; c=relaxed/relaxed;
        q=dns/txt; i=@paypal.com.au; t=1480474251;
        h=From:From:Subject:Date:To:MIME-Version:Content-Type;
        bh=Vn79RZZBrNIu4HFwGMOOAezyw/2Ag+w+avW1yscPcUw=;
        b=...
    From: PayPal <service@paypal.com.au>
    To: Rob Mueller <robm@fastmail.fm>
    Subject: Receipt for your donation to Wikimedia Foundation, Inc.

在这个例子中，发件人域是 paypal.com.au 我们来看看是否被配置了 DMARC 规则。

    $ dig +short _dmarc.paypal.com.au TXT
    "v=DMARC1; p=reject; rua=mailto:d@rua.agari.com; ruf=mailto:dk@bounce.paypal.com,mailto:d@ruf.agari.com"

是的，得到了 DMARC 配置信息。我们来进行分析！发件人域是否匹配 DKIM 签名域 paypal.com.au？匹配,我们完成了校验。如果这封邮件没有被 DKIM 签名，或者如果它被签名了但是被签名的是 paypal-admin.com（假设被不法之徒签名了），这样的话将不会完成校验，因此 DMARC 校验将会失败。在这点上，我们已经了解过 DMARC 规则了，它指定了 p=reject 我们应该拒收这封仿冒邮件。
在这个例子中（我没有写出完整的 DKIM 签名，但我可以告诉你签名是有效的），这封电子邮件通过了 DMARC 验证。所以我们可以接受它。通过校验，我们清楚了发件人地址的域也和 DKIM 签名中的域是匹配的。这一点可以让用户确信当他们看到一个发件人：@paypal.com.au 地址的时候，他们知道这确实是一封来自 paypal.com.au 的邮件而不是仿冒邮件。
这就是为何 DMARC 被认为是反仿冒邮件的未来。意思就是发件人的域不能被仿冒（至少域有 DKIM 签名并且发布了 DMARC 规则）。**所有的这一切，某种程度上仅仅是保证了发件人地址的域不会被仿冒。（All that, just to ensure the domain in the From address canʼt be forged, in some cases.）**
不幸的是，按照套路来说，这个特性当然也会带来一些问提。
DMARC 允许你使用 SPF 或 DKIM 来验证一封邮件。如果你没有 DKIM 签名但是仅仅 依赖 SPF 的话，如果一封邮件从一个邮件服务商转发到另一个邮件服务商，DMARC 校验将会失败。如果你设置了 p=reject 规则的话，这个转发将会失败。不像 SPF 中那样校验失败更像是一种“弱签名”， DMARC 规则是假定告知接收者更严格的规则，使退信是一种更大的可能性。
解决方案：如果你有 DMARC 规则则确保总是用 DKIM 签名了邮件。如果你的邮件被转发，SPF 规则将被破坏，但是 DKIM 签名应该仍是可用的（should survive）。SRS 对 DMARC 没有帮助，因为用你自己的域替换 MAIL FROM 意味着 MAIL FROM 的域将不匹配发件人头标签中的域。这会导致校验失败，会导致 DMARC 校验失败。
我说仍是可用的（should survive），因为，再次地，并不是所有地电子邮件服务商都完美支持。这个理论之下，转发保证了你地邮件地完整结构。不幸的是，并不总是如此。甚至大的电子邮件服务商也会不经意间略微地改变电子邮件的内容/结构（基于微软 [Exchange](https://blogs.msdn.microsoft.com/tzink/2016/05/19/why-does-my-email-from-facebook-that-i-forward-from-my-outlook-com-account-get-rejected/) 的邮件系统（包括 outlook.com）和苹果 iCloud 在这方面做的更差一些）。甚至一个微小的修改都会导致 DKIM 签名失败，而且，结合 DMARC 的 p=reject 规则的话，会导致这封转发邮件被目标服务商拒收。
解决方案如下：

1. 给这些邮件服务商反馈 bug 让他们完善他们的转发系统以便在传输过程中邮件保持完整性。DKIM 目前已经是一个标准了，电子邮件服务商应该确保他们的转发不破坏邮件签名。
2. 转而使用 POP 协议从远端获取邮件。我们不对通过 POP 方式获取的远端邮件做 SPF/DKIM/DMARC 检查。
3. 不要使用邮件转发。不管邮件从哪里来，改变你的邮件服务商所在的邮件地址让它直接指向 FastMail 的邮件地址，避免转发。

DMARC 还有个大问题：邮件列表。邮件列表被认为是个邮件转发的特例：你发了一封邮件，这封邮件被转发给了其他地址（邮件列表中的地址）。然而，邮件列表转发邮件的时候普遍都会修改邮件，在每一封邮件的底部加入一些取消订阅邮件的链接或者标准标准签名和/或在标题加入`[list-id]`标签。
DKIM 签名标题和正文是非常普遍的。改变它们就会破坏 DKIM 签名。所以，那么当邮件列表软件尝试转发邮件给所有的列表用户的时候，收取邮件的系统将会破坏 DKIM 签名从而导致邮件被拒收。（有件具有代表性的事情是 许多年前雅虎和AOL邮件系统都启用 p=reject ([Yahoo and AOL both enabled p=reject on their user webmail service domains a few years ago!](https://www.ietf.org/mail-archive/web/ietf/current/msg87153.html)）
幸亏，有个相对直接的解决方案。邮件列表软件可以重写邮件的发件人，并且重新对这个域进行 DKIM 签名。这一点和其他解决方案（ [couple of other solutions](https://dmarc.org/wiki/FAQ#I_operate_a_mailing_list_and_I_want_to_interoperate_with_DMARC.2C_what_should_I_do.3F) ）可以在 DMARC 网站上有说明。目前，[大多数](https://wiki.list.org/DEV/DMARC)[邮件列表软件系统](http://www.sympa.org/manual/dmarc)已经实现了对这些解决方案的兼容，那些还没有解决这个问题的邮件列表系统将不得不面对类似 Gmail明年的某个时候将启用 p=reject 规则。（[Gmail enables p=reject on gmail.com sometime early next year](https://sendgrid.com/blog/gmail-dmarc-update-2016/) ）这样的问题。不能从世界上最大的邮件系统转发邮件将明显对你的邮件列表造成影响。
这些认证体系对 FastMail 来说影响个我们收邮件和我们发邮件方面的工作。

# SPF, DKIM & DMARC for email received at FastMail

当前，FastMail 对通过 SMTP 协议收取的远端服务器的邮件进行 SPF, DKIM 和 DMARC 检查（但不影响 POP 协议收取的邮件）。
SPF 和/或 DKIM 验证通过或失败仅仅会影响这封邮件的垃圾邮件指数（spam score）.我们不想对来自一个重要的域的邮件因为 DKIM 签名验证失败而歧视，我们也不会因为垃圾邮件黑名单中的域通过的 DKIM 签名而把它移除黑名单加入白名单。 DKIM 签名只是当作邮件上下文信息对待，并不是对它进行白名单/黑名单判定的重要依据。
DMARC呢，是域的所有者对来自于他自己的域的邮件的处理方式的一个表述。对于使用了 p=quarantine 规则的域，我们对失败的邮件一个比较高的垃圾邮件指数（spam score）来确保它能到达用户的垃圾邮件文件夹。对于使用了 p=reject 规则的域，我们当前不在 SMTP 阶段拒收但是仍然给它一个比较高的指数然后隔离。未来我们希望加入一些已知的会导致问题的服务条款来改变这一点。
我们给所有收到的邮件加入了一个标准的 [Authentication-Results](https://tools.ietf.org/html/rfc7001) 邮件头标签用来说明 SPF, DKIM 和 DMARC 规则的生效情况。不可思议的是现有的软件在这方面并没有做到很好的优化（[not well maintained](https://github.com/iij/yenma) ）或者存在 [bug](https://sourceforge.net/p/opendmarc/tickets/?limit=250)，所以我们发起了一个开源项目希望别人使用（ [open source solution we hope others will use](https://github.com/fastmail/authentication_milter) ）
再次回到我们的例子当中。下面是那个 PayPal 邮件相应的 Authentication-Results 头标签。

    Authentication-Results: mx2.messagingengine.com;
        dkim=pass (2048-bit rsa key) header.d=paypal.com.au header.i=@paypal.com.au header.b=PVkLotf/;
        dmarc=pass header.from=paypal.com.au;
        spf=pass smtp.mailfrom=service@paypal.com.au smtp.helo=mx2.slc.paypal.com
    DKIM-Signature: v=1; a=rsa-sha256; d=paypal.com.au; s=pp-dkim1; c=relaxed/relaxed;
        q=dns/txt; i=@paypal.com.au; t=1480474251;
        h=From:From:Subject:Date:To:MIME-Version:Content-Type;
        bh=Vn79RZZBrNIu4HFwGMOOAezyw/2Ag+w+avW1yscPcUw=;
        b=...
    From: PayPal <service@paypal.com.au>
    To: Rob Mueller <robm@fastmail.fm>
    Subject: Receipt for your donation to Wikimedia Foundation, Inc.

大家可以看到 SPF,DKIM 和 DMARC 都通过了验证。
邮件头信息被 FastMail 系统的其他部分使用。举个例子，如果你把地址 service@paypal.com.au 加入了通讯录以便使它进入白名单。如果这类邮件的 DMARC 验证失败的话我们将忽略它的白名单属性。这保证了坏人不能用创建一个以 service@paypal.com.au 为发件人的诈骗邮件，因为你已经将它加入白名单了。

# SPF, DKIM & DMARC for FastMail and user domains

所有的 FastMail 域名当前都有较为宽泛的 SPF 规则（如此设计是为了兼顾老的系统，看下文的 DMARC）并且我们对所有发出的邮件都采用 DKIM 签名。事实上我们签名两个域名，一个是发件人地址的域还有就是众所周知的 messagingengine.com。这和那些用 DKIM 签名来判断邮件来源的系统的反馈环路设计（ [Feedback Loops](https://en.wikipedia.org/wiki/Feedback_loop_%28email%29) ）有关。
对于使用自定义域，如果你在我们这里托管 DNS 的话（[host the DNS for your domain](https://www.fastmail.com/help/receive/domains-setup-nsmx.html) ），我们仍然有较为宽泛的 SPF 规则和 DKIM 签名。如果你使用了其他 DNS 服务商解析的话，你需要确保在你的 DNS 解析李设置了正确的 DKIM 签名（[DKIM record at your DNS provider](https://www.fastmail.com/help/receive/domains-advanced.html#dkim) ） 。一旦我们检测到 DKIM 记录，我们就会使用它来签署你通过我们发出的邮件。
当前，FastMail 自己的域没有 DMARC 规则，也没有对自定义域发布默认的规则。这意味着用户可以用 @fastmail.com 从任何地方发送邮件。这种做法是有点过时了。当 FastMail 16年前刚创立的时候，这些身份认证标准还都不存在。人们使用各种复杂的他们想发送邮件的各种发件人信息来发送邮件。（老的联网传真/扫描仪是这种做法的典型代表。）
随着时间的推移，这种情况变得越来越少，并且越来越多的人们期望电子邮件是通过了 DKIM 签名并且/或者通过了 SPF 验证并且/或者有 DMARC 规则。未来的某个时候，很可能我们的域名也会启用 p=reject 规则。要发送以 @fastmail.com/@sent.com/等等为发件人的邮件，你必须通过我们的系统发送。这种方式可以通过 SMTP 可以完美认证，如今一些基础的东西都已经完美支持了。

# Ongoing problems

虽然通过 DMARC 我们可以验证发件人域名是否被允许发送邮件还可以验证邮件内容，是个很有效的方法欺诈邮件的特性，但反欺诈仍然有很长的路。虽然我们在这方面很有经验但是用户一般不会持怀疑态度去检查邮件。我们经常看到这样的欺诈邮件：

    From: No Reply <joeblogs@completelyrandomsite.com> To:
    foobar@fastmail.com Subject: Urgent! Your account is going to be closed!
    
    Click [here](http://example.com) right now or your account will be closed

很多用户就点开了链接，在一个伪造的页面上输入了登陆信息（甚至包括那些看起来都不是 FastMail 的页面的页面），我们每天都能遇到各种各样的账号被盗。不幸的是，试图教用户（[educate users](http://www.ranum.com/security/computer_security/editorials/dumb/) ）貌似并不奏效。
电子邮件的一个主要的有点是它是一个真正的开放的消息系统。世界上的任何人都可以创建一个电子邮件账号和其他的邮件系统开始通讯。它不是一个受制于某个个体公司或者网站的围城。这种开放也是最大的弱点，这意味着合法的发件人和仿冒邮件发送者是同等的。这意味着未来电子邮件的发展将继续它在合法收件人和仿冒邮件发送者之间的这种竞争，试图判定每一封邮件是合法的有很多很多种因素。不幸的是，这意味着误判是在所难免而且一直会有的（仿冒邮件合法地进入了收件箱或者合法的邮件被标记为仿冒邮件）。世界上没有一个“完美的”邮件系统，无论系统里被投递进来了什么，我们都将努力变得更好。

# Email authentication in the future

虽然邮件列表和 p=reject 规则不兼容这个主要的问题已经被大部分解决了，它产生了一个新的问题那就是收件方对邮件列表的域名的信任问题。这刺激了垃圾邮件发送者把目标转向邮件列表，希望更宽松的垃圾邮件判定规则以便把垃圾邮件发送到信任邮件列表域名的那些邮件系统中。一个新的叫做 （[ARC，Authenticated Received Chain](http://www.sympa.org/manual/dmarc)）的标准让邮件接收者以同等的情况去返回去信任他们能看到信任结果的前置的接受系统并且把先前多个阶段的投递路径的域名相关联。
我们愿意看到的是域名和一些现实世界相关联。其中一个重任被 SSL 扩展验证证书（[SSL Extended Validation (EV) Certificate](https://en.wikipedia.org/wiki/Extended_Validation_Certificate) ）系统担任了。申请 EV 证书需要提供实际的合法的身份证明。当你在访问一些使用了 EV 证书的网站时你可以在浏览器中看到。比如[我们的网站使用了 EV 证书](https://www.fastmail.com/?STKI=16759801)（[https://www.fastmail.com](https://www.fastmail.com/?STKI=16759801)），浏览器在地址栏会现实“FastMail Pty Ltd”。清楚地在合法地发件人旁边显示 PayPal 的“PayPal, Inc”或其他财务类网站对用户来说看起来是个 significant win（modulo the slightly sad results we already found regarding users falling for phishing emails 。
不幸的是，这方面没有标准并且也没有其他关于这方面的起色的事情，and it's not entirely obvious how to do this without support from the senders.一个不需要发件人参与的方法是从发件人地址中提取域名并且试图使用 https:// 去连接。但是这样会有其他一些副作用，比如 PayPal 用国别域名签名 DKIM 信息（比如 paypal.com.au），但是如果你在浏览器中访问 http://paypal.com.au ，将会跳转到 https://www.paypal.com 。我们不能简单地仅仅跟网站跳转因为不法分子可以建立一个 paypal-scam.com 的网站并且指向 https://paypal.com .Working out what redirects should actually be followed is entirely non-trivial.

# Coda

这篇文章比我计划的内容要多了许多，它指出了如何在现代的电子邮件系统上下文中完成电子邮件认证这个主题。FastMail 努力试图让这些不但能让其他系统的发件人而且也能让自定义域的发件人“just work”。如果你把 DNS 托管在我们这里的话，我们为你自动配置 SPF 和 DKIM 签名规则。我们当前没有设置 DMARC 记录（还有其他不同的邮件发送方式），but we hope in the future to allow easier construction and rollout of DMARC records for user domains.

