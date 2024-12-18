# GoalSync

**GoalSync** is a web application for organizing and joining tournaments. Users can register as organizers to publish events or as players to participate. The platform allows filtering tournaments by city and game while showcasing key details like prizes and certifications. It uses AngularJS for responsive, data-driven interactions and Bootstrap for a mobile-first interface.

## Key Features:

- **Filters**: Refine tournaments by city and game.
- **Tournament Cards**: Display title, game, fee, and prizes.
- **Modal View**: Detailed tournament information.
- **AJAX**: Asynchronously data fetching.
- **Responsive**: Bootstrap-optimized interface.

## Technologies Used:

- **Backend**: Node.js, Express, Nodemailer
- **Frontend**: AngularJS, HTML, CSS, JavaScript, Bootstrap, jQuery
- **AJAX**: For dynamic data fetching
- **Database**: MySQL
- **Version Control**: Git and GitHub for repository management
- **File Uploads**: Cloudinary for media storage

## Installation

Follow these steps to set up the project locally on your machine:

<b>1. Clone the repository:</b>
   ```bash
   git clone https://github.com/arshnoork-101/GoalSync.git
   ```

<b>2. Navigate to the project directory:</b>
  ```
   cd GoalSync
  ```

<b>3. Install the required dependencies:</b>
  Make sure you have Node.js and npm installed on your machine. 
   ```
   npm install
   ```

<b>4. Configure environment variables:</b>

Create a .env file in the root of the project with your Cloudinary, MySQL, and email configuration:
```
CLOUD_NAME=your_cloud_name_here
API_KEY=your_api_key_here
API_SECRET=your_api_secret_here

MYSQL_HOST=your_mysql_host_here
MYSQL_PORT=your_mysql_port_here
MYSQL_USER=your_mysql_user_here
MYSQL_PASSWORD=your_mysql_password_here
MYSQL_DATABASE=your_mysql_database_here

EMAIL_USER=your_email_here
EMAIL_PASS=your_email_password_here
```

<b>5.To run the server, use the following command:</b>
```
  node myServer.js
```
<b>6. Application will work locally at: </b>
```
  http://localhost:3000
```

## License:
This project is licensed under the MIT License.
