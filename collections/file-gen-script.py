#REfs
#sitemap / directory tree generator : https://stackoverflow.com/questions/9727673/list-directory-tree-structure-in-python
#https://code.activestate.com/recipes/577879-create-a-nested-dictionary-from-oswalk/
#https://stackoverflow.com/questions/66487678/how-to-create-a-nested-dictionary-for-storing-directory-structure-in-python
#https://code.activestate.com/recipes/577879-create-a-nested-dictionary-from-oswalk/
#https://stackoverflow.com/questions/67092524/display-html-list-from-nested-python-dictionary
#https://pythonexamples.org/python-check-if-path-is-file-or-directory/
# expanding , contracting , clickable nested lists : https://web.cs.dal.ca/~jamie/CS4173/examples/JS/nested_lists/Nestedlists.html#cite

import os 
#from bs4 import BeautifulSoup
import bs4, sys
import timeit 
import pprint 
import functools
from functools import reduce
start_time = timeit.default_timer()

img_card_cnt=10
html_file = 'index.html'
curr_folder = '/collections'
##page specific
page_origin = "https://boxofficeindia.github.io"
page_url = page_origin + curr_folder
page_title = "Box Office Pan India - Collection Reports"
page_desc = "All language Movies Collection Reports"
img_url = '/images/home-page.jpg'
twit_img_url = page_origin + img_url


root_dir = "/home/adarsh/Desktop/collection-tracker (bms,paytm)/0_website/BoxofficeIndia.github.io/"
ignore_files = ['test.html' , 'del.html' , 'template.html' , 'index.html', 'index-old.html']
ignore_files += ['pongal2023.html' , 'sankranthi2023.html']

directory_list = [ 'collections'] # , 'livetracking']

dirs_map = { 'collections':'Box Office Reports' , 
'livetracking' : 'Live Hourly Gross - India' , }

#links_html = '<div id="columns_div">'
#links_html += '<div id ="advance_sales" class="columns" >'
links_html = '<div class="home_row">'
### left side - generate blog cards (5-10)
for dirs in directory_list:
    links_html += '<div class="home_column">'
    dir_path = root_dir +  dirs + '/'
    print(dir_path)
    link_string = '''<p style="font-size:20px; font-weight:bold; text-align:center">  ''' + dirs_map[dirs]   + ''' </p>'''
    links_html += link_string
    dir_files = []
    for path, subdirs, files in os.walk(dir_path):
        #print(path, subdirs, files )
        rel_dir = os.path.relpath(path, root_dir)
        files1 = [os.path.join(rel_dir, os.path.basename(ff)) for ff in files]
        #files1 = [dir_path + ff for ff in files]
        dir_files = dir_files + files1
        #files1.sort(key=lambda x: os.path.getmtime(x) , reverse=True)
        #print(files1 , end='\n-----\n')

    print("file count:",len(dir_files))
    dir_files.sort(key=lambda x: os.path.getmtime(x) , reverse=True)
    ci = 0
    for rel_file1 in dir_files:
        name = os.path.basename(rel_file1)
        cond = name.endswith(('html'))
        if cond == False:
            continue
        if name in ignore_files:
            continue
        file_path =  rel_file1
        #print(file_path , rel_file1)

        with open(file_path, 'r') as f:
            webpage = f.read()#.decode('utf-8')
        soup = bs4.BeautifulSoup(webpage, 'lxml')
        #title
        try:
            title = soup.find("title").string
        except Exception as e:
            title=rel_file1 #''
            #print('title',e)
        if title == 'Box Office India - Pan India collection reports':
            #continue
            try:
                p_head = soup.find(id="p_heading")
                title = p_head.getText()
            except:
                #print('p_heading error',p_head , rel_file1)
                #title = 'Collection reports - Box Office Pan India'
                title = name.replace('.html','')
        title = (title.replace("- Box Office Pan India","")).strip()
        title = (title.replace("- @Box_OfficeTrack","")).strip()
        #image
        images = soup.findAll('img')
        try:
            image_src = images[0]['src'].strip()
            #print('--src ' , image_src)
        except Exception as e:
            image_src = '/images/image-1.png'
            #print('image',e)
            #continue 
        #print(title , '->' , rel_file)

        link_image = '''<div class="card_image"> <a href="/''' + rel_file1 + ''' ">
        <img style="border: 1px solid black;" src="''' + image_src + '''"
            alt="summary card" width="97%" height="150px">
        </a></div>\n''' 
        #width="300" height="250" #padding-left:5%;padding-right:5%
        link_string = '''<p style="text-align:center;"> 
            <a href="/''' + rel_file1 + '''">''' + title  + '''</a></p>\n''' #👉
        links_html += '<div class="card_box">' + link_image + link_string + '</div> \n'
        
        ci += 1
        if ci>=img_card_cnt:
            break

    links_html += '</div>'

