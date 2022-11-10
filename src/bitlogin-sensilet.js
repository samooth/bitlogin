
const { Bsm, Address, Ecdsa } = require("bsv")
const {bitlogin, desactivaBtns, activaBtns, muestraLogOut, loadScript }= require("./bitlogin")

const Buffer = require("bsv").deps.Buffer

bitlogin.fn.sensilet = async (el, timespace, success, fail) => {
    if (typeof(window.sensilet.requestAccount)==="function"){
     try{

      const sensi = window.sensilet;
      const address = await sensi.requestAccount();
      const accountInfo = await sensi.getAccount();
      console.log("account info",accountInfo)
      const firma = await sensi.signMessage(timespace);
        // Verifica la firma
        //const ecdsa = new Ecdsa( Buffer.from(timespace,'utf8'),  Buffer.from(firma.sig,"base64"))
        //console.log(ecdsa.verify())
        //ecdsa.hashBuf = Bsm.magicHash(Buffer.from(timespace,'utf8'))
        //ecdsa.sig = Buffer.from(firma.sig,"base64")
        //let publica = ecdsa.sig2PubKey()
        // console.log(publica)
        console.log(timespace, firma)
        let direccion = ""
        if (bitlogin.network==="test"){ 
          direccion = Address.Testnet.fromString(address) 
        }else{
          direccion = Address.fromString(address)
        }
        let msgBuf =Buffer.from(timespace,'utf8')

        let verifica = Bsm.verify( msgBuf, firma, direccion )

        if (!verifica){
          console.log("firma no valia")
          throw Error("firma no valida");
        }
        let user = { wallet:'sensilet', paymail: "", address: address, timespace: timespace, sig: firma }

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
                  console.log(bitlogin.user())
                  loader.className="loader loader-double";

                }, function (e){
                  console.log("Fallo sensilet", e.message) 
                  activaBtns();

                })

          }, false);
}

module.exports={bitlogin}