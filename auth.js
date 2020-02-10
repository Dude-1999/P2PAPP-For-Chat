var OKTA_SETTINGS = {
  baseUrl: "https://dev-887077.okta.com",
    clientId: "oty1a9onx6cc3Gd3S4x62oty25a6ks4BIR4lOQ",
    authParams: {
      issuer: "https://dev-887077.okta.com/oauth2/default",

var okta = new OktaSignIn({
  baseUrl: OKTA_SETTINGS.baseUrl,
  clientId: OKTA_SETTINGS.clientId,
  authParams: {
    issuer: OKTA_SETTINGS.issuer,
    responseType: ["token", "id_token"],
    display: "page"
  }
});

function showLogin() {
    okta.renderEl({ el: "#okta-login-container" }, function(res) {}, function(err) {
      alert("Couldn't create login form man.Let's resolve this");
    });
  }
 function getRoom() {
        var query = location.search && location.search.split("?")[1];
        if (query) {
          return (location.search && decodeURIComponent(query.split("=")[1]));
        }
        return okta.tokenManager.get("idToken").claims.email;
      }
 function getRoomURL() {
        return location.protocol + "//" + location.host + (location.path || "") + "?room=" + getRoom();
      }
      function hasQueryString() {
        return location.href.indexOf("?") !== -1;
      }

function handleLogin()
{

if (okta.token.hasTokensInUrl()) {
      okta.token.parseTokensFromUrl(
        function success(res) {
          okta.tokenManager.add("accessToken", res[0]);
          okta.tokenManager.add("idToken", res[1]);
window.location=getChatUrl();
         function error(err) {
          alert("Sorry for the problem caused.Please cooperate with me");
        }
      );
    } else {
      okta.session.get(function(res) {
        // If the user is logged in...
        if (res.status === "ACTIVE") {
          if (!hasQueryString()) {
          window.location = getChatUrl();
        }
    return enableVideo();
       if (hasQueryString()) {
        document.getElementById("Login").style.display = "block";
      } else {
        showLogin();
      }
    });
