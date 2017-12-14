import socket from './socket'
import { addVideo } from './util'
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FRAME_RATE } from './constant'

export const createConnect = targetId => {
  const pc = new RTCPeerConnection()

  /**
   * The handler is run when network candidates become available
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

  return navigator.mediaDevices.getUserMedia({
    video: {
      // frameRate: VIDEO_FRAME_RATE,
      width: VIDEO_WIDTH,
      height: VIDEO_HEIGHT
    },
    audio: true
  })
  .then(stream => {
    return {
      stream,
      pc
    }
  })
}
