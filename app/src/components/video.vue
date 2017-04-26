<template>
  <div class="container">
    <div class="ui active dimmer yolo" v-if="loading">
      <div class="loader ui">
        <p>{{Version('convert')}} {{timecount}} s</p>
      </div>
    </div>
    <div class="ui active dimmer" v-if="waiting">
      <div class="loader ui">
        <p>{{Version('subs')}}</p>
      </div>
    </div>
    <button v-if="showList" @click="returnTo()" type="button" class="back btn btn-block btn-large btn-github">{{Version('back')}}</button>
    <br />
    <div class="list_torrent" v-if="showList">
      <div>{{Version('selectTorrent')}}</div>
      <div class="ui active centered inline loader" v-if="load">
        <div class="loader ui"></div>
      </div>
      <div class="torrent" v-for="file in torrent.response">
        <div @click="getStream(file._id)">{{file.filename}}</div>
      </div>
      <div class="torrent" v-if="empty_torrent">
        <div>{{Version('torrent')}}</div>
      </div>
    </div>
    <div v-if="showVideo">
      <video-player id="lecteur" ref="videoPlayer" :options="playerOptions" @play="onPlayerPlay($event)" @pause="onPlayerStop($event)" @ready="playerReadied" />
      <br />
      <button @click="returnTo()" type="button" class="back btn btn-block btn-large btn-github">{{Version('back')}}</button>
      <br />
      <comments />
    </div>
  </div>
</template>

