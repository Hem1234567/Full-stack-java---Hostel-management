# Hostel Management System - Complete Setup Guide

Welcome to the Hostel Management System! This guide is designed for absolute beginners. We will walk through every single step required to get this project up and running on your computer. 

There are three main parts to running this system:
1. **The Database (MySQL)**: Where all our data (students, rooms, fees) is stored.
2. **The Backend (Spring Boot)**: The engine that processes logic and talks to the database.
3. **The Frontend (React/Vite)**: The beautiful user interface you interact with in your browser.

---

## Part 1: Setting up the MySQL Database

Since you need a place to store data, we must install MySQL.

### Step 1.1: Download and Install MySQL
1. Go to the official MySQL website: [MySQL Installer for Windows](https://dev.mysql.com/downloads/installer/)
2. Download the **"Windows (x86, 32-bit), MSI Installer"** (usually the larger file around ~300MB+ so it works offline).
3. Open the downloaded file to start the installer.
4. Choose **"Developer Default"** or **"Server Only"** as the setup type and click **Next**.
5. Keep clicking **Next** and **Execute** to install the required products.
6. When you reach the **"Accounts and Roles"** page, it will ask you for a **Root Password**. 
   - **CRITICAL STEP**: Type exactly `root` as the password. 
   - Confirm it by typing `root` again. 
   - *(Note: We use this simple password because our backend code is currently configured to look for the password `root`. If you use something else, the backend will crash.)*
7. Keep clicking **Next** and **Execute** until the installation is completely finished.

### Step 1.2: Create the Database for our App
Now that MySQL is installed, we need to create an empty container (database) for our hostel app.

1. Open your Windows Start Menu and search for **"MySQL Command Line Client"**. Open it.
2. It will ask for a password. Type `root` and hit Enter.
3. You will see a `mysql>` prompt. Type the following command exactly as shown (don't forget the semicolon at the end!) and press Enter:
   ```sql
   CREATE DATABASE hostel_db;
   ```
4. You should see a message saying `Query OK, 1 row affected`. 
5. Type `exit` and press Enter to close it. You are done with the database setup!

---

## Part 2: Running the Backend (Spring Boot / Java)

The backend is built in Java and connects to the MySQL database you just set up.

### Step 2.1: Verify Java Installation
1. Open a new Terminal (or Command Prompt / PowerShell).
2. Type `java -version` and press Enter.
3. You should see something like `java version "25..."` or similar. If you see an error, you need to install the Java JDK from the Oracle website.

### Step 2.2: Run the Backend Code
1. Open a new Terminal in VS Code (or your regular command prompt).
2. Navigate to the `backend` folder by typing:
   ```bash
   cd D:\0-Full-Java-Projects\Hostel-Management-platform\backend
   ```
3. Run the following command to start the backend engine:
   ```bash
   .\mvnw spring-boot:run
   ```
4. The first time you run this, it might take a few minutes to download some internet files.
5. Wait until you see a message like `Started BackendApplication in X seconds`. 
   *(Note: This terminal must stay open! If you close it, the backend turns off.)*

---

## Part 3: Running the Frontend (React UI)

The frontend is the visual website. It needs to run at the same time as the backend.

### Step 3.1: Verify Node.js Installation
1. Open a **brand new** Terminal (do not close the backend terminal!).
2. Type `node -v` and press Enter. You should see a version number like `v22.x.x`. If you don't, you must download and install Node.js from [nodejs.org](https://nodejs.org/).

### Step 3.2: Run the Frontend Code
1. In your new terminal, navigate to the `frontend` folder:
   ```bash
   cd D:\0-Full-Java-Projects\Hostel-Management-platform\frontend
   ```
2. (Optional but recommended) Run this command to ensure all required packages are downloaded:
   ```bash
   npm install
   ```
3. Run the following command to start the website:
   ```bash
   npm run dev
   ```
4. After a second, it will say `➜  Local:   http://localhost:5173/`. 

---

## Part 4: Using the Application!

Everything is now running! 

1. Open your favorite web browser (Chrome, Edge, Safari).
2. In the address bar, type: **`http://localhost:5173`** and press Enter.
3. You will see the Login screen of the Hostel Management System.
4. Click the **"Register"** tab to create your first account.
   - You can choose to register as an **ADMIN** to manage the hostel.
   - Or register as a **STUDENT** to view the student dashboard.
5. Enjoy your fully working application!

### Quick Troubleshooting
- **Backend crashes immediately?** Double-check your MySQL password. Make sure MySQL is running and your database `hostel_db` was created successfully.
- **Frontend shows a blank screen?** Make sure you ran `npm install` inside the frontend folder before running `npm run dev`.
- **Can't login or register?** Make sure the backend terminal is still open and running without errors. The frontend needs the backend to verify users.
