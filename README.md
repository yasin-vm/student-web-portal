# Student Web Portal

## Add Your Webpage

1. Use your **roll number**, not your registration number.
2. Create a folder inside `submissions`.
3. Put your main file inside the folder and name it `index.html`.

Example for roll number `01`:

```text
submissions/01/index.html
submissions/01/css/styles.css
submissions/01/js/main.js
submissions/01/images/photo.jpg
```

Use these paths in `index.html`:

```html
<link rel="stylesheet" href="css/styles.css">
<script src="js/main.js" defer></script>
<img src="images/photo.jpg" alt="Your name">
```

Do not use paths starting with `/`. Do not change another student's folder.

## Add The Link

Tell Yasin your roll number and send your complete folder. The portal owner will update `js/students.js` like this:

```javascript
websiteSubmitted: true,
websitePath: 'submissions/01/index.html'
```

## Test Your Page

From the project folder, run:

```powershell
npm install
npm run dev
```

Open your page:

```text
http://127.0.0.1:3000/submissions/01/
```

The website is static, so your files must be added to GitHub. There is no online upload button.
