import { imageDb } from "./Config";
import { ref, uploadBytes, getDownloadURL, getMetadata, deleteObject} from "firebase/storage";
import { generateHash } from "../../utils/utils";


export async function uploadProfileImg(img, oldUrl){
  const hash = generateHash(img); 
  const filePath = `files/${hash}`; 
  const imgRef = ref(imageDb, filePath);

  const exists = await checkImageExists(filePath);
    if (exists) {
      const downloadURL = await getDownloadURL(imgRef);
      if(downloadURL !== oldUrl) await deleteImageFromFS(oldUrl);
      return downloadURL;
    }

    await uploadBytes(imgRef, img);
    const downloadURL = await getDownloadURL(imgRef);
    return downloadURL;
}

export async function uploadImageToFS(img) {
  try {
    const hash = generateHash(img); 
    const filePath = `files/${hash}`; 
    const imgRef = ref(imageDb, filePath);

    const exists = await checkImageExists(filePath);
    if (exists) {
      const downloadURL = await getDownloadURL(imgRef);
      return downloadURL;
    }

    await uploadBytes(imgRef, img);
    const downloadURL = await getDownloadURL(imgRef);
    return downloadURL;
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    throw error;
  }
}


export async function deleteImageFromFS(filePath) {
  try {
    const fileExists = await checkImageExists(filePath);
    if (!fileExists) {
      console.warn(`File does not exist: ${filePath}`);
      return;
    }
    const fileRef = ref(imageDb, filePath); 
    await deleteObject(fileRef);
    console.log(`Deleted file: ${filePath}`);
  } catch (error) {
    if (error.code === "storage/object-not-found") {
      console.error("File not found:", filePath);
    } else {
      console.error("Error deleting file:", error);
    }
    throw error;
  }
}


const checkImageExists = async (filePath) => {
  try {
    const fileRef = ref(imageDb, filePath);
    const metadata = await getMetadata(fileRef);
    console.log("File exists:", metadata);
    return true;
  } catch (error) {
    if (error.code === "storage/object-not-found") {
      return false;
    } else {
      console.error("Error checking file existence:", error);
    }
  }
}