import {v2 as cloudinary} from "cloudinary"
import { response } from "express";
import fs from "fs"


 
          
cloudinary.config({ 
  cloud_name: 'process.envCLOUDNIARY_CLOUD_NAME', 
  api_key: 'process.env.CLOUDNIARY_API_KEY', 
  api_secret: 'process.env.CLOUDNIARY_API_SECRET' 
});

const uploadOnCloudinary=async()=>{
    try{
      if(!localFilePath) return null
      cloudinary.uploader.upload(localFilePath, {
        resource_type:"auto"
      })
      //file has been uploaded succesfully
      console.log("file uploded succesfully",response.url);
      return response;

    }
    catch(err){
      fs.unlinkSync(localFilePath)  //remove the locally saved tempory file as the uploaded operation got failed
      return null
    }
}

cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });

  export {uploadOnCloudinary}