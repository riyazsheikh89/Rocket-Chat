# How to set up the project on your local machine:

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## STEP 1 : (Clone the project)
Clone the project to your local machine using <br>
`git clone https://github.com/riyazsheikh89/Rocket-Chat.git`

## STEP 2 : (Install dependencies)
Install all the dependencies for the backend and frontend. To do that run the below commands <br/> 
For Backend dependencies: `npm install` in your root directory. <br>
For Frontend dependencies: `cd frontend` then run `npm install` <br>
If you get any version-related error while installing Frontend dependencies try this command `npm install --force`

## STEP 3 : (Setup .env variables)
Setup the environmental variables inside `.env` file. Create the `.env` file inside your project's root directory and make sure that this file should be located in your root directory otherwise, you may face some issues with accessing the env variables. After creating the `.env` file put the below-mentioned variables as it is, do not change any variable name, otherwise, you have to change all occurrence of the variable throughout the project.
### .env variables: 
- PORT=<your_port_number>
- MONGODB_URI=<your_mongodb_url>
- JWT_SECRET=<your_secrect_key>
- NODE_ENV=PRODUCTION
- CORS_ORGIN="http://localhost:3000"

### setup config.js
for setting up config.js file go to `cd frontend/src/config/config.js` and change the ENDPOINT acoordingly. For example if your backend is running on "https://localhost:5000", mention it to ENDPOINT.

## STEP 4 : (Run the project)
you can run the project in 2 ways, either in PRODUCTION MODE where your Backend and Frontend will run on the same port, or in DEVELOPMENT MODE where Frontend and Backend will run in different PORT and you have to run both Frontend and Backend simultaneously. <br>
Now, how to do that?

### Run in DEVELOPMENT MODE :
Start the Backend from the root directory : `npm start` <br>
Start the frontend: `cd frontend` then run `npm start` now you are good to go. Your backend will run on the mentioned port and the react frontend will run on port 3000

### Run in PRODUCTION MODE :
To start your project in PRODUCTION MODE first of all you have to `build` your react project that will eventually convert your react code to plain HTML, CSS, JS code, and these files will reside inside the `/build` folder. And now you have to somehow serve these static files from your Backend code. You don't have to write any code right now, everything is written inside the backend `index.js` file.<br>
Now how to do that? first of all, go to the frontend directory `cd frontend` and then run `npm run build` command, to build your react project to PRODUCTION build. Now from your root directory run `npm start` this command. It will run your procees on the mentioned port.
<br>
<br>
NOTE: for running your project in PRODUCTION MODE you have to make sure that `NODE_ENV=PRODUCTION` is set correctly.
