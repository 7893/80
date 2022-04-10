---
title: CentOS 7.5 无图静默安装 Oracle 12.2.0
date: 2018-07-16 17:37:16
tags: [Oracle,CentOS,SLES,database,dba]
---


## 概要 ##

----------

Oracle 数据库的默认安装非常繁琐复杂，但是大致的套路无非就是找一个能满足业务需求的硬件环境和一个能满足需求（并最大限度提升性能）的系统环境（操作系统环境，网络环境等等）把安装程序扔上去然后让它跑起来就可以了。抛开硬件环境不说，这里只说 Linux 软件环境。

对于常规的三大派系的 Linux 发行版：RedHat SUSE Debian 而言。Oracle 默认是不支持 debian 的，所以这个系列的发行版不推荐安装 Oracle 数据库，即便你再喜欢把 Ubuntu 玩的再 6 也不要试图去把 Oracle 安装再 Ubuntu 上（除非哪天 Oracle 官方支持了），也有一些特别执着的人可能实现了安装，但是生产环境绝不推荐这种做FF法。省下的两大商业发行版 RedHat 和 SUSE 都是支持的。

对于 RedHat 而言，当然首先应肯定支持度最好的是 RHEL（Redhat Enterprise Linux）但是大多数情况下社区发行版使用更多一些，所以明显的 CentOS 几乎成了 Oracle 免费方案下最稳妥最靠谱最通用的办法。而 RedHat 系而言，Oracle 自己在 RHEL 的基础上做了少许改进有了 Oracle Linux，可以认为是 CentOS 的兄弟版本而且专为 Oracle 数据库而生，所以商业付费订阅领域最适合 Oracle 数据库的无疑是 Oracle Linux 了。当然 Fedora 也是支持 Oracle 数据库的，但是不推荐生产环境使用。对于 SUSE 而言，SLES（SUSE Linux Enterprise Server）得到了 Oracle 的官方支持，当然 openSUSE 肯定也是可以安装 Oracle 数据库的。

具体操作起来，有两种解决方案：

	
> 1.使用 CentOS 安装：本文覆盖范围
	
> 2.由于 Oracle Linux 和 CentOS 的关系，所以可以直接把 CentOS 转成 Oracle Linux 来获取官方支持的 preinstall 安装相关的支持套件来简化安装程序，这也是官方推荐的做法。

第二种方法可以参考如下内容：

    https://linux.oracle.com/switch/centos/
    https://gist.github.com/martndemus/7ad8209f9be9185bcf3a

对于安装，Oracle 默认采用图形化安装方式，但是大多数服务器，尤其是虚拟机没有图形环境，网上有一些采用 Xmanager 的方式，但是不推荐。图形环境安装无非就是设置了一些变量给了 Oracle 系统，那么这些设置肯定是可通过文本进行配置编辑的。所以本文采用静默方式安装。

## 安装环境 ##

----------

本次安装使用当前最佳免费方案，使用当前的最新版 CentOS 7.5 系统。由于 Oracle 18c 的改进较大，所以使用最广泛的次新版 12c 进行安装。

	CentOS 7.5 x64 (2GB 1vCPU 3.10.0-862.2.3.el7.x86_64)
	Oracle Database 12c Release 2 (12.2.0.1.0)

	这个机器配置如下：
	内存：2GB
	硬盘：50GB

## 相关术语及其工具说明 ##

----------

Oracle Universal Installer(OUI)	是一个安装 Oracle 相关软件的工具，它可以自动启动 ODCA 来安装数据库；

Oracle Database Configuration Assistant(DBCA) 是一个从模板创建 Oracle 提供的数据库的工具，它可以帮助相关人员更快地建立和配置新数据库；

Net Configuration Assistant 是一个可以让相关人员配置监听器（listeners）和命名方法（naming methods）的工具，它是 Oracle 数据库网络的关键工具；

Oracle Enterprise Manager Database Express(EM Express) 是一个基于 Web 的主要的用来管理 Oracle 数据库的工具；Oracle 同时也提供了单独需要购买的 EM 工具和插件还有其他特定环境可以增强 Oracle 数据库管理能力的付费产品；

