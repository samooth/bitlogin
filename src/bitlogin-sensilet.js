bitlogin.fn.sensilet = async (el, timespace, success, fail) => {
    if (typeof(window.sensilet.requestAccount)==="function"){
     try{

      const sensi = window.sensilet;
      const address = await sensi.requestAccount();
      const accountInfo = await sensi.getAccount();
      console.log(sensi);
      console.log(accountInfo)
      const firma = await sensi.signMsg({ msg: timespace });
      console.log(firma)
        // Verifica la firma
         const ecdsa = new Ecdsa()
        ecdsa.hashBuf = Bsm.magicHash(Buffer.from(timespace,'utf8'))
        ecdsa.sig = Buffer.from(firma.sig,"base64")
        let publica = ecdsa.sig2PubKey()
        console.log(publica)

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
                  console.log(bitlogin.user())
                  loader.className="loader loader-double";

                }, function (e){
                  console.log("Fallo sensilet", e.message) 
                  activaBtns();

                })

          }, false);
}
