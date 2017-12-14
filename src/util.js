export const addVideo = ({ id, stream }) => {
  const video = document.createElement("video")

  video.id = `video-${id}`
  video.autoplay = true
  video.srcObject = stream
  document.body.appendChild(video)
}

export const removeVideo = id => {
  const video = document.getElementById(`video-${id}`)

  video.remove()
}