##natural sort
import re
def atoi(text):
    return int(text) if text.isdigit() else text
def natural_keys(text):
    return [ atoi(c) for c in re.split(r'(\d+)', text) ]

### right side - generate nested list with clickable drops
dir_path  = root_dir +  dirs + '/' #print(dir_path)
## first generate tree directory -> nested dictionary form
dir = {}
rootdir = dir_path.rstrip(os.sep)
start = rootdir.rfind(os.sep) + 1
for path, dirs, files in os.walk(rootdir):
    dirs.sort(key=natural_keys)
    folders = path[start:].split(os.sep)
    #print('folders', folders , type(folders))
    rel_dir = os.path.relpath(path, root_dir)
    #files1 = [os.path.join(rel_dir, os.path.basename(ff)) for ff in files]
    files.sort(key=natural_keys)
    files1 = []
    for ff in files:
        #print(ff) #name of file
        cond = ff.endswith(('.html'))
        if cond == False:
            continue
        if ff in ignore_files:
            continue
        file_path = os.path.join(rel_dir, os.path.basename(ff)) 

        with open(file_path, 'r') as f:
            webpage = f.read()#.decode('utf-8')
        soup = bs4.BeautifulSoup(webpage, 'lxml')
        #title
        try:
            title = soup.find("title").string
        except Exception as e:
            title=ff #'' #name
            #print('title',e)
        if title == 'Box Office India - Pan India collection reports':
            title=ff
        title = (title.replace("- Box Office Pan India","")).strip()
        link_str = '''<a href="/''' + file_path + '''">''' + title  + '''</a>\n'''
        files1.append(link_str)
    subdir = dict.fromkeys(files1)
    parent = reduce(dict.get, folders[:-1], dir)
    parent[folders[-1]] = subdir
#pprint.pprint(dir)


## html style & srcipt for clickable nested list
nested_list_style_script = '''
<style type="text/css">
    .home_column a img   { border: 0;}
    .home_column span.ex  { background-color:#9f9 }
    .home_column li{ list-style-type: none; padding-top: .2em; padding-bottom: .2em; }
    .open   { display: block; }
    .closed { display: none;  }   
</style>
<script type="text/javascript">
    function toggle(id){
      ul = "ul_" + id;
      img = "img_" + id;
      ulElement  = document.getElementById(ul);
      imgElement = document.getElementById(img);
      if (ulElement){
        if (ulElement.className == 'closed'){
           ulElement.className = "open";
           imgElement.src = "/images/assets/opened.gif";
        } else {
           ulElement.className = "closed";
           //imgElement.src = "/images/assets/closed.gif";
           imgElement.src = "/images/assets/opened.gif";
        }
      }
    } // toggle()
</script>
'''

links_html += '<div class="home_column">'
link_string = '''<p style="font-size:20px; font-weight:bold; text-align:center">  ''' + "Full list"   + ''' </p>'''
links_html += link_string

