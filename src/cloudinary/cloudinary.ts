import {v2 as cloudinary} from 'cloudinary'
import { configDotenv } from 'dotenv';

configDotenv({path : './config.env'})


//CONFIGURATION OF CLOUDINARY USING THE REQUIRED CREDENTIAL
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUD_NAME} = process.env


cloudinary.config({
    secure: true,
    cloud_name: CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

export default cloudinary 