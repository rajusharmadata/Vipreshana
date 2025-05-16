<div align="center">
  <img src="https://img.shields.io/badge/Vipreshana-RealTime%20Tracking%20Platform-blueviolet?style=for-the-badge" />
  <br><br>
  <img width="400" alt="Vipreshana Logo" src="image.png" />
</div>

<hr>

<div align="center">
  <img src="https://forthebadge.com/images/badges/built-by-developers.svg" />
  <img src="https://forthebadge.com/images/badges/powered-by-responsibility.svg" />
  <img src="https://forthebadge.com/images/badges/uses-brains.svg" />
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
        <td><a href="https://github.com/yourusername/Vipreshana/stargazers"><img src="https://img.shields.io/github/stars/yourusername/Vipreshana?style=for-the-badge&logo=github" /></a></td>
        <td><a href="https://github.com/yourusername/Vipreshana/forks"><img src="https://img.shields.io/github/forks/yourusername/Vipreshana?style=for-the-badge&logo=git" /></a></td>
        <td><img src="https://img.shields.io/github/issues-search/yourusername/Vipreshana?query=is:issue&style=for-the-badge&label=Issues" /></td>
        <td><img src="https://img.shields.io/github/issues-search/yourusername/Vipreshana?query=is:pr&style=for-the-badge&label=Pull%20Requests" /></td>
      </tr>
    </tbody>
  </table>
</div>

---

## 🚀 Project Overview

**Vipreshana** is a **real-time delivery and complaint tracking platform** that enables users and administrators to monitor service status, manage issues, and ensure transparency across the delivery lifecycle. With **live location tracking**, **complaint resolution workflow**, and **SMS notifications**, the platform is aimed at transforming operational efficiency and enhancing user trust.

---

## 💡 Problem Statement

Organizations and users often face challenges in tracking service requests, deliveries, and complaint resolutions. Lack of transparency, delayed updates, and manual tracking lead to dissatisfaction and inefficiency.

---

## ✅ Proposed Solution

**Vipreshana** solves this by enabling:
- Live **delivery/complaint status tracking** via location APIs.
- Secure **OTP verification** to ensure valid users.
- **Real-time SMS alerts** using Twilio.
- Role-based dashboards for **users** and **officers/admins**.
- A complete **end-to-end resolution lifecycle** with automated updates.

---

## 🔧 Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white" />
</div>

---

## ✨ Features

- 📍 **Live Location Tracking** of deliveries and issue status
- 🧑‍💻 **Role-based Portals**: Separate dashboards for users and officers
- 🔐 **OTP Authentication** using Twilio for secure access
- 📤 **Complaint Submission** with file upload (image/doc)
- 📲 **SMS Notifications** for status updates
- 📊 **Admin Dashboard** to view, assign, and resolve issues
- 🧾 **Feedback System** for user satisfaction tracking

---

## 🧭 User Flow

### 🧍‍♂️ User

1. Register and verify mobile via OTP.
2. Login and access dashboard.
3. Submit delivery complaints with location and images.
4. Track issue status live.
5. Receive SMS when issue is updated/resolved.

### 👮 Officer/Admin

1. Login via authorized email domain.
2. View incoming complaints.
3. Track complaint status with map and images.
4. Mark issues as resolved to trigger SMS to user.
5. Maintain operational dashboard.

---

## 📦 Local Setup

Make sure you have **Node.js**, **npm**, and **PostgreSQL** installed.

```bash
# Clone the repository
git clone https://github.com/yourusername/Vipreshana.git
cd Vipreshana

# Install frontend and backend dependencies
cd frontend
npm install
cd ../backend
npm install

# Set up environment variables
cp .env.example .env
# Add your DB credentials, Twilio keys, and secret tokens in .env

# Run backend server
npm run start

# Run frontend server
cd ../frontend
npm run dev

# Visit the app at:
# http://localhost:3000/
