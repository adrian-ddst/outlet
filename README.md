# outlet
A personal project representing a fashion smart store

# MongoDB Cluster
    user: adriantepsan
    pass: YTIWB6bTZUvrsEkq

# Database User
    user: adrian
    pass: admin

# Initial res
    1920 x 937 

# Test on how to upload images to Cloudinary (nodejs) ...
 *[ imageUrl ] este url-ul imaginii (poate fi blob)
 *[ {} ] e parametrul "options" al functiei de upload
 *[ public_id ] este numele imaginii in cloudinary (va trebui sa fie unic)
 *[ folder ] este numele folderului in care il pune, o sa pastram "outlet-clothes-images"
 *[ secureUrl ] va fi url-ul la care se gaseste imaginea... va trebui pus in db pe product

const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg";
const upload = cloudinary.uploader.upload(req.body.image, { public_id: req.body.image.slice(-10), folder: "outlet-clothes-images" });
var secureUrl = '';
upload.then((data) => {
    if (data?.secure_url) {
        secureUrl = data.secure_url;
        console.log("Image upload was successful ... URL: " + secureUrl);
    }
}).catch((err) => {
    console.log("Image upload has failed ... error: ", err);
});;
