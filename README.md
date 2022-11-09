# bitlogin

Serverless login with bitcoin

## 1. Login

### a. Basic

Stores login info on localStorage

```
bitlogin("#login").login("moneybutton", (e) => {
  window.location.href = // redirect url
})
```

### b. Advanced

You can also additionally store login info as cookie

```
bitlogin("#login").login("moneybutton", { cookie: true }, (e) => {
  window.location.href = // redirect url
})
```

## 2. Current User


```
let current_user = bitlogin.user()
```

## 3. Logout

Attach logout event handler to any element

```
bitlogin("#logout").logout((e) => {
  window.location.href = // redirect url
})
```
