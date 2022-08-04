//const { Address, KeyPair,PrivKey, PubKey, Ecdsa, Bsm } = require("bsv")

const deviceKeys=()=>{
  //Generate or Get device key stored on device
  let devKey = localStorage.getItem("deviceKey");
  let myPrivKey;

  if (!devKey) {
      myPrivKey = PrivKey.fromRandom();
      localStorage.setItem("deviceKey", PrivKey.fromRandom());
  } else {
      myPrivKey = PrivKey.fromString(devKey);

  }

  let myPubKey = PubKey.fromPrivKey(myPrivKey);
  return KeyPair.fromPrivKey(myPrivKey);

}

const bitloginMenu = (selector = "", isMobile = false) => {

    let el = document.querySelector(selector)

    let rx = document.createElement("button")
    rx.className = "logbtn"
    rx.id = "relayx";
    let rx_img = document.createElement("img")
    rx_img.alt = "RelayX";
    rx_img.src = "./img/relay.png"
    rx_img.style.width = "150px";
    rx.appendChild(rx_img);
    el.appendChild(rx);
    bitlogin.fn.relayListen();



    let mb = document.createElement("button")
    mb.className = "logbtn"
    mb.id = "moneybutton";
    let mb_img = document.createElement("img")
    mb_img.alt = "MoneyButton";
    mb_img.src = "./img/moneybutton.png"
    mb_img.style.width = "150px";
    mb.appendChild(mb_img);
    el.appendChild(mb);
    bitlogin.fn.moneybuttonListen();

    let hc = document.createElement("button")
    hc.className = "logbtn"
    hc.id = "handcash";
    let hc_img = document.createElement("img")
    hc_img.alt = "HandCash";
    hc_img.src = "./img/handcash.png"
    hc_img.style.width = "170px";
    hc.appendChild(hc_img);
    el.appendChild(hc);
    bitlogin.fn.handcashListen();

    let dot = document.createElement("button")
    dot.className = "logbtn"
    dot.id = "dotwallet";
    let dot_img = document.createElement("img")
    dot_img.alt = "DotWallet";
    dot_img.src = "./img/dotwallet.png"
    dot_img.style.width = "150px";
    dot.appendChild(dot_img);
    el.appendChild(dot);
    bitlogin.fn.dotwalletListen();

    if (!isMobile) {
        let volt = document.createElement("button")
        volt.className = "logbtn"
        volt.id = "voltid";
        let volt_img = document.createElement("img")
        volt_img.alt = "Volt.Id";
        volt_img.src = "./img/volt.png"
        volt_img.style.width = "150px";
        volt.appendChild(volt_img);
        el.appendChild(volt);
        bitlogin.fn.voltListen();

        let sens = document.createElement("button")
        sens.className = "logbtn"
        sens.id = "sensilet";
        let sens_img = document.createElement("img")
        sens_img.alt = "Sensilet";
        sens_img.src = "./img/sensilet.png"
        sens_img.style.width = "150px";
        sens.appendChild(sens_img);
        el.appendChild(sens);
        bitlogin.fn.sensiletListen();

    }


}
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


