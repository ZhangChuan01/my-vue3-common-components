<script setup lang="ts">
const info = reactive<any>({
  serverIp: window.location.hostname,
  cameraList: [
    {
      ip: '192.168.8.137',
      username: 'admin',
      password: 'ZKHY2024',
      // channels: [ `rtsp://admin:ZKHY2024@192.168.8.137:554/Streaming/tracks/101?starttime=${getISOString({ offset: -10 })}&endtime=${getISOString({ })}` ]
      channels: [ 'rtsp://admin:ZKHY2024@192.168.8.137:554/Streaming/tracks/101/?starttime=20250724T001000Z&endtime=20250724T001001Z' ]
    }
    // {
    //   ip: '192.168.8.246',
    //   username: 'admin', 
    //   password: 'admin'
    // }
  ]
})
const toggleCamera1 = () => {
  console.log('toggleCamera')
  info.cameraList = [
    {
      ip: '192.168.8.245',
      username: 'admin',
      password: 'admin'
    }
  ]
}
const toggleCamera2 = () => {
  console.log('toggleCamera')
  info.cameraList = [
    {
      ip: '192.168.8.231',
      username: 'admin',
      password: 'admin'
    }
  ]
}
</script>

<template>
  <button @click="toggleCamera1">
    切换摄像头1
  </button>
  <button @click="toggleCamera2">
    切换摄像头2
  </button>
  <VideoComponent :info="info" />
</template>
