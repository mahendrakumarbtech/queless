# Setup aur Run Karne Ka Tarika (हिंदी/English)

## Pehle Ye Check Karein (Prerequisites)

1. **Node.js** install hona chahiye (v14 ya usse upar)
   - Check karne ke liye: `node --version`
   - Agar nahi hai to: https://nodejs.org se install karein

2. **MongoDB** install aur running hona chahiye
   - Check karne ke liye: `mongod --version`
   - Agar nahi hai to: https://www.mongodb.com/try/download/community se install karein
   - MongoDB start karein: `mongod` (ya macOS me: `brew services start mongodb-community`)

3. **npm** ya **yarn** hona chahiye
   - Check karne ke liye: `npm --version`

## Step 1: Backend Setup

Terminal me ye commands run karein:

```bash
# Project folder me jao
cd /Applications/node/queless

# Backend folder me jao
cd backend

# Dependencies install karein
npm install

# .env file banayein
cp .env.example .env
```

Ab `.env` file ko edit karein aur ye values set karein:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/queless
JWT_SECRET=apna_secret_key_yaha_dalein_koi_bhi_random_string
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important**: `JWT_SECRET` me koi bhi random string dalein (jaise: `mySecretKey123456`)

## Step 2: Frontend Setup

Naya terminal window kholen aur:

```bash
# Frontend folder me jao
cd /Applications/node/queless/frontend

# Dependencies install karein
npm install

# .env file banayein (agar nahi hai to)
# .env file me ye add karein:
# NODE_API_BASE_URL=http://localhost:5000/api
```

## Step 3: MongoDB Start Karein

Agar MongoDB already running nahi hai to:

```bash
# macOS me
brew services start mongodb-community

# Ya directly
mongod
```

## Step 4: Backend Start Karein

Backend folder me:

```bash
cd /Applications/node/queless/backend
npm run dev
```

Ya agar `nodemon` nahi hai to:

```bash
npm start
```

Backend `http://localhost:5000` par chalega.

## Step 5: Frontend Start Karein

Naya terminal window me:

```bash
cd /Applications/node/queless/frontend
npm start
```

Frontend automatically browser me khul jayega `http://localhost:3000` par.

## Complete Setup Commands (Ek Saath)

Agar sab kuch ek saath karna ho to:

### Terminal 1 - MongoDB:
```bash
mongod
```

### Terminal 2 - Backend:
```bash
cd /Applications/node/queless/backend
npm install
cp .env.example .env
# .env file edit karein
npm run dev
```

### Terminal 3 - Frontend:
```bash
cd /Applications/node/queless/frontend
npm install
npm start
```

## Pehli Baar Use Karne Ke Liye

1. Browser me `http://localhost:3000` kholen
2. **Register** button par click karein
3. Apna role select karein:
   - **Customer**: Queue book karne ke liye
   - **Provider**: Apni dukaan/service ke liye
   - **Staff**: Provider ke staff ke liye
4. Login karein aur dashboard use karein

## Agar Error Aaye To

### MongoDB Connection Error:
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: MongoDB start karein: `mongod`

### Port Already in Use:
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: `.env` me PORT change karein (jaise: `PORT=5001`)

### Module Not Found:
```
Error: Cannot find module 'xyz'
```
**Solution**: `npm install` dobara run karein

### CORS Error:
**Solution**: Frontend `.env` me `NODE_API_BASE_URL` check karein

## Quick Test

1. Backend health check: Browser me `http://localhost:5000/api/health` kholen
   - Agar `{"status":"OK"}` dikhe to backend sahi chal raha hai

2. Frontend: `http://localhost:3000` kholen
   - Home page dikhna chahiye

## Production Me Deploy Karne Ke Liye

1. Backend: `npm start` (production mode)
2. Frontend: `npm run build` (build folder banega)
3. Build folder ko kisi hosting service par deploy karein

---

**Note**: Agar koi problem ho to error message share karein, main help karunga!
