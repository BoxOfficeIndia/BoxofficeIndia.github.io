
/*background watermark*/
// var textWatermark = 'TrackBO';
// var body = document.getElementsByTagName('body')[0];
// var background = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='100px' width='100px'>" +
// "<text transform='translate(20, 100) rotate(-30)' fill='rgba(128,128,128, 0.3)' font-size='20' >" + textWatermark + "</text></svg>\")";
// body.style.backgroundImage = background

/*background watermark*/
var textWatermark = 'TrackBO';
var fullTextWatermark = '';
var n = 1000;
for (var i = 0; i < n; i++) {
    fullTextWatermark+= ' ' + textWatermark;
}
wm_elem = document.createElement("p")
wm_elem.setAttribute("id","watermark")
wm_elem.innerHTML= fullTextWatermark
document.body.appendChild(wm_elem)
//document.getElementById('watermark').innerHTML = fullTextWatermark

nav_elems = `<a href="/">Home</a>
		<a href="/livesales">Live Advance Sales</a>
		<a href="/livetracking">Live Collection Tracking</a>
		<a href="/collections">Collection Reports</a>
		<a href="/collections">Boxoffice Records</a>   
		<a href="/advancesales">Advance Sales Reports</a>
		<a href="/OSadvancesales">Overseas Advance Sales</a>
		<a href="/blogs-articles/index.html">News</a>
		<a href="/gallery/index.html">Gallery</a>
		<a href="/site data/about.html">About Us</a>
`
function openNav() {
    document.getElementById("topnav").style.width = "250px";
}

function closeNav() {
    document.getElementById("topnav").style.width = "0";
}
if (window.matchMedia("(max-width: 700px)").matches) {
    console.log(window.matchMedia("(max-width: 700px)").matches)
    // Viewport is less or equal to 700 pixels wide
    div_elem = document.getElementById("topnav");
    div_elem.innerHTML = `
    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>` + nav_elems
    span_elem = document.getElementById("navpoint")
    span_elem.innerHTML = `&#9776;` 
} 
else
{
    console.log(window.matchMedia("(max-width: 700px)").matches)
    div_elem = document.getElementById("topnav");
    div_elem.innerHTML = nav_elems;
    // Viewport is greater than 700 pixels wide
    span_elem = document.getElementById("navpoint")
    span_elem.innerHTML = '';
    
}

let slideIndex = 0;
function showSlides() 
{
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " active";
    setTimeout(showSlides, 5000); // Change image every 5 seconds
}
  
function slides_disp()
{
    var imageUrls = [
        'images/slideshow-images/avatar-2.jpeg',
        /*'images/slideshow-images/18pages.png',
        'images/slideshow-images/cirkus.JPG',
        'images/slideshow-images/connect.jpg',
        'images/slideshow-images/dhamaka.jpg',
        'images/slideshow-images/kaapa.png',
        'images/slideshow-images/laththi.JPG',
        'images/slideshow-images/vedha.JPG',*/   
    ];
    var body = document.getElementById('homepage_body');
    var tot_height = document.body.clientHeight * 0.25;
    var tot_width = document.body.clientWidth * 0.8;
    body.setAttribute("height", tot_height);
    body.setAttribute("width", tot_width);

    var elem = document.createElement('div'); //slides1
    body.appendChild(elem);
    elem.className = "slideshow-container";
    
    var dot_div = document.createElement('div');
    body.appendChild(dot_div);
    dot_div.style.position = 'absolute';
    dot_div.style.left = '45%';
    //dot_div.style.paddingBottom = '15%';
    var dots_div = document.createElement('div'); //dots_div
    dot_div.appendChild(dots_div);
    //elem.className = "slideshow-container";
    for (imgurl of imageUrls)
    {
        //console.log(imgurl)
        var elem1 = document.createElement('div'); //'slides11'
        elem.appendChild(elem1);
        elem1.className = "mySlides" ;
        elem1.className += " fade";
        var sl_img = document.createElement("IMG"); // images div
        sl_img.src = imgurl; 

        //var div_height = document.getElementById('homepage_body').clientHeight;
        var div_height = (document.getElementById('homepage_body').clientHeight) * 0.5;
        var div_width = (document.getElementById('homepage_body').clientWidth)*0.9 ;
        img_height = div_height.toString() + 'px';
        img_width  = div_width.toString() + 'px';
        console.log(div_height,div_width);
        console.log(img_height,img_width);
        sl_img.setAttribute("height", img_height);
        sl_img.setAttribute("width", img_width);
        //sl_img.setAttribute("object-fit", "contain");
        sl_img.setAttribute("alt", imgurl);
        elem1.appendChild(sl_img);
        var elem2 = document.createElement('span');
        dots_div.appendChild(elem2);
        elem2.className = 'dot';
        //break
    }
    /*
    //Next and previous buttons -->
    var a_tag = document.createElement('a');
    elem.appendChild(a_tag);
    a_tag.className = "prev";
    a_tag.onclick = plusSlides(-1);
    var a_tag = document.createElement('a');
    elem.appendChild(a_tag);
    a_tag.className = "next";
    a_tag.onclick = plusSlides(+1);
    //<a class="prev" onclick="plusSlides(-1)">&#10094;</a>
    //<a class="next" onclick="plusSlides(1)">&#10095;</a>
    */
    //<br>

    showSlides()
}

// Next/previous controls
/*function plusSlides(n) {
    showSlides(slideIndex += n);
}
  
// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}*/
/*
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}*/

function img_disp()
{
    var body = document.getElementById('homepage_body');
    var sl_img = document.createElement("IMG"); // images div
    sl_img.src = "/images/slideshow-images/photo-output.JPG";
    //var div_height = document.getElementById('homepage_body').clientHeight;
    var div_height = document.body.clientHeight / 1.5;
    var div_width = document.getElementById('homepage_body').clientWidth * 0.8;
    img_height = div_height.toString() + 'px';
    img_width  = div_width.toString() + 'px';
    console.log(div_height,div_width)
    console.log(img_height,img_width)
    sl_img.setAttribute("height", img_height);
    sl_img.setAttribute("width", img_width); 
    sl_img.setAttribute("max_width", '100%');
    body.appendChild(sl_img);
}

