import { VIDEO_WIDTH, VIDEO_HEIGHT } from './constant'

export const addVideo = ({ id, stream }) => {
  const video = document.createElement("video")

  video.id = `video-${id}`
  video.width = VIDEO_WIDTH
  video.height = VIDEO_HEIGHT
  video.autoplay = true
  video.srcObject = stream
  document.body.appendChild(video)
}

export const removeVideo = id => {
  const video = document.getElementById(`video-${id}`)

  if (video) {
    video.remove()
  }
}

let mediaStream = null
export const getUserMedia = () => {
  if (mediaStream) {
    return Promise.resolve(mediaStream)
  }

  return navigator.mediaDevices.getUserMedia({
    video: {
      // frameRate: VIDEO_FRAME_RATE,
      width: VIDEO_WIDTH,
      height: VIDEO_HEIGHT
    },
    audio: true
  }).then(stream => {
    mediaStream = stream
    return stream
  })
}