## function to convert dict to clickable nested list
li_i = 0
ul_i = 0
def nested_html(d, c = 0, f_path='/'):
   for a, b in d.items():
        global li_i
        li_i += 1
        li_id = 'li'+ str(li_i)
        ul_id = 'ul_' + li_id
        img_id = 'img_' + li_id
        if li_i <=1 :
            class_name = 'open'
        else:
            class_name = 'closed'
        
        li_id1 = "'" + li_id + "'"
        li1 = '''<li id="''' + li_id + '''"><a onclick="toggle(''' + li_id1 + ''');
            " onkeypress="toggle(''' + li_id1 +''');"><img src="/images/assets/opened.gif" alt=""
            id="''' + img_id + '''"style="height:2ex;width:2ex"></a> ''' 
        
        
        #isFile = os.path.isfile(fpath) #checks if path is a file
        #isDirectory = os.path.isdir(fpath) #checks if path is a directory
        if 'href' in a:
            li1 = '<li> 👉 '  
        else:
            a = a.title()
            a = '<text style="font-size:17px; color:#de1738; font-weight:bold;">' + a +'</a>'
        #print(a,b) #a=key/dirname #b=dictionary/filename

        yield '{}{}{}</li>'.format('   '*c,li1, a)
        if isinstance(b, dict): 
            ul1 = '<ul id="' + ul_id + '" class="' + class_name + '">'
            yield '{}{}\n{}\n{}</ul>'.format('   '*c,ul1, "\n".join(nested_html(b, c + 1)), '   '*c)

##call function
#print('\n'.join(nested_html(dir)))
val = '\n'.join(nested_html(dir))
ne_init = '\n<ul  class="open">\n' #1st elem
nested_li =  nested_list_style_script + ne_init + val
links_html += nested_li +'\n</div>'


## end
links_html += '</div>'
##ads
links_html += ''' <!-- ads -->
<div id="container-eb11d11fa1fb3730ecf9912917e6e437"></div> ''' #ads
links_html += '</div>'


init_html1 = '''<!DOCTYPE html>
<html lang="en">
<head>
    <script async="async" data-cfasync="false" src="//pl18303822.highcpmrevenuenetwork.com/eb11d11fa1fb3730ecf9912917e6e437/invoke.js"></script>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-BYC2HYBLXT"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-BYC2HYBLXT');
    </script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1827849686137071"
    crossorigin="anonymous"></script>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Box Office Pan India - Indian Boxoffice collection reports</title>
    <meta name="description" content="Box office Pan India or boxofficeindia.github.io is a webiste which gives
    Indian movies boxoffice collection reports, gross, share, nett, advance sales bookings,
     overseas hourly gross etc for PanIndia movies & in telugu, tamil, hindi, malayalam, kannada, 
     Tollywood, Kollywood, Bollywood, Hollywood">
    <meta name="keywords" content="Boxoffice, PanIndia, collection,gross, share, nett, advance sales, 
        bookings, overseas, movies, Tollywood, Kollywood, Bollywood, Hollywood">
	<link rel="icon" type="image/x-icon" href="/images/icon-1.ico">
	<link rel="stylesheet" href="/style.css">
	<script src = "/script.js"></script>
	<script async src="https://platform.twitter.com/widgets.js" charset="utf-8">
	</script>

'''

twitter_html = '''<!-- Open Graph / Facebook --> <!-- this is what Facebook and other social websites will draw on -->
      <meta property="og:type" content="website">
      <meta property="og:url" content="''' + page_url + '''">
      <meta property="og:title" content=" ''' + page_title + '''">
      <meta property="og:description" content=" ''' + page_desc  + '''">
      <meta property="og:image" content="''' + twit_img_url + '''">

    <!-- Twitter --> <!-- You can have different summary for Twitter! -->
      <meta property="twitter:card" content="summary_large_image">
      <meta property="twitter:site" content="@Box_OfficeTrack">
      <meta property="twitter:title" content=" ''' + page_title + '''">
      <meta property="twitter:description" content=" ''' + page_desc  + '''">
      <meta property="twitter:image" content="''' + twit_img_url + '''"></meta>
'''

