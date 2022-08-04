
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
