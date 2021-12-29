const loadScript = src => {
    let s1;
    switch(src){
      case "mb": s1="https://www.moneybutton.com/moneybutton.js"; break;
      case "rx": s1="https://one.relayx.io/relayone.js"; break;
      case "hc": s1="https://bsv.direct/lib/hc.js"; break;
      case "volt": s1="https://bsv.direct/lib/volt-sdk.min.js"; break;

    }
    return new Promise((resolve, reject) => {

      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.onload = resolve
      script.onerror = reject
      script.src = s1
      document.head.append(script)
    })
}
const desactivaBtns = (Selector=".logbtn")=> {
    let btns = document.querySelectorAll(Selector)
    for(const b of btns){
      document.getElementById(b.id).disabled=true
      document.getElementById(b.id).style.display="none"
    }
}

const activaBtns = (contenedor="#login", botones=".logbtn", logout="#logout")=>{
  //Para borrar el boton renderizado anteriormente
  document.querySelector(contenedor).innerHTML="";

  let btns=document.querySelectorAll(botones);
  for(const b of btns){
    document.getElementById(b.id).disabled=false;
    document.getElementById(b.id).style.display="block";

  }
  document.querySelector(logout).style.display="none";
}

function muestraLogOut(selector="#logout"){
  document.querySelector(selector).style.display="block";
}


const bitlogin = (selector) => {
  let el = document.querySelector(selector)
  return {
    login: (...args) => {
      let fn;
      let options;
      let success;
      let fail;

      if (args.length === 4) {
        fn = args[0];
        options = args[1];
        success = args[2];
        fail = args[3];
      }else if (args.length === 3) {
        fn = args[0];
        options = args[1];
        success = args[2];
      } else if (args.length === 2) {
        fn = args[0];
        success = args[1];
      }

      let time = Date.now().toString()
      let space = location.host
      let timespace = time + '@' + space
      bitlogin.fn[fn](el, timespace, (user) => {
        if (options) {
          if (options.cookie) {
            document.cookie = "paymail=" + user.paymail
            document.cookie = "pubkey=" + user.pubkey
            document.cookie = "sig=" + user.sig
            document.cookie = "timespace=" + user.timespace
          }
        } 
        localStorage.setItem("bitlogin", JSON.stringify(user))
        success(user)
      }, function(e){
          console.log("Fallo en Bitlogin")
          fail(e)
          console.log(e)
      })
    },
    logout: (success) => {
      document.getElementById("logout").addEventListener("click", (e) => {
        localStorage.removeItem("bitlogin")
        document.cookie = "paymail= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "pubkey= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "sig= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "timespace= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        success()
        return false;
      })
    }
  }
}
bitlogin.fn = {}
bitlogin.user = () => {
  let u = localStorage.getItem("bitlogin")
  return JSON.parse(u)
}

const bitloginMenu = (selector="") => {
  let el = document.querySelector(selector)

  el.innerHTML=`<button id="relayx" class="logbtn"><img src="img/relay.png" width="130px" alt="RelayX"></button>
  <button id="moneybutton" class="logbtn"><img src="img/moneybutton.png" width="150px" alt="MoneyButton"></button>
  <button id="handcash" class="logbtn"><img src="img/handcash.png" width="180px" alt="Handcash"></button>
  <button id="voltid" class="logbtn"><img src="img/volt.png" width="180px" alt="Volt"></button>
  <button id="sensilet" class="logbtn"><img src="img/sensilet.png" width="130px" alt="Sensilet"></button>
  <button id="dotwallet" class="logbtn"><img src="img/dotwallet.png" width="130px" alt="DotWallet"></button>`;
}