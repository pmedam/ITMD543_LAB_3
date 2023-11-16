const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var bodyParser = require('body-parser')

const app = express();
const port = 3000;
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('view engine', 'ejs');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
app.use(express.static('public'));

app.get('/', (req, res) => {
  const files = fs.readdirSync('uploads');
  res.render('index', { files });
});

//uploads the files
app.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/');
})



app.get('/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join('uploads', fileName);

  res.download(filePath, fileName, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
  });
});



app.post('/delete', urlencodedParser, (req, res) => {
  const fileName = req.body.fileName;
  const filePath = path.join('uploads', fileName);
  fs.unlinkSync(filePath)
    res.redirect('/');
});

// Serve HTML file using EJS template
app.get('/', (req, res) => {
  res.redirect('/files');
});

//download the file

// app.get('/download/:filename', (req, res) => {
//   const fileName = req.params.filename;
//   const filePath = path.join(__dirname, 'uploads', fileName);

//   // Check if the file exists
//   if (fs.existsSync(filePath)) {
//     // Set appropriate headers for the response
//     res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
//     res.setHeader('Content-type', 'application/octet-stream');

//     // Create a read stream from the file and pipe it to the response
//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);

//     // Handle errors during the streaming
//     fileStream.on('error', (err) => {
//       console.error('Error streaming file:', err);
//       res.status(500).send('Internal Server Error');
//     });
//   } else {
//     // If the file doesn't exist, send a 404 response
//     res.status(404).send('File not found');
//   }
// });


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});