import socket from './socket'
import { addVideo, getUserMedia } from './util'

export const createConnect = targetId => {
  const pc = new RTCPeerConnection()

  /**
   * The handler is run when network candidates become available
   * 只要本地代理ICE 需要通过信令服务器传递信息给其他对等端时就会触发
   */
  pc.onicecandidate = event => {
    if (!event.candidate) {
      return
    }

    socket.emit("candidate", {
      id: targetId,
      candidate: event.candidate
    })
  }

  /**
   * 远程用户将视频或音频流添加到连接时触发
   */
  pc.onaddstream = event => {
    addVideo({
      id: targetId,
      stream: event.stream
    })
  }

  return getUserMedia().then(stream => {
    return {
      stream,
      pc
    }
  })
}
