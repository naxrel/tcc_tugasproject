# Setup Backend

Jalankan perintah berikut secara berurutan untuk menyiapkan dan menjalankan backend:

```bash
cd backend
npm install
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```
