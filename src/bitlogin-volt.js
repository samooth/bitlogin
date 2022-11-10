const {bitlogin }= require("./bitlogin")

bitlogin.fn.volt = async (el, timespace, exito, fail) => {
    try{

      const volt = new voltsdk.Bsv();
      const token = await volt.connectAccount({ network: "mainnet" }); // network: 'mainnet' | 'testnet'


      volt.on('accountChanged', async (depositAddress) => {
        console.log(depositAddress)
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

module.exports={bitlogin}