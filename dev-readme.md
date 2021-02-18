# UX CHECKLIST DEV GUIDELINES
---
#### Development tools from https://github.com/una/gulp-starter-env/blob/master/README.md + http-server

## Starter Environment
---

What's set up here:
- http-server
- Sass (LibSass)
- Autoprefixer
- CSS Minification
- Scss Lint (based on [this](https://github.com/causes/scss-lint/blob/master/config/default.yml) config)


## To Get Started:

### Install
1. Install node and make sure npm (Node Package Manager) is also [installed](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm)
2. In terminal, `cd` (change directory) to the folder containing your project.
3. `npm install` or `npm i` to download dependancies

- 3.1 Install Gulp with `npm install gulp -g` - `-g` installs gulp globally on your system - see [Gulp.js](https://gulpjs.com/) - this might be optional
4. open a second terminal window in your working directory

### GULP / build - in terminal 1
5. In the terminal, enter `gulp` to make everything run 

#### What does this do ?
- this will compile SCSS files to CSS - thats all, for more advanced gulp, look at the gulpfile)
- When you change some SCSS, it will automatically create a new CSS file
- *DO NOT* : write in CSS files, write in CSS/ folder, write in dist/ folder
- In the terminal, you will see errors if the SCSS needs correction (closing bracket, parethesis, semicolon...)

### SERVE / http-server - in terminal 2
7. In the terminal 2, enter `http-server` to serve your site (probably at http://localhost:8080)


## DEV Single and Multi projects

### HTML
- index-multi.html
- index-single.html

**To limit confusion: work only in these two files, never in index.html**

On deployment: copy index-multi.html or index-single.html into index.html and push to master

### Styles
There is class `.body-multi` and `.body-single` on `<body>` so you can target styles separately when needed
This Way they can share SCSS/CSS

### JS
Js for Multi goes int js/index.js
Js for Multi goes int js/index-single.js

**The CSS way** :

```

#reset {
    font-size: 1rem
}

.body-multi #reset {
    border: none;
}

.body-single #reset {
    color: red;
}

```

**The SCSS way** :

```
#reset {
	font-size: 1rem;

    .body-single & {
        color: red;
    }

    .body-multi & {
        border: none;
    }
}

```

## Release
Features that have the class '.not-released' are hidden until the class is removed.
This can be done from the html file locally or even directly from github.


---
# LEGACY / GULP infos 
- JSHint
- HTML Minification
- BrowserSync
- Image Minification
- GH-Pages deployment from dist/ folder

4.2. + ``cd node_modules/gulp-gh-pages/ && npm install --save gift@0.10.2`` (this is to enable gulp deploy on gh-pages - OPTIONAL and doesnt work when `master` branch is used on a github user page)

6. Take note of the Access URLs provided in your terminal. Your web page should pop up at `http://localhost:3000`. You can access this same page on your various devices in the same wifi network with the provided External URL. You can share the External URL with coworkers and they'll see whats on your screen.
7. Edit your Sass code inside of the scss folder. You can make subfolders inside of that to better organize your code. Prefix your sass files with an underscore. More info on using @import to organize your files [here](http://sass-guidelin.es/#main-file)
8. Your minified files will be automagically created and updated in `dist/`. It will create your optimized css, html, and javascript files for you. Never edit files within the `dist/` folder. (Dist stands for Distribution)
9. Keep gulp running while you're making changes. When you want to close out of the gulp task, in the terminal, hit `ctrl + C`

## Linting

This linter is the only `ruby` dependency in this project (and it's optional)

File Linting is where you read your file to make sure that your code conforms to standards. You should be doing this continuously.

If you're using a text editor like Sublime, I'd recommend installing `SublimeLinter` and `SublimeLinter-contrib-scss-lint`. You can also lint with gulp inside of your terminal by running `gulp scss-lint`. Similar linters are available for other text editors.

## Deploying to gh-pages

You can run `gulp deploy` to push your site onto the gh-pages branch. Then, you can navigate to it via *http://< your-github-username >.github.io/< project-name >* **Note:** this doesn't work if your project name is *< your-github-username  >.github.io*.

`gulp deploy` might fail at first if you just installed 

``cd node_modules/gulp-gh-pages/
npm install --save gift@0.10.2
cd ../../
gulp deploy
``

## Commonly Confusing Terms

- `cd`: change directory (a terminal command). Make sure you have a space between `cd` and the location you are navigating to
- `repo`: repository (this is a 'repository' of code)
- `sudo`: you get access as a 'super user' of your system (you can override permissions)
- `npm`: node project manager -- the command line task manager that is installing everything inside of `package.json`
- `package.json`: a file with information about your project. This is also where your list of dependencies lives which npm installs
- `gulp`: a [task manager](http://gulpjs.com) that is running a bunch of scripts to make this environment work
- `dist`: distribution folder -- don't edit anything in here. It is where your gulp task builds into
- `scss`: a Sass syntax that imitates CSS
