# bitlogin

Serverless login with bitcoin

## 1. Login

### a. Basic

Stores login info on localStorage

```
$bit("#login").login("moneybutton", (e) => {
  window.location.href = // redirect url
})
```

### b. Advanced

You can also additionally store login info as cookie

```
$bit("#login").login("moneybutton", { cookie: true }, (e) => {
  window.location.href = // redirect url
})
```

## 2. Current User


```
let current_user = $bit.user()
```

## 3. Logout

Attach logout event handler to any element

```
$bit("#logout").logout((e) => {
  window.location.href = // redirect url
})
```
