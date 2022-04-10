---
title: 启用 Google BBR 拥塞控制算法
date: 2018-08-08 08:08:08
tags: [Google,Linux,algorithm,network]
---


# 查看内核版本
    
    #输出数字大于4.9即可满足
    uname -r

# 修改内核参数

    echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
    echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf

    #保存生效
    sysctl -p

# 查看

    sysctl net.ipv4.tcp_available_congestion_control
    sysctl net.ipv4.tcp_congestion_control

# 更多

- [GitHub page](https://github.com/google/bbr)
- [Google Cloud blog post](https://cloud.google.com/blog/products/gcp/tcp-bbr-congestion-control-comes-to-gcp-your-internet-just-got-faster)
- [Google AI publication](https://ai.google/research/pubs/pub45646)
