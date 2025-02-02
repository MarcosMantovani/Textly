# Textly - Text and Image-Based Social Network

## Description
Textly is a text and image-based social network inspired by platforms like Twitter. Users can create profiles, edit their information (name, username, profile picture, banner, and biography), follow other users, create posts with text and images, reply to posts, edit and delete their own posts, search for posts and users using keywords, and recover their password if forgotten. This project is a Full Stack application built with **Python** on the backend, **TypeScript** and **React** on the frontend, and **PostgreSQL** as the database.

## Access the Live Version
You can access the live version of the project at: [https://textly.fly.dev/login](https://textly.fly.dev/login)

---

## Technologies Used

### Frontend
- **TypeScript**
- **React**
- **ESLint**
- **Prettier**
- **Redux Thunk**
- **Styled Components**

### Backend
- **Django**
- **Djoser** (for user authentication)
- **Django Rest Framework**

### Database
- **PostgreSQL**

---

## Getting Started

To run this project locally, follow the steps below.

### Prerequisites
- **Docker** and **Docker Compose** installed on your machine.

### Environment Variables
Before running the project, make sure to set up the following environment variables in a `.env` file:

```plaintext
SECRET_KEY=
DEBUG=

EMAIL_HOST_PASSWORD=
EMAIL_HOST_USER=

DATABASE_URL=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

REACT_APP_API_URL=
```

### Running the Project
1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/MarcosMantovani/Textly
   ```
2. Navigate to the project directory:
   ```bash
   cd Textly
   ```
3. Start the application using Docker Compose:
   ```bash
   docker compose up --build
   ```
4. Once the containers are up and running, you can access the application at:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:8001](http://localhost:8001)

---

## Docker Compose Configuration

The `docker-compose.yaml` file defines three services: `db`, `backend`, and `frontend`.

### Services
- **db**: PostgreSQL database service.
- **backend**: Django backend service. It handles migrations and runs the Django application using Gunicorn.
- **frontend**: React frontend service. It builds and serves the frontend application.

### Networks
- All services are connected to a custom bridge network named `django_network`.

### Volumes
- A volume named `postgres_data` is used to persist PostgreSQL data.

- A volume named `media` is used to persist images.

---

## Project Structure

- **backend**: Contains the Django backend code.
- **frontend**: Contains the React frontend code.
- **docker-compose.yaml**: Defines the Docker services for the project.
- **.env**: Environment variables file (not included in the repository for security reasons).

---

## Contributing
If you'd like to contribute to this project, feel free to fork the repository and submit a pull request. Please ensure your code follows the project's coding standards and includes appropriate tests.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## Acknowledgments
- Thanks to the Django and React communities for their excellent documentation and resources.
- Special thanks to the maintainers of Djoser, Django Rest Framework, and other libraries used in this project.

---

Enjoy using **Textly**! 🚀