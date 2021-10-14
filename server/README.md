## **Getting Started**
### **Installation**
Run ```npm install``` within the ```~/client``` and ```~/server``` directories respectively. If installing for a build, run ```npm install``` in the root directory.
### **Client**
Run the client by using ```npm start``` within ```~/client```
### **Server**
Run the server by using ```npm start``` within ```~/server```

---

## **Routes**

[Auth](#auth)

[Users](#users)

[Products](#products)

[Orders](#orders)

[Games](#games)

[Favorites](#favorites)

[Followers](#followers)

[Views](#views)

[Stripe](#stripe)

---

### **Auth**
```POST /auth/login```

```POST /auth/logout```

```POST /auth/token```

### **Users**
```POST /users```

```GET /users```

```GET /users/:id```

```PUT /users/:id```

```DELETE /users/:id```

```PUT /users/:id/ban```

```PUT /users/:id/unban```

### **Products**
```POST /products```

```GET /products```

```GET /products/:id```

```PUT /products/:id```

```DELETE /products/:id```

### **Orders**
```POST /orders```

```GET /orders```

```GET /orders/:id```

```PUT /orders/:id/deliver```

```PUT /orders/:id/confirm```

```PUT /orders/:id/cancel```

### **Games**
```POST /games```

```GET /games```

```GET /games/:id```

```PUT /games/:id```

```DELETE /games/:id```

### **Favorites**
```POST /favorites```

```GET /favorites```

```GET /favorites/:id```

```DELETE /favorites/:id```

### **Followers**
```POST /followers```

```GET /followers```

```GET /followers/:id```

```DELETE /followers/:id```

### **Views**
```POST /views```

```GET /views```

```GET /views/:id```

```DELETE /views/:id```

### **Stripe**
```POST /stripe/account```

```GET /stripe/account/:id/onboarding```

```GET /stripe/payment-requests/:id/secret```