<script>
  import Comments from '@/components/partials/comments/Comments.vue'
  import { videoPlayer } from 'vue-video-player'
  import trad from '@/services/LanguageStore.js'
  import message from '../lang/MovieCard.js'
  import router from '@/router/index.js'
  import notif from "@/services/NotificationStore.js"

  export default {
    data() {
      return {
        subgood : "",
        torrent : "",
        load : true,
        waiting : false,
        showVideo : false,
        first: true,
        loading: false,
        mp4: false,
        timer : "",
        time : 0,
        timecount : "",
        empty_torrent : false,
        showList : true,
        index : 0,
        timeout : "",
        playerOptions: {
          controlBar: {
            remainingTimeDisplay: false,
            playToggle: false,
            progressControl: false,
          },
          sources : [],
          tracks : [],
          crossorigin : "use-credentials",
          countdown: ''
        }
      }
    },

    created() {
      this.$http.get(`http://localhost:3000/torrents/` + encodeURIComponent(this.$route.params.hash)).then(
        (res)=> {
          this.torrent = res.body
          this.load = false
          if (!res.body.response.length)
            this.empty_torrent = true
        },
        (res) => {
          this.load = false
          router.push({ name: 'Main'})
          notif.showNotification(
            res.body ? (res.body.err.message ? res.body.err.message : res.body.message) : "database error",
            "alert-danger",
            true
            )
        })
    },

    destroyed() {
      clearInterval(this.countdown)
      clearTimeout(this.timeout)

    },

    methods:{

      getStream (id) {
        this.showList = false
        this.showVideo = true
        this.$http.get('http://localhost:3000/torrents/subtitles/' + encodeURIComponent(id)).then(
          (res) => {
            console.log('check if subtitles')
            let array = res.body.response
            let size = array.length
            let apiRoad = `http://localhost:3000/torrents/` + encodeURIComponent(this.$route.params.hash) + `/` + encodeURIComponent(id)

            if (size)
            {
              console.log('subtitles detected')
              for (let i = 0; i < size; i++)
              {
                if (array[i].status === 'not downloaded')
                {
                  this.index++
                  this.waiting = true
                  console.log('subtitles are not availables yet')
                  this.getSubtitles(id, i)
                }
                else if (array[i].status === 'downloaded')
                {
                  this.subgood = 1
                  console.log('subtitles are availables')
                  this.playerOptions.tracks.push({ 
                    kind: 'subtitles',
                    src: 'http://localhost:3000/torrents/subtitles/' + encodeURIComponent(array[i]._id) + '/sub.vtt',
                    label: (i === 0 ? 'default' : (i + 1).toString()),
                  })
                }
                else
                {
                  console.log('subtitles error')
                  if (!this.subgood && ((i + 1) === size))
                  {
                    if (navigator.userAgent.includes("Chrome"))
                      size = 0
                  }
                }
              }
            }
            else
              console.log('no subtitles detected')

            if (navigator.userAgent.includes("Chrome") && !size)
            {
              console.log('play in mp4')
              this.timecount = 60
              this.timer = 60000
              this.playerOptions.sources.push({ src: apiRoad + '.mp4', type: 'video/mp4'})
              this.mp4 = true
            }
            else
            {
              console.log('play in webm')
              this.timecount = 90
              this.timer = 90000
              this.playerOptions.sources.push({ src: apiRoad + '.webm', type: 'video/webm'})
            }
          },
          (res) => {
            notif.showNotification(
              res.body ? (res.body.err.message ? res.body.err.message : res.body.message) : "database error",
              "alert-danger",
              true
              )
          })
      },

      getSubtitles(id, i) {
        setTimeout(() => {
          this.$http.get('http://localhost:3000/torrents/subtitles/' + encodeURIComponent(id)).then(
            (res) => {
              let array = res.body.response
              if (array[i].status === 'error')
              {
                this.index--
                console.log('subtitles error')
                if (!this.index && !this.subgood)
                {
                  if (navigator.userAgent.includes("Chrome"))
                  {
                    console.log('play in mp4')
                    let apiRoad = `http://localhost:3000/torrents/` + encodeURIComponent(this.$route.params.hash) + `/` + encodeURIComponent(id)
                    this.playerOptions.sources.length = 0
                    this.timecount = 60
                    this.timer = 60000
                    this.playerOptions.sources.length = 0
                    this.playerOptions.sources.push({ src: apiRoad + '.mp4', type: 'video/mp4'})
                    this.mp4 = true
                  }
                  this.waiting = false
                  notif.showNotification(
                    'sub_corrupt',
                    "alert-danger",
                    true
                    )
                }
              }
              else if (array[i].status === 'not downloaded')
              {
                console.log('subtitles are not availables yet')
                this.getSubtitles(id, i)
              }
              else
              {
                console.log('subtitles are availables')
                this.index--
                this.playerOptions.tracks.push({ 
                  kind: 'subtitles',
                  src: 'http://localhost:3000/torrents/subtitles/' + encodeURIComponent(array[i]._id) + '/sub.vtt',
                  label: (i === 0 ? 'default' : (i + 1).toString()) + "<br />",
                })
                this.subgood = 1
                if (!this.index)
                  this.waiting = false
              }
            })
        }, 1000)
      },

      onPlayerPlay(player) {
        if (this.first)
        {
          if (this.mp4 === true)
            document.getElementById('lecteur').firstChild.childNodes[6].childNodes[3].childNodes[0].innerHTML = '-:-:-'
          this.loading = true;
          player.pause();
          this.first = false;
          let loadTimer = setInterval(()=> {
            this.timecount -= 1
            if (this.timecount === 0)
              clearInterval(loadTimer)
          }, 1000)
          this.timeout = setTimeout(() => {
            this.loading = false
            player.play()
          }, this.timer)
        }
        else
        {
          if(this.mp4 === true)
          {
            this.time = 0
            let timer = document.getElementById('lecteur').firstChild.childNodes[6].childNodes[1].childNodes[0]
            document.getElementById('lecteur').firstChild.childNodes[6].childNodes[3].childNodes[0].innerHTML = '-:-:-'
            this.countdown = setInterval(() => {
              this.time++
              let date = new Date(null);
              date.setSeconds(this.time);
              timer.innerHTML = date.toISOString().substr(15, 4);
              document.getElementById('lecteur').firstChild.childNodes[6].childNodes[3].childNodes[0].innerHTML = '-:-:-'
            }, 1000);
          }
        }
      },

      onPlayerStop(player){
        if(this.mp4 === true)
        {
          clearInterval(this.countdown)
          let timer = document.getElementById('lecteur').firstChild.childNodes[6].childNodes[1].childNodes[0]
          let date = new Date(null);
          date.setSeconds(this.time);
          timer.innerHTML = date.toISOString().substr(15, 4);
        }
      },

      playerReadied(player) {
        //console.log('the player is readied', player)
        //player.load()
      },

      returnTo () {
        router.go(-1)
      },

      Version(key) {
        return trad.getContent(message)[key]
      },
    },

    components: {
      Comments,
      videoPlayer
    },
  }
</script>

<style>
  .back {
    float: left;
    width : auto;
  }

  .list_torrent {
    color: white;
    background-color: #292b2c;
    margin: 30% auto;
    padding: 10px;
    border-radius: 10px;
    width: 60%;
  }
  .torrent {
    background: white;
    border-radius: 10px;
    margin: 10px auto;
    cursor: pointer;
    color: #B1B0AC;
    overflow-x: auto;
  }

  .torrent:hover {
    background: #ddd;
    color: black;
  }
  .vjs-menu-item
  {
    display: block !important;
  }
  .yolo {
    /*margin: -24% auto;*/
  }

  .video-js.vjs-playing .vjs-tech {
    pointer-events: none;
  }
  
</style>
