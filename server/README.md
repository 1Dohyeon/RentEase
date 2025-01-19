### 1. Rules

**.eslintrc.js/prettier rule**

```
'prettier/prettier': [
    'error',
    {
        endOfLine: 'auto',
    },
],
```

### 2. 라이브러리

**0. node_modules**

```
npm i
```

**1. mysql2**

```
npm i --save mysql2
```

**2. typeorm**

```
npm i --save @nestjs/typeorm typeorm
```

**3. config**

```
npm i --save @nestjs/config
```

**4. class-validator class-transformer**

```
npm i --save class-validator class-transformer
```

**5. swagger**

```
npm i --save @nestjs/swagger swagger-ui-express
```

**6. bcrypt**

```
npm i bcrypt
```

> 적용: import \* as bcrypt from "bcrypt";

- 자동으로 import 안되는 경우가 있음...

**7. jwt passport**

```
npm i --save @nestjs/passport passport
npm i --save @nestjs/jwt passport-jwt
npm i --save-dev @types/passport-jwt
```

**8. request-ip**

```
npm i request-ip
```

**9. socket**

```
npm install @nestjs/platform-socket.io socket.io
npm install @types/socket.io @types/socket.io-client
npm install @nestjs/platform-express cors
```

**10. multer**

```
npm install multer
```
