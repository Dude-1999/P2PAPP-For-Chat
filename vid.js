function enableVideo() {
        document.getElementById("URL").style.display = "block";
        document.getElementById("Remote").style.visibility = "visible";
        loadSimpleWebRTC();
      }
      function loadSimpleWebRTC() {
        var script = document.createElement("script");
        script.src = "https://simplewebrtc.com/latest-v3.js";
        document.head.appendChild(script);
        script.onload = function() {
          var webrtc = new SimpleWebRTC({
            localVideoEl: "selfVideo",
            remoteVideosEl: "",
            autoRequestMedia: true,
            debug: false,
            detectSpeakingEvents: true,
            autoAdjustMic: false
          });
     document.getElementById("ChatUrl").innerText = getChatUrl();
          webrtc.on("readyToCall", function() {
            webrtc.joinRoom(getRoom());
          });
          function showVolume(el, volume) {
            if (!el) return;
            if (volume < -50) volume = -50; 
            if (volume > -20) volume = -20;
            el.value = volume;
          }
          webrtc.on("localStream", function(stream) {
            var button = document.querySelector("form>button");
            if (button) button.removeAttribute("disabled");
            document.getElementById("localVolume").style.display = "block";
          })
          webrtc.on("localMediaError", function (err) {
            alert(".Please grant access  for cam so that it works and refresh the page.");
          });
          // When another person joins the chat room, we'll display their video.
          webrtc.on("videoAdded", function(video, peer) {
            console.log("user added to chat", peer);
            var Remotes = document.getElementById("Remote");
            if (Remote) {
              var outerContainer = document.createElement("div");
              outerContainer.className = "col-md-6";
              var container = document.createElement("div");
              container.className = "videoContainer";
              container.id = "container_" + webrtc.getDomId(peer);
              container.appendChild(video);
              
              video.oncontextmenu = function() { return false; };
              var vol = document.createElement("meter");
              vol.id = "volume_" + peer.id;
              vol.className = "volume";
              vol.min = -50;
              vol.max = -20;
              vol.low = -65;
              vol.high = -15;
              container.appendChild(vol);
              if (peer && peer.pc) {
                var connstate = document.createElement("div");
                connstate.className = "connectionstate";
                container.appendChild(connstate);
                peer.pc.on("iceConnectionStateChange", function(event) {
                  switch (peer.pc.iceConnectionState) {
                    case "checking":
                      connstate.innerText = "connecting to peer...";
                      break;
                    case "connected":
                    case "completed":
                      vol.style.display = "block";
                      connstate.innerText = "connection established";
                      break;
                    case "disconnected":
                      connstate.innerText = "disconnected";
                      break;
                    case "failed":
                      connstate.innerText = "connection failed";
                      break;
                    case "closed":
                      connstate.innerText = "connection closed";
                      break;
                  }
                });
              }
              outerContainer.appendChild(container);
              remotes.appendChild(outerContainer);
              var remoteVideos = document.getElementById("remotes").getElementsByTagName("video").length;
              if (!(remoteVideos % 2)) {
                var spacer = document.createElement("div");
                spacer.className = "w-100";
                remotes.appendChild(spacer);
              }
            }
          });
          // If a user disconnects from chat, we need to remove their video feed.
          webrtc.on("videoRemoved", function(video, peer) {
            console.log("user removed from chat", peer);
            var Remote = document.getElementById("Remote");
            var el = document.getElementById("container_" + webrtc.getDomId(peer));
            if (Remote && el) {
              Remote.removeChild(el.parentElement);
            }
          });
          webrtc.on("volumeChange", function(volume, treshold) {
            showVolume(document.getElementById("localVolume"), volume);
          });
          webrtc.on("remoteVolumeChange", function(peer, volume) {
            showVolume(document.getElementById("volume_" + peer.id), volume);
          });
         // In case of p2p failure
          webrtc.on("iceFailed", function(peer) {
            var connstate = document.querySelector("#container_" + webrtc.getDomId(peer) + " .connectionstate");
            console.log("local fail", connstate);
            if (connstate) {
              connstate.innerText = "connection failed";
              fileinput.disabled = "disabled";
            }
          });
    
          webrtc.on("connectivityError", function (peer) {
            var connstate = document.querySelector("#container_" + webrtc.getDomId(peer) + " .connectionstate");
            console.log("Remote fail", connstate);
            if (connstate) {
              connstate.innerText = "connection unsuccesfull";
              fileinput.disabled = "disabled";
            }
          });
        }
      }
