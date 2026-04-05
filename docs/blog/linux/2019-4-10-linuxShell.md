---
toc: true
title: Linux Shell 命令
tags:
- 技术
- linux
- shell
---

## 常用命令

### 文件操作

```bash
# touch 命令
touch -c filename    # 不存在不创建
touch -r file1 file2  # 更新file2的时间戳与file1相同
touch -t 202001011200 filename  # 设定时间戳

# chown 命令
chown root:subuser file1.text  # 将文件的拥有者改为指定的用户/组

# cat 命令
cat filename  # 一次显示整个文件
cat > filename  # 从键盘创建一个文件
cat file1 file2 > file  # 将几个文件合并成一个文件
cat /dev/null > /etc/test.txt  # 赋空值

# tee 命令
tee /home/xxx.conf <<-'EOF'
# 输入内容...
EOF

# tar 命令
tar czvf .....tar.gz  file1 file2 file3

# find 命令
find / --name xxxx  # 查找文件
```

### 进程管理

```bash
ps -elf  # 显示瞬间进程状态
top  # 查看系统进程状态
pstree -p pid  # 以树状图显示进程之间的关系
ps -elf | grep pid  # 查看进程启动带的参数
```

### 网络命令

```bash
netstat -anp | grep 8775  # 查找进程
grep 命令
netstat -anp | grep 8775  # 查找进程
ps -elf | grep 12345
```

### 传输命令

```bash
# curl 命令
curl -o xx.html http://xxx.com  # -o 保存网页
curl -O http://xxx.com/file.tar.gz  # -O 下载文件
curl -A "Mozilla/4.0" http://www.linux.com  # 模仿浏览器
curl -e "www.linux.com" http://mail.linux.com  # 盗链

# scp 命令
scp -r user@host:/path .  # ssh拷贝

# rz/sz
rz  # xshell上传
sz file  # xshell下载文件
```

### 系统命令

```bash
lsblk    # 列出系统所有磁盘
lscpu    # cup信息
tail -f filename  # 查看文件最后10行，持续增加显示
systemctl status docker  # 查看docker状态
```

---

## Shell 管道和重定向

### 管道 |

```bash
command1 | command2  # 第一个命令的结果作为第二个命令的参数
```

### 逻辑与 &&

```bash
command1 && command2  # 第一个命令执行成功后才执行第二个命令
```

### 逻辑或 ||

```bash
command1 || command2  # 第一个命令执行失败再执行第二个命令
```

### 子 shell ()

```bash
(command1; command2; command3)  # 命令一起执行，分号隔开
```

### 命令组 {}

```bash
# 如果使用{}来代替()，那么相应的命令将在子shell而不是当前shell中作为一个整体被执行
{ command1; command2; }
```

---

## Lib 库查看

```bash
# 查看linux 库中的接口函数
nm -g --defined-only libxxx.a

# 查看动态库依赖
ldd program
```
