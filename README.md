# rtc-client

SDP: 一个描述peer-to-peer连接的标准，包含音视频的编解码(codec)、源地址和时间信息，用于描述媒体通信会话的协议.

```
v=0
o=alice 2890844526 2890844526 IN IP4 host.anywhere.com
s=
c=IN IP4 host.anywhere.com
t=0 0
m=audio 49170 RTP/AVP 0
a=rtpmap:0 PCMU/8000
m=video 51372 RTP/AVP 31
a=rtpmap:31 H261/90000
m=video 53000 RTP/AVP 32
a=rtpmap:32 MPV/90000
```

大多数计算机主机都位于防火墙或NAT之后，目前有几种技术用于跟其他用户建立连接

* STUN (简单地用UDP穿透NAT)
* TURN (使用中继穿透NAT)
* ICE (交互式连通)：当ICE开始时,它不知道每个用户的网络。ICE过程将逐步发现如何使用不同的技术设置每个客户端的网络。主要任务是查找有关每个网络的信息,以便成功连接。比如ICE首先尝试P2P连接,如果失败就会通过Turn服务器进行转接。

## 流程

1. socket连接建立，将本地stream加入本地视频节点，同时服务端广播userAdd事件
2. 其他节点收到userAdd事件，建立一个RTCPeerConnection，添加本地stream，创建一个SDP offer，并setLocalDescription(offer)，把此offer发送给新添加进来的用户
3. 新添加的用户收到offer，建立一个RTCPeerConnection，添加本地stream，setRemoteDescription(收到的offer)，并createAnswer，将setLocalDescription(answer)，发送answer给其他节点
4. 其他节点收到answer，setRemoteDescription(answer)
