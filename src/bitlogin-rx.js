bitlogin.fn.relayone = async (el, timespace, success, fail) => {
      let RELAYSIGNPREFIX="1RELAYTEST";

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
        console.log(bitlogin.user())

      }
      loader.className="loader loader-double";

        }, function (e){
            console.log("Fallo moneybutton", e.message) 
            activaBtns();
      })    
    })


  }, false);

}