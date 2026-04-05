---
toc: true
title: Kubernetes
tags:
- 技术
- kubernetes
---

## 安装部署

[详细步骤](https://www.kubernetes.org.cn/5077.html)

### 1、禁用firwall
```shell
systemctl stop firwalld
```

### 2、禁用selinux
```shell
# 操作前先备份
cp /etc/selinux/config /etc/selinux/config.bak
cat /etc/selinux/config
setenforce 0
sed -i 's/SELINUX=enforcing/\SELINUX=permissive/' /etc/selinux/config
getenforce #查看结果  permissive
```

### 3、关闭swap
```shell
swapoff -a
echo "vm.swappiness = 0">> /etc/sysctl.conf
sysctl -p
```

### 4、系统参数与内核模块
```shell
# 修改内核参数
cat <<EOF > /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system

# 加载内核模块
modprobe br_netfilter
lsmod | grep br_netfilter
```

### 5、配置yum源
```shell
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
        http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

# update cache
yum clean all
yum makecache
yum repolist
```

### 6. 安装docker

### 7. 安装kubeadm、kubelet和kubectl
```shell
yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
systemctl enable --now kubelet
```

### 8. 镜像准备
```shell
docker pull docker.io/mirrorgooglecontainers/kube-apiserver-amd64:v1.14.1
docker tag docker.io/mirrorgooglecontainers/kube-apiserver-amd64:v1.14.1 k8s.gcr.io/kube-apiserver:v1.14.1
# ... (其他镜像)
```

### 9. 安装k8s master
```shell
kubeadm init --pod-network-cidr=10.100.0.0/16
```

#### 其他工作
```shell
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

#### flannel 网络
```shell
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/bc79dd1505b0c8681ece4de4c0d86c5cd2643275/Documentation/kube-flannel.yml
```

### 10. 配置单节点
```shell
kubectl taint node kube-master node-role.kubernetes.io/master-node/kube-master untainted
```

### 11. 执行yaml验证环境
```shell
kubectl create -f tomcat-deploy.yaml
```

### 集群没有DNS解析时
```shell
# 在master的 /etc/hosts 中配置节点信息
echo "xxx.xxx.xxx.xxx nodename" >> /etc/hosts
```

---

## 部署应用

### 部署应用
```bash
kubectl run kubernetes-bootcamp \
    --image=docker.io/jocatalin/kubernetes-bootcamp:v1 \
    --port=8080

kubectl get pods
```

### 访问应用
```bash
kubectl expose deployment/kubernetes-bootcamp \
      --type="NodePort" \
      --port 8080
kubectl get services
```

### Scale应用
```bash
# 查看副本数
kubectl get deployments

# 副本增加到3个
kubectl scale deployments/kubernetes-bootcamp --replicas=3

# scale down应用
kubectl scale deployments/kubernetes-bootcamp --replicas=2
```

### 滚动更新
```bash
# 更新
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v2

# 回滚
kubectl rollout undo deployments/kubernetes-bootcamp
```

---

## ServiceAccount + Secret

[详细参考](https://blog.csdn.net/BigData_Mining/article/details/88529157)

---

## RPC Server 实现

[参考](https://blog.csdn.net/li_101357/article/details/70162657)

1. 通过配置文件创建 transport（传输层）

2. 创建 target

3. endpoints

4. 通过 transport target endpoints executor 创建 server

### messaging.get_rpc_server

```python
def get_server(target, endpoints, serializer=None):
    assert TRANSPORT is not None
    serializer = RequestContextSerializer(serializer)
    return messaging.get_rpc_server(TRANSPORT,
                                    target,
                                    endpoints,
                                    executor='eventlet',
                                    serializer=serializer)
```

```python
def get_rpc_server(transport, target, endpoints,
                   executor='blocking', serializer=None):
    dispatcher = rpc_dispatcher.RPCDispatcher(target, endpoints, serializer)
    return msg_server.MessageHandlingServer(transport, dispatcher, executor)
```