SQL Developer 是一个 GUI 的访问数据库的工具。它同时支持 SQL 和 PL/SQL 语言。用它可以浏览数据库实体，运行 SQL 语句和 SQL 脚本，编辑和调试 PL/SQL 语句。

Automatic Storage Management(ASM) 这个套件是 Oracle 用来自动管理数据库文件的存放和命名空间的地方(placement and naming)。对于大量的磁盘文件，这个工具简化了数据库管理工作并且提高了数据库性能。ASM 在文件层面执行软件拆分和镜像(striping and mirroring at the file level)以便获得最大化的灵活性可用性和性能。

Oracle ASM 使用一个有别于数据库实例的 Oracle ASM 实例，用来配置和管理磁盘组。ASM 实例可以同服务器上的多数据库存储。

自从 Oracle Database 11g Release (11.2) 开始，ASM 是 Grid Infrastructure 的一部分了。

Grid Infrastructure（GI）是给数据库系统提供包括卷管理，文件系统和自动重启功能的软件。如果你打算使用 Oracle Restart 或者 ASM 的话，必须在安装数据库之前安装 GI。

## 版本区别 ##

----------

企业版 Oracle Database Enterprise Edition：
> 全功能的企业级数据库，专为核心业务和高安全性的在线事务处理而生，并且支持数据仓库相关功能；

标准单一版 Oracle Database Standard Edition One：
> 小型业务使用的单台服务器环境使用，包含了所有构建关键业务所需要的核心功能；

标准版 Oracle Database Standard Edition：
> 适合工作组或部门级别的应用，适合中小型企业。提供和关系型数据库的核心功能并且集成了一些管理工具。

个人版 Personal Edition (只能用于 Microsoft Windows 系统)：
> 这个版本和企业版相同，但是只支持单用户。

学习版 Oracle Database Express Edition：
> 免费使用的入门级的用于快速下载快速安装部署和管理的数据库系统。俗称 Oracle XE 版本，它也可以容易地升级到 Oracle 的其他版本。它可以容易地安装再任何数量 CPU 的机器上，但是它只会使用一个 CPU，而且限制最大数据容量是 4GB 容量，最多使用 1GB 内存。技术支持方面仅支持在线论坛。

*当前（2018年7月）XE 的最新版本是 Oracle Database XE 11g Release 2(11.2)，比其他高级版本滞后两个版本。*

更多细节：
> https://docs.oracle.com/cd/B28359_01/license.111/b28287/editions.htm

## 安装所需 ##

----------

硬件环境所需：

> 最小内存：1GB

> 推荐内存：2GB

> 如需安装 Oracle Grid Infrastructure(GI) 那么最小内存 8GB
	
软件环境所需：

Oracle 可以安装在常规的 Linux 发行版上，但是只支持两大商业主流发行版和派生版（红帽 Linux 和 SUSE Linux）官方不支持 Debian 及其衍生版（Ubuntu 等等），虽然网上有 Ubuntu 和 Debian 上安装 Oracle 数据库的方法，但是不推荐生产环境这样做。对于操作系统内核要求如下：

> RHEL7/CentOS7: 最低 3.10.0-123.el7.x86_64

> SLES 12 SP1: 最低 3.12.49-11.1

