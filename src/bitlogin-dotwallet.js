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