let bitlogin = (selector) => {
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
      let devKeys = deviceKeys()

      let timespace = time + '@' + space+"::"+devKeys.pubKey.toString();
      bitlogin.fn[fn](el, timespace, (user) => {
        
        if (options) {
          if (options.cookie) {
            document.cookie = "paymail=" + user.paymail
            document.cookie = "pubkey=" + user.pubkey
            document.cookie = "sig=" + user.sig
            document.cookie = "timespace=" + user.timespace
          }
        } 
        console.log("USER:",user)

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




bitlogin.fn.volt = async (el, timespace, exito, fail) => {
    try{

      const volt = new voltsdk.Bsv();
      const token = await volt.connectAccount({ network: "mainnet" }); // network: 'mainnet' | 'testnet'


      volt.on('accountChanged', async (depositAddress) => {
        if (depositAddress) {
          let paymail = await volt.getPaymail();
          let pubkey =  await fetch("https://volt.id/bsvalias/id/"+paymail).then((body)=>{ return body.json(); }).then((json)=>{ 
            return json.pubkey;
          })

        /*
        const firma = await sensi.signMsg({ msg: timespace });

      */
          let user = { wallet:'volt', paymail: paymail, pubkey: pubkey, timespace: timespace }

          exito(user);

        } else {
          console.log('not connected')
        }
      })


   }catch(e){
      fail(e)
      switch (e.message){
        case "user_closed":console.log("El usuario cerró la ventana de inicio de sesión en Volt");break;
        case "Pop-ups blocked by browser, please allow popups and retry": console.log(); break;
      }
   }
}

bitlogin.fn.voltListen= ()=>{
      let loader = document.getElementById('loader');

          document.getElementById("voltid").addEventListener("click",(event) => {
            loader.setAttribute("data-text","Connecting with Volt.id")

            loader.className="loader loader-double is-active";
                 desactivaBtns();

              loadScript("volt").then(()=>{

                bitlogin("#login").login("volt", { cookie: true }, (e) => {                 
                  loader.className="loader";

                  window.location.replace("#/u/" + e.paymail )
                  location.reload()

                }, function (e){
                  loader.className="loader loader-double";
                  console.log("Fallo VoltID", e.message) 
                  activaBtns();
              })
            })

          }, false);

}


bitlogin.fn.sensilet = async (el, timespace, success, fail) => {
    if (typeof(window.sensilet.requestAccount)==="function"){
     try{

      const sensi = window.sensilet;
      const address = await sensi.requestAccount();
      const accountInfo = await sensi.getAccount();
      const firma = await sensi.signMsg({ msg: timespace });
      let verifica = Bsm.verify( Buffer.from(timespace,'utf8'), firma.sig,  Address.fromString(firma.address))

        if (!verifica){
          throw Error();
        }
        let user = { wallet:'sensilet', paymail: firma.address, address: firma.address, timespace: timespace, sig: firma.sig }

        success(user);
     }catch(e){
          fail(e)
     }
 
    }else{
      fail("No tiene Sensilet");
      window.open("https://sensilet.com/","_blank");
    }
      /*
      // if (data.origin !== "localhost") throw new Error();
 
      // check signature
      //if (!verify(payload, data.identity, signature)) throw new Error();


      // check that pki matches paymail
      //if (!queryPaymailPKI(data.paymail, data.identity)) throw new Error();
      */
}
bitlogin.fn.sensiletListen=()=>{


          document.getElementById("sensilet").addEventListener("click",(event) => {
            loader.setAttribute("data-text","Connecting with Sensilet")

                bitlogin("#login").login("sensilet", { cookie: true }, (e) => {
                  loader.className="loader loader-double is-active";
                  desactivaBtns();

                  window.location.replace(  "#/u/" + e.paymail )
                  muestraLogOut();
                  loader.className="loader loader-double";

                }, function (e){
                  console.log("Fallo sensilet", e.message) 
                  activaBtns();

                })

          }, false);
}


bitlogin.fn.relayone = async (el, timespace, success, fail) => {
      let RELAYSIGNPREFIX="1RELAYTEST";
      window.onmessage=function(e) {
        console.log(e)
        if (e.data.call==="reply"){
          loader.className="loader loader-double";
        }
        return false;
      }
      try{
       const token = await relayone.authBeta();
        const [payload, signature] = token.split(".");
        const data = JSON.parse(atob(payload));
        console.log(window.entorno)
        if (entorno === 'local') {
            timespace=RELAYSIGNPREFIX+timespace;
        }else{
          timespace="1Kfvrnmhcckx6be1APtV7Hi3BfEZBjbzwr"+timespace
        }
        let firma = await relayone.sign(timespace);

       // if (data.origin !== dominio) throw new Error();
        // Verifica la firma
        let direccion = Address.fromPubKey( PubKey.fromString( data.pubkey ));
        let verifica = Bsm.verify( Buffer.from(timespace,'utf8'), firma.value, direccion)
        if (!verifica){
          throw Error();
        }
        let user = { wallet:'relayx', paymail: data.paymail, pubkey: data.pubkey, timespace: timespace, sig: firma.value }

        success(user);
      }catch(e){
        console.log(e.message, Object.keys(e))
        switch(e.message){
          default:
          case "Not linked": fail(e);break;
        }
      }

      // check that pki matches paymail
      //if (!queryPaymailPKI(data.paymail, data.identity)) throw new Error();
}


bitlogin.fn.relayListen= ()=>{

  document.getElementById("relayx").addEventListener("click",(event) => {
    loader.setAttribute("data-text","Loading RelayX")
    loader.className="loader loader-double is-active";

    desactivaBtns();

    loadScript("rx").then(()=>{
    bitlogin("#login").login("relayone",{ cookie: true }, (e) => {
      if (relayone.isLinked()){ 
        console.log(e.paymail);  
        location.replace(  "#/u/" + e.paymail )
        location.reload()
        muestraLogOut();

      }
      loader.className="loader loader-double";

        }, function (e){
            console.log("Fallo moneybutton", e.message) 
            activaBtns();
      })    
    })


  }, false);

}


bitlogin.fn.moneybutton = (el, timespace, success) => {
  switch(idioma){
    default:case "en": msg1="Slide to LogIn!"; msg2="Free access";break
    case "es": msg1="Desliza para acceder!";msg2="Acceso gratuito";break

  }
  el.innerHTML+=msg1;
  el.style.display="block";
  moneyButton.render(el, {
    label: msg2,
    successMessage: 'logged in',
    cryptoOperations: [
      { name: 'pubkey', method: 'public-key' },
      { name: 'sig', method: 'sign', data: timespace, dataEncoding: 'utf8', key: 'identity' },
    ],
    onCryptoOperations: (p) => {
      let paymail = p[0].paymail;
      let pubkey = p[0].value;
      let sig = p[1].value;
      let user = { wallet:'mb', paymail: paymail, pubkey: pubkey, timespace: timespace, sig: sig }
      success(user)
    }
  })
  window.onmessage=function(e) {
    if (e.data.v1.topic==="create-account:canceled"){
      activaBtns();
    }
    return false;
  }
}

bitlogin.fn.moneybuttonListen= ()=>{
  let  loader = document.getElementById('loader');

            document.getElementById("moneybutton").addEventListener("click", (event) => {
            loader.setAttribute("data-text","Loading MoneyButton")

            loader.className="loader loader-double is-active";
            loadScript("mb").then(()=>{
              desactivaBtns();
              loader.className="loader";

             bitlogin("#login").login("moneybutton",{ cookie: true }, (e) => {
                window.location.replace(  "#/u/" + e.paymail )
                location.reload()

              }, function (e){
                  console.log("Fallo moneybutton", e.message) 
                  activaBtns();
            })

           })
          }, false);

}



bitlogin.fn.handcash = async (el, timespace, success) => {
    let elToken=localStorage.getItem("authToken");
    const handCashConnect = new hcsdk.HandCashConnect(HC_APPID);
  
    if (elToken===null ){
      const redirectionLoginUrl = handCashConnect.getRedirectionUrl();
      window.location.replace(redirectionLoginUrl);
    }
    if(elToken!==null && elToken.length===64){
        try{
            const cuenta = handCashConnect.getAccountFromAuthToken(elToken);
            const perfil = await cuenta.profile.getCurrentProfile();
            const message = Buffer.from(timespace).toString('hex')
            const { publicKey, signature } = await cuenta.profile.signData({
                value: message,
                format: 'hex'
            })
            // Verifica la firma
            let direccion = Address.fromPubKey( PubKey.fromString( publicKey ));
            let verifica = Bsm.verify( Buffer.from(timespace,'utf8'), signature, direccion)
            if (!verifica){
              throw Error();
            }

          // verificar que la clave publica del paymail
          //if (!queryPaymailPKI(data.paymail, data.identity)) throw new Error();

            let user = { wallet:'hc', paymail: perfil.publicProfile.paymail, pubkey: publicKey, timespace: timespace, sig: signature }
            success(user);


        }catch(e){
          console.log(e)
          if(e.message==="Missing authorization"){
                  const redirectionLoginUrl = handCashConnect.getRedirectionUrl();
                  window.location.replace(redirectionLoginUrl);
          }
        }
    }
  

}

bitlogin.fn.handcashListen = () => {
      let loader = document.getElementById('loader');

          const paramToken = new URL(location.href).searchParams.get('authToken');
          if ( paramToken !== null ){
            if(paramToken.length===64 ){
              elToken = paramToken;
              localStorage.setItem("authToken", paramToken);
              history.pushState({}, document.title , appurl);
                loader.setAttribute("data-text","Loading HandCash")
        
                  loader.className="loader loader-double is-active";

                    desactivaBtns();
                    loadScript("hc").then(()=>{
                      bitlogin("#login").login("handcash", { cookie: true }, (e) => { 
                        window.location.replace( "#/u/" + e.paymail )
                        location.reload()
                      }) 
                    }, function (e){
                        console.log("Fallo handcash", e.message) 
                        activaBtns();

                   });
            }
          }


          document.getElementById("handcash").addEventListener("click",(event) => {
            loader.setAttribute("data-text","Loading HandCash")
  
            loader.className="loader loader-double is-active";

              desactivaBtns();
              loadScript("hc").then(()=>{
                bitlogin("#login").login("handcash", { cookie: true }, (e) => { 
                  window.location.replace(  "#/u/" + e.paymail )
                  location.reload()
                }) 
              }, function (e){
                  console.log("Fallo handcash", e.message) 
                  activaBtns();

             }) 


          });
}

bitlogin.fn.dotwallet = async (el, timespace, success, fail) => {
    const CLIENT_ID = DOT_APPID;
    const BACKEND_SERVER= dominio;
    const DOTWALLET_API = `https://api.ddpurse.com`; // https://staging.api.ddpurse.com //note: no /v1/
    const DOTWALLET_CLIENT = 'https://ddpurse.com'; // https://prerelease.ddpurse.com

    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state');
    const code = urlParams.get('code');
    const savedState = localStorage.getItem('loginState');

    if (state != savedState) {
      fail("Error validando la solicitud")
    } else {
        // Enviar datos de acceso al backend
          /*fetch(`${BACKEND_SERVER}/auth`, {
            method: 'POST',
            body: JSON.stringify({ code }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          });*/
    }

    if (!state && !code ){
        const scope = encodeURIComponent('user.info autopay.bsv autopay.btc autopay.eth');
        const redirectURI = encodeURIComponent(`${APPURL}/`);
        const loginState = uuidv4();
        localStorage.setItem('loginState', loginState);

        const loginURL = `${DOTWALLET_API}/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectURI}&response_type=code&state=${loginState}&scope=${scope}`;
        window.location.replace(loginURL);     
    }
      

  
}



bitlogin.fn.dotwalletListen= ()=>{
    let loader = document.getElementById('loader');

    document.getElementById("dotwallet").addEventListener("click",(event) => {
      loader.className="loader loader-double is-active";

      desactivaBtns();

        bitlogin("#logout").login("dotwallet",{ cookie: true }, (e) => { 
            window.location.replace(  "#/u/" + e.paymail )
            window.location.reload()

        }, function (e){
              console.log("Fallo DotWallet", e.message) 
            activaBtns();
          loader.className="loader loader-double";

       }) 

    })
}



module.exports={
    bitlogin,
    bitloginMenu,
    activaBtns,
    desactivaBtns,
    deviceKeys
  }

