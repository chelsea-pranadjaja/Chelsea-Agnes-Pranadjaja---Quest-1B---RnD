BNCC Internal Event Feedback System

description:


### git clone
-> 

### Setup guide

1. install npm (npm install)
2. install express (npm install express)
3. server: http://localhost:3000

### Structure (./BNCC/backend)
1. feedback.json - array

2. Node main.js
    - save data feedback ke array di JSON file (feeback.json)

3. Public - html & css
    - feedback.html
    - admin.html

4. readme.md

### Client Pages
- `/` -> feedback form  
- `/admin` -> admin panel

### APIs
- `POST /api/feedback` -> buat feedback baru dengan validasi di feedback form
- `GET /api/feedback` -> list semua feedback yang berhasil di submit.kumpul ke admin panel
- `PUT /api/feedback/:id` -> update status feedback dari admin panel mmelalui ID feedback
- `DELETE /api/feedback/:id` -> hapus feedback dari admin panel melalui ID feedback

### Functions
