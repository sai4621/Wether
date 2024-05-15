```markdown
# Whether

Whether is a user-friendly weather application designed to assist users in making informed decisions about their attire based on current and future weather conditions. Whether you're planning a day out or just want to dress appropriately for the week ahead, Whether has got you covered.

## Key Features

- **Customizable City Selection:** Easily choose any city worldwide to view its weather forecast.
- **Forecast for Multiple Days:** Get a glimpse of the weather forecast for multiple days ahead.
- **Clothing Recommendations:** Receive personalized clothing suggestions based on the weather conditions in your selected location.

## Getting Started

To run the Whether app, follow these steps:

### Clone the Repository

Clone the Whether repository to your local machine.

```bash
git clone https://github.com/sai4621/Wether.git
```

### Navigate to the Project Directory

Open two terminals. In one terminal, navigate to the `wether-app` directory.

```bash
cd wether-app
```

### Install Dependencies

Run the following command to install the necessary dependencies.

```bash
npm install
```

### Install Backend Dependencies

In the other terminal, run the following command to install backend dependencies.

```bash
pip install -r requirements.txt
```

### Start the Frontend Development Server

In the same terminal, run the following command to start the frontend development server.

```bash
npm run dev
```

### Activate the Backend Server

In the other terminal, activate the virtual environment using the following command:

```bash
source ./myenv/Scripts/activate
```

### Run the Flask Server

Once the virtual environment is activated, start the Flask backend server.

```bash
flask run
```

If the above command doesn't work, try specifying your Python version:

```bash
python{your version number} -m flask run
```

### Access the App

Open your web browser and navigate to the host provided in the terminal output.

## APIs Used

- **OpenWeatherMap API:** Provides current weather data and 5-day weather forecasts.
- **Unsplash API:** Provides images for clothing recommendations based on the weather conditions.

## Example .env File

Create a `.env` file in the root directory with the following content:

```
FLASK_APP=app
FLASK_ENV=development
OPENWEATHER_API_KEY
UNSPLASH_ACCESS_KEY
```

