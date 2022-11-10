const loadScript = src => {
    let s1;
    switch (src) {
        case "mb":
            s1 = "https://www.moneybutton.com/moneybutton.js";
            break;
        case "rx":
            s1 = "https://one.relayx.io/relayone.js";
            break;
        case "hc":
            s1 = "https://bsv.direct/lib/hc.js";
            break;
        case "volt":
            s1 = "https://bsv.direct/lib/volt-sdk.min.js";
            break;

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
const desactivaBtns = (Selector = ".logbtn") => {
    let btns = document.querySelectorAll(Selector)
    for (const b of btns) {
        document.getElementById(b.id).disabled = true
        document.getElementById(b.id).style.display = "none"
    }
}

const activaBtns = (contenedor = "#login", botones = ".logbtn", logout = "#logout") => {
    //Para borrar el boton renderizado anteriormente
    document.querySelector(contenedor).innerHTML = "";

    let btns = document.querySelectorAll(botones);
    for (const b of btns) {
        document.getElementById(b.id).disabled = false;
        document.getElementById(b.id).style.display = "block";

    }
    document.querySelector(logout).style.display = "none";
}

function muestraLogOut(selector = "#logout") {
    document.querySelector(selector).style.display = "block";
}

const deviceKeys=()=>{
  //Generate or Get device key stored on device
  let devKey = localStorage.getItem("deviceKey");
  let myPrivKey;

  if (!PrivK) {
      myPrivKey = PrivKey.fromRandom();
      localStorage.setItem("deviceKey", bsv.PrivKey.fromRandom());
  } else {
      myPrivKey = PrivKey.fromString(PrivK);

  }

  let myPubKey = PubKey.fromPrivKey(myPrivKey);
  return KeyPair.fromPrivKey(myPrivKey);

}

const bitlogin = (selector) => {
    let el = document.querySelector(selector)
    return {
        login: (...args) => {
            let dkeys = deviceKeys()

            let fn;
            let options;
            let success;
            let fail;

            if (args.length === 4) {
                fn = args[0];
                options = args[1];
                success = args[2];
                fail = args[3];
            } else if (args.length === 3) {
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
                        document.cookie = "dpubkey=" + user.dpubkey;
                        document.cookie = "sig=" + user.sig
                        document.cookie = "timespace=" + user.timespace
                    }
                }
                localStorage.setItem("bitlogin", JSON.stringify(user))
                success(user)
            }, function(e) {
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
                document.cookie = "dpubkey= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
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
module.exports=bitlogin
