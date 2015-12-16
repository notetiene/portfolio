#Udacity Portfolio

Udacity nanodegree project #1: Portfolio The project #1 of Udacity Front-End Web Developer Nanodegree is a portfolio to be done from a PDF mockup.
##Requirements

* Gulp:
  * gulp-sass
  * gulp-concat
  * gulp-uglify
  * gulp-minify-css
  * gulp-uncss
  * gulp-shorthand
  * gulp-htmlclean
  * gulp-autoprefixer
  * gulp-imagemin
  * gulp-responsive
  * gulp-sync
  * gulp-clean
  * gulp-selectors
  * gulp-filesize

* NodeJS
  * critical
  * js-beautify (optional for text-editing)
  * tern (optional for error checking)

* Gem
  * sass
  * scss_lint (optional for linting)

* CPAN
  * CSS::Watcher (optional for text-editing)

## Building
The building process consist of Gulp tasks. To simply make a distribution:

    gulp dist

To build the project without optimizations & images:

    gulp [build]

To build the images:

    gulp img

To build automatically when SCSS/HTML are modified:

    gulp watch

## Text-editor
This project was edited with emacs, but any text-editor should work. There are some emacs variables in .dir-locals that are useful, but not necessary. Modes used:
[SCSS-mode](https://github.com/antonj/scss-mode)
[web-mode](http://web-mode.org)
[web-beautify](https://github.com/yasuyk/web-beautify)
[company-web](https://github.com/osv/company-web)
[company-tern](https://github.com/proofit404/company-tern)
[ac-html-csswatcher](https://github.com/osv/ac-html-csswatcher)
[emmet-mode](https://github.com/smihica/emmet-mode)
[skewer-mode](https://github.com/skeeto/skewer-mode)
[js2-mode](https://github.com/mooz/js2-mode)
[tern-mode](https://github.com/ternjs/tern)
[company-tern](https://github.com/proofit404/company-tern)
[rainbow-mode](https://github.com/emacsmirror/rainbow-mode)
[flycheck](http://www.flycheck.org)
[css-eldoc](https://github.com/zenozeng/css-eldoc)
[smartparens](https://github.com/Fuco1/smartparens)
