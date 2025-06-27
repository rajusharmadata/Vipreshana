<h1 align ="center"> Vipreshana 🚚</h1>

<div align="center">
  <img src="https://forthebadge.com/images/badges/built-with-love.svg" />&nbsp;
  <img src="https://forthebadge.com/images/badges/uses-brains.svg" />&nbsp;
  <img src="https://forthebadge.com/images/badges/powered-by-responsibility.svg"/>
</div>
<br/>

<div align="center">
  <table>
    <thead>
      <tr>
        <td><strong>🌟 Stars</strong></td>
        <td><strong>🍴 Forks</strong></td>
        <td><strong>🐛 Issues</strong></td>
        <td><strong>🔔 Pull Requests</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/sailaja-adapa/vipreshana/stargazers"><img src="https://img.shields.io/github/stars/sailaja-adapa/vipreshana?style=for-the-badge&logo=github" /></a></td>
        <td><a href="https://github.com/sailaja-adapa/vipreshana/forks"><img src="https://img.shields.io/github/forks/sailaja-adapa/vipreshana?style=for-the-badge&logo=git" /></a></td>
        <td><img src="https://img.shields.io/github/issues-search/sailaja-adapa/vipreshana?query=is:issue&style=for-the-badge&label=Issues" /></td>
        <td><img src="https://img.shields.io/github/issues-search/sailaja-adapa/vipreshana?query=is:pr&style=for-the-badge&label=Pull%20Requests" /></td>
      </tr>
    </tbody>
  </table>
</div>

---

## 🚀 Project Overview

**Vipreshana** is a **real-time delivery and complaint tracking platform** that enables users and administrators to monitor service status, manage issues, and ensure transparency across the delivery lifecycle. With **live location tracking**, **complaint resolution workflow**, and **SMS notifications**, the platform is aimed at transforming operational efficiency and enhancing user trust.

---

<details>
  <summary><strong>📑 Table of Contents</strong></summary>

- [💡 Problem Statement](#-problem-statement)
- [✅ Proposed Solution](#-proposed-solution)
- [🔧 Tech Stack](#-tech-stack)
- [✨ Features](#-features)
- [📦 Local Setup](#-local-setup)
  - [🍴 1. Fork & Clone the Repository](#-1-fork--clone-the-repository)
- [📄 License](#-license)

  </details>

## 💡 Problem Statement

Organizations and users often face challenges in tracking service requests, deliveries, and complaint resolutions. Lack of transparency, delayed updates, and manual tracking lead to dissatisfaction and inefficiency.

---

## ✅ Proposed Solution

**Vipreshana** solves this by enabling:
- Live **delivery/complaint status tracking** via location APIs.
- **Real-time SMS alerts** using Twilio.
- Role-based dashboards for **Users**,**Drivers**, and **Admins**.
- A complete **end-to-end resolution lifecycle** with automated updates.

---

## 🔧 Tech Stack

<div align="center"> 
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/React.js-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white" />
</div>

---

## ✨ Features

- 📍 **Live Location Tracking** of deliveries and issue status
- 🧑‍💻 **Role-based Portals**: Separate dashboards for users and officers
- 📲 **SMS Notifications** for status updates
- 📊 **Admin Dashboard** to view, assign, and resolve issues

---

## 📦 Local Setup

Want to run **Vipreshana** locally and contribute? Follow these simple steps! 🚀✨


### 🍴 1. Fork & Clone the Repository

First, fork the repository to your GitHub account. Then, open your terminal and run:

```bash
# Clone your forked repo
git clone https://github.com/<your-username>/Vipreshana.git

# Move into the project directory
cd Vipreshana

# Install Frontend Dependencies
npm install

# Move to server directory and install backend dependencies
cd server
npm install

# Add .env file
cp .example.env .env

# Then open .env and add the following credentials
MONGO_CONNECTION_STRING=your_mongo_connection_string
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
PORT=5000

# From the root directory [For frontend]
npm start

# From the root directory [For backend]
cd server
npm run dev


# Visit the app at:
http://localhost:3000/ 

# Backend server runs on
http://localhost:5000/

```
---

## 📄 License

This project is licensed under the [MIT License](LICENSE.txt)

---