init_html2 = '''
<!-- ads -->
      <!-- <script type="text/javascript" data-cfasync="false">
        /*<![CDATA[/* */
        (function(){var d051070a449e55704821048156efd875="EbOHnoeVme0Y9Zb5eM2TZe2GJLia4JD3t6sCJQG6mIaGVIKeDqZwFyQeMgMmTKdUp_xT7oVRfay5qNg";var a=['w7w2wrvDtMOqwovDoMO9w6c8w5HDpw==','wqfDusORwqnCicO7w6vCvSPCr8KnY3c=','R256IMOPw48J','bRlfwrnCmw==','FjvCncOfUsO4EgVuMDjCh0bCtsOC','LsKdworDjTzCpw==','wpZZYsOtXMOcwpI=','P0JB','ZxYGw6LCnQg7w6ckw74TwqHCtSEaahDDisOJZcKAwrXCjcObO8O2Z8KGwq5S','wroSb8K5','w40xw6tcNjw8w5c=','w4Eqw7xZKGN9wow=','OMOvw6VswoPCscOzTQ==','w55lw4jDm1DCqMO7w4XCusORKw==','PS7CisOb','w6HDnmXDr8K9wrJbLBXCtSDDqQ==','JMKRwpDDijnCpjbDi8O3w58Zw6NzawzCn37CmcK8Ng==','w450w5XDgVPCkw==','LWQMb8OLcXnDimzDrw==','AMKNaMOhwrvCsUvDsmEedjEfw6o=','wrDDvMOFwqHCjMOj','PsKcScKTPiV3wqcswo1oY8K1','w7HCgnjDuMK9wqpbGU3DuXTDuMKSPGhhwpRmwqMrScKrJn1Xw7oZw6fCi8OiEcKGHE/Cglx1EMKiw5p6','wr0Ca8K5wr/DlQ==','wpJuwqTDjcK6woHCvMKQWsOiwqbCiA==','FsK0wqDCuMOPJTU2woYGS2TCnH3CrXBnUk/DnkvCpEY=','w7zDhCbCh8OEwoogw5psDsKZYMOXw47DscOmRsKBw6nCisOMwqMRKUt1S8Odw70SYcK+w7Q=','wppuwrjDhsKxwpjCkcKATw=='];(function(b,c){var e=function(g){while(--g){b['push'](b['shift']());}};e(++c);}(a,0x143));var c=function(b,d){b=b-0x0;var e=a[b];if(c['jthRIj']===undefined){(function(){var h=function(){var k;try{k=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(l){k=window;}return k;};var i=h();var j='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';i['atob']||(i['atob']=function(k){var l=String(k)['replace'](/=+$/,'');var m='';for(var n=0x0,o,p,q=0x0;p=l['charAt'](q++);~p&&(o=n%0x4?o*0x40+p:p,n++%0x4)?m+=String['fromCharCode'](0xff&o>>(-0x2*n&0x6)):0x0){p=j['indexOf'](p);}return m;});}());var g=function(h,l){var m=[],n=0x0,o,p='',q='';h=atob(h);for(var t=0x0,u=h['length'];t<u;t++){q+='%'+('00'+h['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);}h=decodeURIComponent(q);var r;for(r=0x0;r<0x100;r++){m[r]=r;}for(r=0x0;r<0x100;r++){n=(n+m[r]+l['charCodeAt'](r%l['length']))%0x100;o=m[r];m[r]=m[n];m[n]=o;}r=0x0;n=0x0;for(var v=0x0;v<h['length'];v++){r=(r+0x1)%0x100;n=(n+m[r])%0x100;o=m[r];m[r]=m[n];m[n]=o;p+=String['fromCharCode'](h['charCodeAt'](v)^m[(m[r]+m[n])%0x100]);}return p;};c['Yhaknr']=g;c['QBEDHO']={};c['jthRIj']=!![];}var f=c['QBEDHO'][b];if(f===undefined){if(c['JmfYui']===undefined){c['JmfYui']=!![];}e=c['Yhaknr'](e,d);c['QBEDHO'][b]=e;}else{e=f;}return e;};var h=window;h[c('0x1b','hxxD')]=[[c('0x8',']g4P'),0x4b3c75],[c('0x12','SSs3'),0x0],[c('0x4','44I*'),'0'],[c('0xd','d3OX'),0x0],[c('0x13','FFyz'),![]],[c('0xe','*Li6'),0x0],[c('0x0','XNCb'),!0x0]];var n=[c('0xb','Wa@r'),c('0x7','XNCb'),c('0xa','hi4f'),c('0x15','dXl2')],g=0x0,e,b=function(){if(!n[g])return;e=h[c('0x19','czpj')][c('0x6','[bYi')](c('0x2','HOo^'));e[c('0x16',']g4P')]=c('0x11','hxxD');e[c('0x10','ZA$(')]=!0x0;var d=h[c('0x18','Dmek')][c('0x1','SSs3')](c('0x5','*Li6'))[0x0];e[c('0x14','JDdB')]=c('0x17','Dmek')+n[g];e[c('0x1a','HOo^')]=c('0xc','!Uf5');e[c('0xf','Kc0(')]=function(){g++;b();};d[c('0x3','&S3x')][c('0x9','!Uf5')](e,d);};b();})();
        /*]]>/* */
        </script> -->
      <!--  <script type='text/javascript' src='//pl18307261.highcpmrevenuenetwork.com/75/64/12/756412c23972a1bf037da9928e3f9641.js'></script>
        -->

</head>
<body>
    <div id = "heading">
        <img style="display:inline-block; height: 20px; width:auto; 
            transform:translate(0, 0.1em)" src="/images/image-1.png" alt="">
        <h1>Box Office Pan India</h1>
        <!--<div id = "heading">Box Office Pan India</div>-->
        &nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://twitter.com/Box_OfficeTrack?ref_src=twsrc%5Etfw" 
            class="twitter-follow-button" data-show-count="false">Follow @Box_OfficeTrack</a>
    </div>

    <div id = "nav_cont">
        <div id ="topnav"></div>
        <!--<span id ="navpoint" style="font-size:30px;cursor:pointer" onclick="openNav()">&#9776;</span>-->
        <span id ="navpoint" style="font-size:30px;cursor:pointer" onclick="openNav()"></span>
    </div>
    
    <br>
    
    <!-- ads -->
    <script type="text/javascript">
        atOptions = {
            'key' : '867ef927c5e45204a7873d72b610119b',
            'format' : 'iframe',
            'height' : 60,
            'width' : 468,
            'params' : {}
        };
        document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://www.effectivecreativeformat.com/867ef927c5e45204a7873d72b610119b/invoke.js"></scr' + 'ipt>');
    </script>
'''

