
# AirchitectLoggerTool

A unified logging data tool built with **React + TypeScript + Vite**.

This project was developed by a team of five students and provides a minimal yet powerful setup for uploading, validating, and processing data from iiTrak 2 and Hioki logger devices. It combines modern frontend tooling with a robust .NET backend and database integration.

---

## ✨ Features

- **Support for iiTrak 2 and Hioki devices**  
  With different connection methods and data handling logic.

- **Bluetooth support**  
  Custom TypeScript-based Bluetooth driver implementation.

- **USB support**  
  File upload mechanism for data ingestion.

- **Data validation**  
  Additional checks on exported measurement data.

- **Data processing**  
  Validated data is processed and sent to a relational database.

---

## 🧱 Tech Stack

### Frontend
- React  
- TypeScript  
- Vite  
- Material UI

### Backend
- C# (.NET 8)  
- RESTful API  
- Entity Framework

### Database
- MSSQL or PostgreSQL

### (Optional) Backend-for-Frontend
- OAuth2-based proxy service for authentication & authorization

---

## ⚙️ React + TypeScript + Vite Setup

This project uses Vite for fast development and HMR. It supports two official plugins:

- [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react) – uses Babel for Fast Refresh  
- [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react-swc) – uses SWC for Fast Refresh

---

📦 Getting Started
bash


# Install dependencies
npm install

# Start development server
npm run dev
