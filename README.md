# Expense Management Application

A comprehensive application for tracking and managing personal or business expenses efficiently. This application provides an intuitive interface for recording, categorizing, and analyzing expenses to help users maintain better financial control.

## Technologies

### Backend
- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications
- **PostgreSQL**: Powerful, open-source object-relational database system
- **JWT Authentication**: Secure authentication mechanism for protecting resources

### Frontend
- **Angular**: Platform for building mobile and desktop web applications
- **TailwindCSS**: Utility-first CSS framework for rapidly building custom user interfaces
- **ng2-charts**: Angular wrapper for Chart.js for creating beautiful charts

### DevOps
- **Docker**: Containerization for consistent deployment across environments

## Features

- User authentication and authorization with JWT
- Expense tracking and categorization
- Financial reports and visualizations
- Budget planning and management
- Secure data storage with PostgreSQL
- Responsive design for all devices
- Multilanguage support

## Installation

### Prerequisites
- Docker and Docker Compose
- Node.js (v18.20 or later)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yaro08/Expense-Manager.git
   cd Expense-Manager
   ```

2. Start the application using Docker:
   ```bash
   docker-compose up -d
   ```

3. Access the application at http://localhost:4200

## Development

### Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run start:dev
```

### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
ng serve
```

## Project Structure

```
gestorGastos/
├── backend/           # NestJS backend application
├── frontend/          # Angular frontend application
├── docker-compose.yml # Docker configuration
└── README.md          # Project documentation
```

## Upcoming Features

- [ ] Live demo deployment
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Export/import functionality
- [ ] Multi-currency support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Yaro - [https://github.com/yaro08](https://github.com/yaro08)