init_html = init_html1 + twitter_html + init_html2 

home_body = '''<div id = "homepage_body">
        <!--<img src = "/images/slideshow-images/photo-output.JPG" style=" padding: 0;  display: block; 
                height: 300px; width: 300px;"
        >-->
        <img src="''' + img_url + '''" alt=" Poster" style="width:100%;height:200px;">
        <p style="margin-top:2px;text-align:center;color:orange;font-weight:bold;">
            This Month Releases</p>
        <script>
                let a = 0;
                //img_disp();
                //slides_disp();
        </script>
    </div>
       
        <div id="container-eb11d11fa1fb3730ecf9912917e6e437"></div>
''' 
end_html = '''    
    <footer id="about"  > 
        <div id="about1">
            Copyright © 2022 Box Office Pan India
        </div>

        <div id="about1">
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            <!--<button onclick = "window.open('https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=boxofficetrackindia@gmail.com', '_blank');return false;"> Email
            </button>-->
            <a href="https://twitter.com/Box_OfficeTrack?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">Follow @Box_OfficeTrack</a>
            
        </div>
        
        <div id="about2">
            <a href="/site data/about.html">About Us</a> &nbsp;|&nbsp; 
            <a href="/site data/disclaimer.html">Disclaimer</a> &nbsp;|&nbsp; 
            <a href="/site data/privacy-policy.html">Privacy Policy</a> &nbsp; |&nbsp;
            <a href = "https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=boxofficetrackindia@gmail.com" target="_blank" rel="noreferrer noopener"> 
                Contact Us </a>
        </div>
        
    </footer>
</body>

<script>
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
</script>
</html>'''

