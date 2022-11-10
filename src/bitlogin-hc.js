const {bitlogin, desactivaBtns, activaBtns, loadScript }= require("./bitlogin")

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

module.exports={bitlogin}