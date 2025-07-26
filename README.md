##Please read these instruction to run the application. 

##Steps to run the project using commands in your IDE terminal: 

Step 1: Download project
- Open the folder of your choice on Visual Studio Code or any IDE.
- Open the terminal and run the commands.
```bash
git clone https://github.com/HuyAnh5/SWE30003.git
```

#For frontend:

Step 2: Change directory 
```bash
cd SWE30003
cd Frontend
```
Step 3: Install package
```bash
npm install
```

Step 4: Run the website 
```bash
npm run dev
```

-  You should see this link "http://localhost:####/" appear on the terminal. Copy it then paste it to any search engine to run the website or use this combination “Control” button + “LMB” on the link itself.  

For backend:

Step 5: Open the database workspace 
then import the pharmacy_system.sql file to create tables (SWE30003/pharmacy_system.sql)

Step 6: Go back to the IDE and open a new terminal and redirect to backend folder
```bash
cd SWE30003
cd Backend
```
Step 7: Install dependencies
```bash
npm init -y
npm install express mysql2 cors dotenv jsonwebtoken bcryptjs
```

Step 8: Run the database
```bash
node server.js
```