grid_style = '''<style>
    /* Create 2 columns that floats next to each other */
    .home_column {
        /*float: left;
        width: 33.33%;*/
        flex: 50%;
        padding: 3%;
        /*margin: auto;
        width:50%;*/
    }

    .home_row {
        display: flex;
        flex-wrap: wrap;
        padding: 0 4px;
    }
    
    /* Clear floats after the columns */
    .home_row:after {
        content: "";
        display: table;
        clear: both;
    }
    
    /* Responsive layout - makes the three columns stack on top of each other instead of next to each other */
    @media screen and (max-width: 600px) {
        .home_column {
        width: 100%;
        }
    }

    .card_box{
        border: 0.5px solid #D3D3D3;
        margin: 8px;
    }
    .card_image{
        border: 0px solid black;
        margin-top: 8px;
        vertical-align: middle;
        padding-left: 3%;
        padding-right:2%;
    }
</style>

'''


full_html = init_html + home_body +  grid_style + links_html + end_html

html_file = root_dir + curr_folder[1:] + '/' + html_file 
open(html_file, "w").close()
with open(html_file, "w") as text_file:
    text_file.write(full_html)
print("saved @ " , html_file)
end_time = timeit.default_timer() - start_time
print('Homepage script -> timetaken:' , end_time , 'seconds')

#ref
# three column layout - https://www.w3schools.com/howto/howto_css_three_columns.asp
#https://stackoverflow.com/questions/8384737/extract-file-name-from-path-no-matter-what-the-os-path-format
#https://stackoverflow.com/questions/168409/how-do-you-get-a-directory-listing-sorted-by-creation-date-in-python
#https://www.w3schools.com/howto/howto_js_image_grid.asp
#https://stackoverflow.com/questions/58266029/redirect-to-another-page-by-clicking-image

#html link href + title function
def href_title(name):
    #name = os.path.basename(rel_file1)
    cond = name.endswith(('html'))
    if cond == False:
        return 'null'
    if name in ignore_files:
        return 'null'
    file_path =  rel_file1
    #print(file_path , rel_file1)

    with open(file_path, 'r') as f:
        webpage = f.read()#.decode('utf-8')
    soup = bs4.BeautifulSoup(webpage, 'lxml')
    #title
    try:
        title = soup.find("title").string
    except Exception as e:
        title = rel_file1 #''
        #print('title',e)
    title = (title.replace("- Box Office Pan India","")).strip()
    
    #print(title , '->' , rel_file)
    
'''

    nested_list += '<li>' + str(keys) + '</li>\n'
    li1 = '<ul>\n' 
    for vals in full_dir_list[keys]:
        #print(vals)
        li1 += '<li>' + str(vals) + '</li>\n'
    for vals in full_file_list[keys]:
        #print(vals)
        li1 += '<li>' + str(vals) + '</li>\n'
    li1 += '</ul>\n'
    nested_list += li1

nested_list += '</ul>\n'
links_html += nested_list
links_html += '</div>'


nested_list = '<ul>\n'
for root, dirs, files in os.walk(dir_path):
    level = root.replace(dir_path, '').count(os.sep)
    indent = ' ' * 4 * (level)
    print('{}{}/'.format(indent, os.path.basename(root)))
    subindent = ' ' * 4 * (level + 1)
    for f in files:
        print('{}{}'.format(subindent, f))

full_dir_list = {}
full_file_list = {}
for path, subdirs, files in os.walk(dir_path):
    # print(path, subdirs, files )
    log_str = str(path) + ' ' + str(subdirs) + ' ' +  str(files) + '<br><br>'
    #dir_name = path.split('/')[-1]
    dir_name = path.replace(root_dir , '')
    if dir_name in full_dir_list.keys():
        full_dir_list[dir_name] += subdirs
    else:
        full_dir_list[dir_name] = subdirs
    if dir_name in full_file_list.keys():
        full_file_list[dir_name] += files
    else:
        full_file_list[dir_name] = files
#logs
links_html += '<div class="home_column">'
links_html += str(full_dir_list) + '<br><br>'
links_html += str(full_file_list) + '<br><br>'
#pprint.pprint(full_dir_list)    
links_html += '</div>'
'''