> Oracle Database(http://www.oracle.com/technetwork/database/enterprise-edition/downloads/index.html)
	
其他说明：

	1. 对于性能敏感的系统为了提升性能 Oracle 建议关闭 Linux 系统的 Transparent HugePages 特性。
	2. 下载需要 Oracle 账号并且需要登陆账号同意下载协议
	3. 官方下载链接带尾巴不支持 Linux axel 下载工具，建议使用 wget 下载。

## 环境准备 ##

----------

更新系统：
	
	yun update

启用 epel 源：
	
	yum install epel-release -y

安装必备软件：

	yum install wget vim unzip

设置时区：
	
	timedatectl set-timezone Asia/Shanghai

启用时间同步：

    timedatectl set-ntp true

关闭 Transparent HugePages 特性:

> 详细 Redhat 文档1：https://access.redhat.com/solutions/46111（需要登陆红帽账户）

> 详细 Redhat 文档2：https://access.redhat.com/solutions/1320153（需要登陆红帽账户）

> 详细 Redhat 文档3：https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/performance_tuning_guide/sect-red_hat_enterprise_linux-performance_tuning_guide-configuring_transparent_huge_pages

> 详细 Mongodb 对于不同操作系统而言关闭方法文档：https://docs.mongodb.com/manual/tutorial/transparent-huge-pages/index.html

    mkdir /etc/tuned/no-thp
    vim /etc/tuned/no-thp/tuned.conf
		
输入以下内容：

    [main]
    include=virtual-guest
    
    [vm]
    transparent_hugepages=never

保存文件

使其生效

    tuned-adm profile no-thp

测试生效

    cat /sys/kernel/mm/transparent_hugepage/enabled
    cat /sys/kernel/mm/transparent_hugepage/defrag

如果两句都输出

    always madvise [never]

说明成功。

交换空间：
> Oracle 安装所需的交换空间大小依据物理内存而定：

> 内存 256MB：内存3倍

> 内存 256MB 到 512MB 之间：内存2倍

> 内存 512MB 到 2GB 之间：内存1.5倍

> 内存 2GB 到 16GB：内存1倍（等于内存容量）

> 内存大于 16GB：16GB

如果你的 Linux Server 启用了 HugePages 没有关闭的话，那么你应该在计算交换分区的时候从可用内存里减去给 HugePages 分配的容量再计算。

对于物理机而言在安装系统的时候就应该分配好交换空间，普遍的说法是物理内存大小的两倍，但是如果你硬盘紧张而内存足够大的话少划分一些给交换空间也是可以的，后续可以通过重新分配磁盘或者逻辑卷管理（LVM）的方式改变大小。

添加交换空间：

	https://6ki.org/2018/07/add-swap-to-linux.html

为了性能提升，还需要（可选）做如下系统修改：

备份要修改的文件：

    cp /etc/sysctl.conf /etc/sysctl.conf_20180712_original
	vim /etc/sysctl.conf

编辑文件加入以下内容：

    vm.swappiness = 10
    vm.vfs_cache_pressure = 50

保存重启

安装系统必须库文件相关组件：

    yum install unzip bc binutils compat-libcap1.x86_64 compat-libstdc++-33.x86_64 glibc glibc-devel ksh libaio libaio-devel libgcc libstdc++ libstdc++-devel libxcb libX11 libXau libXi libXtst libXrender make net-tools nfs-utils smartmontools sysstat -y

本地 SSH 配置：

    cp /etc/ssh/sshd_config /etc/ssh/sshd_config_20180711_original
	vim /etc/ssh/sshd_config

编辑文件并把相关条目修改为：

    LoginGraceTime 0
	PasswordAuthentication yes

保存重启服务：

    systemctl restart sshd

## 用户和组 ##

----------

创建用户和组：

	groupadd -g 54321 oinstall
	groupadd -g 54322 dba
	groupadd -g 54323 oper
	groupadd -g 54324 backupdba
	groupadd -g 54325 dgdba
	groupadd -g 54326 kmdba
	groupadd -g 54327 asmdba
	groupadd -g 54328 asmoper
	groupadd -g 54329 asmadmin
	groupadd -g 54330 racdba

	# 建立安装全部 Oracle 软件安装用户 
	useradd -u 54321 -g oinstall -G  dba,oper,backupdba,dgdba,kmdba,asmdba,racdba oracle
	
	# 建立仅仅安装 Grid Infrastructure 用户
	useradd -u 54331 -g oinstall -G oinstall,dba,asmdba,asmoper,asmadmin,racdba grid

设置用户密码：

	passwd oracle
	passwd grid

## 系统内核优化 ##

----------

有则打开无则创建 /etc/sysctl.d/97-oracle-database-sysctl.conf 并加入以下内容： （不推荐网上写的直接修改 /etc/sysctl.conf 文件的做法）

	fs.aio-max-nr = 1048576
	fs.file-max = 6815744
	kernel.shmall = 2097152
	kernel.shmmax = 4294967295
	kernel.shmmni = 4096
	kernel.sem = 250 32000 100 128
	net.ipv4.ip_local_port_range = 9000 65500
	net.core.rmem_default = 262144
	net.core.rmem_max = 4194304
	net.core.wmem_default = 262144
	net.core.wmem_max = 1048576

保存文件然后重启系统或者运行

	sysctl --system

编辑 /etc/security/limits.conf 为 oracle 用户设置上限

	oracle soft nproc 2047
	oracle hard nproc 16384
	oracle soft nofile 1024
	oracle hard nofile 65536

## 准备相关目录 ##

----------

创建 Oracle 安装目录：（不建议更改安装目录，这种目录符合 Oracle 的推荐标注，并且这种形式有个名字叫做 Optimal Flexible Architecture (OFA) Path）
	
	mkdir -p /u01/app/oraInventory
	mkdir -p /u01/app/oracle
	mkdir -p /u01/app/oracle/product/12.2.0/dbhome_1/
	mkdir -p /u01/app/grid
	mkdir -p /u01/app/12.2.0/grid
	

从官网下载 Oracle Database 压缩包并解压文件

	#提示1：推荐使用 axel 而不是用 wget下载
	#提示2：需要使用 Oracle 登陆网站，如果你在 Windows 上操作，等本地浏览器开始下载以后停止当前下载并复制完整 URL 到 Xshell/PuTTY 等工具。
	# filename:linuxx64_12201_database.zip
	# fllesize:3293.7MB(3.2GB)

	wget http://download.oracle.com/otn/linux/oracle12c/122010/linuxx64_12201_database.zip?AuthParam=[all-full-url-with-your-own-login]

	unzip linuxx64_12201_database.zip -d /u01/app/stage/

更改属主和权限

	# 如果需要安装 GI 那么
	#chown -R grid:oinstall /u01/app/oraInventory
	# 如果不需安装 GI 只安装数据库 那么
	chown -R oracle:oinstall /u01/app/oraInventory
	chown -R oracle:oinstall /u01/app/oracle
	chown -R oracle:oinstall /u01/app/oracle/product/12.2.0/dbhome_1/
	chown -R grid:oinstall /u01/app/grid
	chown -R root:root /u01/app/12.2.0/grid

## 设置环境变量 ##

----------

	# 注意环境变量目录后面不能有“/”

	su - oracle
	
	vim ~/.bash_profile
	
	export ORACLE_HOSTNAME=instance8
	
	export ORACLE_BASE=/u01/app/oracle
	
	export ORACLE_HOME=$ORACLE_BASE/product/12.2.0/dbhome_1
	
	export ORACLE_SID=db1sid

	export DISPLAY=127.0.0.1:1.0
	
	export PATH=.:$ORACLE_HOME/bin:$ORACLE_HOME/OPatch:$ORACLE_HOME/jdk/bin:$PATH

## 配置安装 ##

----------

创建安装配置文件

	mkdir /u01/app/oracle/etc/
	cp /u01/app/stage/database/response/* /u01/app/oracle/etc/

编辑文件文件 /u01/app/oracle/etc/db_install.rsp 并设置以下值：

	oracle.install.option=INSTALL_DB_SWONLY
	UNIX_GROUP_NAME=oinstall
	INVENTORY_LOCATION=/u01/app/oraInventory
	ORACLE_HOME=/u01/app/oracle/product/12.2.0/dbhome_1/
	ORACLE_BASE=/u01/app/oracle
	oracle.install.db.InstallEdition=EE
	oracle.install.db.OSDBA_GROUP=dba
	oracle.install.db.OSOPER_GROUP=oper
	oracle.install.db.OSBACKUPDBA_GROUP=backupdba
	oracle.install.db.OSDGDBA_GROUP=dgdba
	oracle.install.db.OSKMDBA_GROUP=kmdba
	oracle.install.db.OSRACDBA_GROUP=racdba
	oracle.install.db.config.starterdb.type=GENERAL_PURPOSE
	#oracle.install.db.config.starterdb.SID=orcl
	oracle.install.db.config.starterdb.characterSet=ZHS16GBK
	oracle.install.db.config.starterdb.password.ALL=[YourPassword]
	oracle.install.db.config.starterdb.password.DBSNMP=[YourUserName]
	oracle.install.db.config.starterdb.managementOption=CLOUD_CONTROL
	oracle.install.db.config.starterdb.emAdminUser=[YourUserName]
	oracle.install.db.config.starterdb.emAdminPassword=[YourPassword]

## 过程安装 ##

----------
	
	cd /u01/app/stage/database
	./runInstaller -silent -ignorePrereq -responseFile /u01/app/oracle/etc/db_install.rsp

输出如下：

	Starting Oracle Universal Installer...

    Checking Temp space: must be greater than 500 MB.   Actual 38822 MBPassed
    Checking swap space: must be greater than 150 MB.   Actual 1999 MBPassed
    Preparing to launch Oracle Universal Installer from /tmp/OraInstall2018-07-12_04-42-48PM. Please wait ...[oracle@instance8 database]$ You can find the log of this install session at:
     /u01/app/oraInventory/logs/installActions2018-07-12_04-42-48PM.log
    The installation of Oracle Database 12c was successful.
    Please check '/u01/app/oraInventory/logs/silentInstall2018-07-12_04-42-48PM.log' for more details.
    
    As a root user, execute the following script(s):
    	1. /u01/app/oraInventory/orainstRoot.sh
    	2. /u01/app/oracle/product/12.2.0/dbhome_1/root.sh
    
    
    
    Successfully Setup Software.

根据提示切换为 root 用户执行上面两个脚本（此处需要再按一次回车）

	su - 
	sh /u01/app/oraInventory/orainstRoot.sh

输出

	Changing permissions of /u01/app/oraInventory.
	Adding read,write permissions for group.
	Removing read,write,execute permissions for world.

	Changing groupname of /u01/app/oraInventory to oinstall.
	The execution of the script is complete.

执行

	sh /u01/app/oracle/product/12.2.0/dbhome_1/root.sh

输出

	Check /u01/app/oracle/product/12.2.0/dbhome_1/install/root_instance8_2018-07-12_17-27-20-794486182.log for the output of root script

## 配置静默监听 ##

----------

	su - oracle
	# 如果下面这句执行不了则需要认真检查环境变量
	# 如果发生错误提示“The information provided for this listener is currently in use by other software on this computer. Listener start failed.” 则重启一次机器
	netca /silent /responsefile /u01/app/oracle/etc/netca.rsp

输出

	Parsing command line arguments:
	    Parameter "silent" = true
	    Parameter "responsefile" = /u01/app/oracle/etc/netca.rsp
	Done parsing command line arguments.
	Oracle Net Services Configuration:
	Profile configuration complete.
	Oracle Net Listener Startup:
	    Running Listener Control: 
	      /u01/app/oracle/product/12.2.0/dbhome_1/bin/lsnrctl start LISTENER
	    Listener Control complete.
	    Listener started successfully.
	Listener configuration complete.
	Oracle Net Services configuration successful. The exit code is 0	
	
## 配置静默建库 ##

----------

	vim /u01/app/oracle/etc/dbca.rsp

内容如下，可以根据自己的需要按照注释填写：

	gdbName=db1
	sid=db1sid
	sysPassword=[YourPassword]
	systemPassword=[YourPassword]
	dbsnmpPassword=[YourPassword]
	CHARACTERSET=ZHS16GBK
	# 注意 Oracle 推荐的密码长度为 8位并且包含数字大小写字母各 1为，如果密码太弱下一步会提示警告

执行

	dbca -silent -createDatabase -templateName General_Purpose.dbc -responseFile /u01/app/oracle/etc/dbca.rsp

输出如下：

	[WARNING] [DBT-06208] The 'SYS' password entered does not conform to the Oracle recommended standards.
	   CAUSE: 
	a. Oracle recommends that the password entered should be at least 8 characters in length, contain at least 1 uppercase character, 1 lower case character and 1 digit [0-9].
	b.The password entered is a keyword that Oracle does not recommend to be used as password
	   ACTION: Specify a strong password. If required refer Oracle documentation for guidelines.
	[WARNING] [DBT-06208] The 'SYSTEM' password entered does not conform to the Oracle recommended standards.
	   CAUSE: 
	a. Oracle recommends that the password entered should be at least 8 characters in length, contain at least 1 uppercase character, 1 lower case character and 1 digit [0-9].
	b.The password entered is a keyword that Oracle does not recommend to be used as password
	   ACTION: Specify a strong password. If required refer Oracle documentation for guidelines.
	Copying database files
	1% complete
	2% complete
	18% complete
	33% complete
	Creating and starting Oracle instance
	35% complete
	40% complete
	44% complete
	49% complete
	50% complete
	53% complete
	55% complete
	Completing Database Creation
	56% complete
	57% complete
	58% complete
	62% complete
	65% complete
	66% complete
	Executing Post Configuration Actions
	100% complete
	Look at the log file "/u01/app/oracle/cfgtoollogs/dbca/db1/db1.log" for further details.

## 查看实例 ##

----------

	su -
	ps -ef | grep ora_ | grep -v grep

输出如下：

	oracle   13030     1  0 18:27 ?        00:00:00 ora_pmon_db1sid
	oracle   13032     1  0 18:27 ?        00:00:00 ora_clmn_db1sid
	oracle   13034     1  0 18:27 ?        00:00:00 ora_psp0_db1sid
	oracle   13036     1  1 18:27 ?        00:00:01 ora_vktm_db1sid
	oracle   13041     1  0 18:27 ?        00:00:00 ora_gen0_db1sid
	oracle   13043     1  0 18:27 ?        00:00:00 ora_mman_db1sid
	oracle   13047     1  0 18:27 ?        00:00:00 ora_gen1_db1sid
	oracle   13051     1  0 18:27 ?        00:00:00 ora_diag_db1sid
	oracle   13053     1  0 18:27 ?        00:00:00 ora_ofsd_db1sid
	oracle   13057     1  0 18:27 ?        00:00:00 ora_dbrm_db1sid
	oracle   13059     1  0 18:27 ?        00:00:00 ora_vkrm_db1sid
	oracle   13061     1  0 18:27 ?        00:00:00 ora_svcb_db1sid
	oracle   13063     1  0 18:27 ?        00:00:00 ora_pman_db1sid
	oracle   13065     1  0 18:27 ?        00:00:00 ora_dia0_db1sid
	oracle   13067     1  0 18:27 ?        00:00:00 ora_dbw0_db1sid
	oracle   13069     1  0 18:27 ?        00:00:00 ora_lgwr_db1sid
	oracle   13071     1  0 18:27 ?        00:00:00 ora_ckpt_db1sid
	oracle   13073     1  0 18:27 ?        00:00:00 ora_smon_db1sid
	oracle   13075     1  0 18:27 ?        00:00:00 ora_smco_db1sid
	oracle   13077     1  0 18:27 ?        00:00:00 ora_reco_db1sid
	oracle   13079     1  0 18:27 ?        00:00:00 ora_w000_db1sid
	oracle   13081     1  0 18:27 ?        00:00:00 ora_lreg_db1sid
	oracle   13083     1  0 18:27 ?        00:00:00 ora_w001_db1sid
	oracle   13085     1  0 18:27 ?        00:00:00 ora_pxmn_db1sid
	oracle   13089     1  2 18:27 ?        00:00:02 ora_mmon_db1sid
	oracle   13091     1  0 18:27 ?        00:00:00 ora_mmnl_db1sid
	oracle   13093     1  0 18:27 ?        00:00:00 ora_d000_db1sid
	oracle   13095     1  0 18:27 ?        00:00:00 ora_s000_db1sid
	oracle   13097     1  0 18:27 ?        00:00:00 ora_tmon_db1sid
	oracle   13152     1  0 18:27 ?        00:00:00 ora_tt00_db1sid
	oracle   13154     1  0 18:27 ?        00:00:00 ora_tt01_db1sid
	oracle   13156     1  0 18:27 ?        00:00:00 ora_tt02_db1sid
	oracle   13159     1  0 18:27 ?        00:00:00 ora_aqpc_db1sid
	oracle   13164     1  0 18:27 ?        00:00:00 ora_p000_db1sid
	oracle   13166     1  0 18:27 ?        00:00:00 ora_p001_db1sid
	oracle   13168     1  0 18:27 ?        00:00:00 ora_cjq0_db1sid
	oracle   13170     1  0 18:27 ?        00:00:00 ora_p002_db1sid
	oracle   13175     1  0 18:27 ?        00:00:00 ora_p003_db1sid
	oracle   13412     1  0 18:27 ?        00:00:00 ora_qm02_db1sid
	oracle   13417     1  0 18:27 ?        00:00:00 ora_q002_db1sid
	oracle   13421     1  0 18:27 ?        00:00:00 ora_q003_db1sid
	oracle   13599     1  0 18:28 ?        00:00:00 ora_w002_db1sid

## 查看监听状态 ##

----------

	su - oracle
	lsnrctl status
	# 关闭监听	lsnrctl stop
	# 启动监听	lsnrctl start

输出如下：

	LSNRCTL for Linux: Version 12.2.0.1.0 - Production on 12-JUL-2018 18:29:56
	
	Copyright (c) 1991, 2016, Oracle.  All rights reserved.
	
	Connecting to (DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=instance8)(PORT=1521)))
	STATUS of the LISTENER
	------------------------
	Alias                     LISTENER
	Version                   TNSLSNR for Linux: Version 12.2.0.1.0 - Production
	Start Date                12-JUL-2018 17:48:15
	Uptime                    0 days 0 hr. 41 min. 41 sec
	Trace Level               off
	Security                  ON: Local OS Authentication
	SNMP                      OFF
	Listener Parameter File   /u01/app/oracle/product/12.2.0/dbhome_1/network/admin/listener.ora
	Listener Log File         /u01/app/oracle/diag/tnslsnr/instance8/listener/alert/log.xml
	Listening Endpoints Summary...
	  (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=instance8)(PORT=1521)))
	  (DESCRIPTION=(ADDRESS=(PROTOCOL=ipc)(KEY=EXTPROC1521)))
	Services Summary...
	Service "db1" has 1 instance(s).
	  Instance "db1sid", status READY, has 1 handler(s) for this service...
	Service "db1sidXDB" has 1 instance(s).
	  Instance "db1sid", status READY, has 1 handler(s) for this service...
	The command completed successfully

## 登陆查看实例 ##

----------

	sqlplus / as sysdba

输出

    SQL*Plus: Release 12.2.0.1.0 Production on Thu Jul 12 23:14:31 2018
    
    Copyright (c) 1982, 2016, Oracle.  All rights reserved.
    
    
    Connected to:
    Oracle Database 12c Enterprise Edition Release 12.2.0.1.0 - 64bit Production
    
    SQL>

此处看到 SQL> 命令提示符以后在提示符后面输入启动命令启动数据库

	# 启动数据库：startup 
	# 关闭数据库：shutdown immediate
	SQL> startup

输出

	ORACLE instance started.
	
	Total System Global Area  771751936 bytes
	Fixed Size		    8625464 bytes
	Variable Size		  583008968 bytes
	Database Buffers	  176160768 bytes
	Redo Buffers		    3956736 bytes
	Database mounted.
	Database opened.
	SQL>	

查看实例状态

	SQL> select status from v$instance;

输出

    STATUS
    ------------
    OPEN

查看数据库版本信息

	SQL> select * from v$version;

输出

	BANNER
	--------------------------------------------------------------------------------
	    CON_ID
	----------
	Oracle Database 12c Enterprise Edition Release 12.2.0.1.0 - 64bit Production
		 0
	
	PL/SQL Release 12.2.0.1.0 - Production
		 0
	
	CORE	12.2.0.1.0	Production
		 0
	
	
	BANNER
	--------------------------------------------------------------------------------
	    CON_ID
	----------
	TNS for Linux: Version 12.2.0.1.0 - Production
		 0
	
	NLSRTL Version 12.2.0.1.0 - Production
		 0
	
	
	SQL> select * from v$version;
	
	BANNER
	--------------------------------------------------------------------------------
	    CON_ID
	----------
	Oracle Database 12c Enterprise Edition Release 12.2.0.1.0 - 64bit Production
		 0
	
	PL/SQL Release 12.2.0.1.0 - Production
		 0
	
	CORE	12.2.0.1.0	Production
		 0
	
	
	BANNER
	--------------------------------------------------------------------------------
	    CON_ID
	----------
	TNS for Linux: Version 12.2.0.1.0 - Production
		 0
	
	NLSRTL Version 12.2.0.1.0 - Production
		 0
	
	
	SQL> 


----------

安装完毕。
