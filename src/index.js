/**
 * ice = Interactive Connectivity Establishment
 * sdp = Session Description Protocol
 * The expression 'finding candidates' refers to the process of finding network interfaces and ports using the ICE framework
 *
 * 一个基本的RTCPeerConnection使用需要协调本地机器以及远端机器的连接，它可以通过在两台机器间生成Session Description的数据交换协议来实现。呼叫方发送一个offer(请求)，被呼叫方发出一个answer（应答）来回答请求。双方-呼叫方以及被呼叫方，最开始的时候都要建立他们各自的RTCPeerConnection对象
 */

import 'normalize.css/normalize.css'
import 'webrtc-adapter'

import socket from './socket'
import { createConnect } from './connect'
import { addVideo, removeVideo } from './util'
import { VIDEO_WIDTH, VIDEO_HEIGHT } from './constant'
import './less/styles.less'

const connects = {}

socket.on('connect', () => {

  navigator.mediaDevices.getUserMedia({
    video: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
    audio: true
  })
  .then(stream => {
    addVideo({
      id: 'local',
      stream: stream
    })
  })
})

// 当一个新用户连接时，发起一个请求到该用户
socket.on('userAdd', id => {
  createConnect(id)
  .then(({ pc, stream }) => {
    connects[id] = pc
    pc.addStream(stream)

    // 呼叫方发送一个offer（请求
    pc.createOffer()
    .then(offer => {
      return pc.setLocalDescription(offer).then(() => {
        return offer
      })
    })
    .then(offer => {
      socket.emit('offer', {
        id,
        offer
      })
    })
    .catch(onerror)
  })
})

socket.on('userRemove', id => {
  if (!connects[id]) {
    return
  }

  connects[id].close()
  delete connects[id]
  removeVideo(id)
})

socket.on('offer', data => {
  // 一开始加入时其他机器会请求，该id为其他机器的socket id
  const id = data.id

  createConnect(id)
  .then(({ pc, stream }) => {
    connects[id] = pc
    pc.addStream(stream)

    pc.setRemoteDescription(data.offer)
    .then(() => {
      return pc.createAnswer()
    })
    .then(answer => {
      return pc.setLocalDescription(answer).then(() => {
        return answer
      })
    })
    .then(answer => {
      socket.emit('answer', {
        id,
        answer
      })
    })
    .catch(onerror)
  })
})

socket.on('candidate', data => {
  const pc = connects[data.id]
  if (!pc) {
    return
  }

  pc.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(onerror)
})

socket.on('answer', data => {
  const pc = connects[data.id]
  if (!pc) {
    return
  }

  pc.setRemoteDescription(data.answer).catch(onerror)
})

function onerror(err) {
  console.log(err)
}
