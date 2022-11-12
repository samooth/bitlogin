
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

module.exports={bitlogin}