/*live track pages common js */

//options map
option_endpoint = {
    "1": "india",
    "2": "tsap",
    "3": "tamilnadu",
    "4": "karnataka",
    "5": "kerala",
    "6": "roi",
}
base_url = 'http://127.0.0.1:8001'
base_url = 'https://daily_boxoffice-1-c5568081.deta.app'

//function - to get main table data 
async function getData()
{
    //init funcs
    daily_heading()
    //params
    date_str = document.getElementById('date_select').value //'2023-06-16'
    region_val= document.getElementById('region_dropdown').value;
    console.log('date_str' , date_str , 'select state' , region_val)
    cache_meth = "reload";
    
    end_point = option_endpoint[region_val]
    url = base_url + '/' + end_point
    query_url = url + '?selected_date=' + date_str
    //console.log(query_url)

    document.getElementById("table_container").innerHTML = ''
    // query = [{"Show Date":"29 March 2023"}] //json_payload = {"query" : query}
    try 
    {
        var response = await fetch(query_url, {
            method: 'GET',
            //headers: headers,
            //body: JSON.stringify(json_payload) ,
            cache:cache_meth ,
        })
    }
    catch(err)
    {
        cont_div = document.getElementById("table_container");
        cont_div.innerHTML = '<p style="text-align:center;font-weight:bold;font-size:20px;">no-data</p>';
        return;
    }
    //.then( response => response.json() )
    //.then( response => {console.log(response)} );
    if (response.status!=200) {
        cont_div = document.getElementById("table_container");
        cont_div.innerHTML = '<p style="text-align:center;font-weight:bold;font-size:20px;">no-data</p>';
        return;
    }

    //data
    var data = await response.json();
    //console.log(data)
    init_table_html = '<table id= "daily_table">'
    text_sort_ids = [1]
    non_sort_ids = [-1]
    gr_cols = []
    ff_cols = []
    change_cols = []
    lang_cond = false
    header_list = ['Rank' , 'Movie' , 'Release', 'Day',]
    data_columns =[ 'Rank' , 'Movie',  'Release date', 'Day count', ]
    if (end_point=='india')
    {
        header_list = header_list.concat(['Tracked Gross', 'Tr. Shows', 'Change','Tr. Footfalls',
         'Aggregate Tracked Gross', 'Agg. Actual Gross', 'Agg. Footfalls', 'Live Report', 'Showdown']) //'Actual Gross',
        data_columns = data_columns.concat(['Tracked India Gross' , 'Tracked Shows' , 'Change' , 
            'Tracked Footfalls',  'Aggregate Tracked India Gross',
            'Aggreagte Actual India Gross', 'Aggreagte Actual Footfalls', 'Link',
        ])//'Actual India gross',
        gr_cols = [4,8,9] //gross in cr/crore
        ff_cols = [7,10] //footfall in Lakh/L
        change_cols = [6] //percentages
        modal_header_list = "Day No.,Tracked India gross <br>(in crore),Change" 
        modal_data_columns = "Day count,Tracked India Gross,Change"
        lang_cond = true
    }
    else if (end_point=='tsap')
    {
        header_list = header_list.concat(['TS-AP Tracked gross', 'Tracked Footfalls', 'Telugu Lang Gross', 'Showdown'])	//'Tracked Shows' , 'Change','Showdown'
        //'Actual India Gross', 'Aggregate Tracked gross', 'Aggregate Actual gross',
        data_columns = data_columns.concat(['Telugu States Gross', 'Telugu States FF_tr',  'Telugu Gross',])
        gr_cols = [4,6] //gross in cr/crore
        //table_html = create_table(data, header_list, data_columns, text_sort_ids, init_table_html , gr_cols) 
        modal_header_list = "Day No.,TS-AP Tracked gross <br>(in crore)" 
        modal_data_columns = "Day count,Telugu States Gross"
    }
    else if (end_point=='tamilnadu')
    {
        header_list = header_list.concat(['TN Tracked gross', 'Tracked Footfalls', 'Tamil Lang Gross', 'Showdown'])	//'Tracked Shows' , 'Change','Showdown'	
        data_columns = data_columns.concat(['TamilNadu Gross', 'TamilNadu FF_tr', 'Tamil Gross',])
        gr_cols = [4,6] //gross in cr/crore
        modal_header_list = "Day No.,TamilNadu Tracked gross <br>(in crore)" 
        modal_data_columns = "Day count,TamilNadu Gross"
    }
    else if (end_point=='karnataka')
    {
        header_list = header_list.concat(['KA Tracked gross', 'Tracked Footfalls', 'Kannada Gross', 'Showdown'])	//'Tracked Shows' , 'Change','Showdown'	
        data_columns = data_columns.concat(['Karnataka Gross', 'Karnataka FF_tr', 'Kannada Gross'])
        gr_cols = [4,6] //gross in cr/crore
        modal_header_list = "Day No.,Karnataka Tracked gross <br>(in crore)" 
        modal_data_columns = "Day count,Karnataka Gross"
    }
    else if (end_point=='kerala')
    {
        header_list = header_list.concat(['KL Tracked gross', 'Tracked Footfalls', 'Malayalam Gross', 'Showdown'])	//'Tracked Shows' , 'Change','Showdown'	
        data_columns = data_columns.concat(['Kerala Gross', 'Kerala FF_tr', 'Malayalam Gross', ])
        gr_cols = [4,6] //gross in cr/crore
        modal_header_list = "Day No.,Kerala Tracked gross <br>(in crore)" 
        modal_data_columns = "Day count,Kerala Gross"
    }
    else if (end_point=='roi')
    {
        header_list = header_list.concat(['ROI Tracked gross', 'Tracked Footfalls', 'Hindi Gross', 'Showdown'])	//'Tracked Shows' , 'Change','Showdown'	
        data_columns = data_columns.concat(['ROI Gross', 'ROI FF_tr', 'Hindi Gross', ])
        gr_cols = [4,6] //gross in cr/crore
        modal_header_list = "Day No.,ROI Tracked gross,Hindi Language Tracked gross <br>(in crore)"  //North India
        modal_data_columns = "Day count,ROI Gross,Hindi Gross"
    }
    else
    {
        table_html ='<p style="text-align:center;font-weight:bold;font-size:20px;">no-data</p>'
    }
    
    table_html = create_table_withview(data, header_list, data_columns, text_sort_ids, init_table_html, 
        modal_header_list, modal_data_columns, gr_cols, ff_cols, change_cols, lang_cond) 
    cont_div = document.getElementById("table_container");
    cont_div.innerHTML = table_html //+ ad_html + total_html + end_html;
    return
}

//function - create table with view button
function create_table_withview(data, header_list, data_columns, text_sort_ids, init_table_html,
    modal_header_list, modal_data_columns, gr_cols=[], ff_cols=[], change_cols=[], lang_cond=false,) //div_id,
{
    table_html = init_table_html 
    len = data.length;
    header_html = '<tr>'
    for (var i=0;i<header_list.length;i++)
    {
        if (i==0) 
        {
            header_html += '<th' + ' class="sticky-col first-col" style="background-color: #009879;" onclick="sortTable(' + i + ')" ' + '>'
        }
        else if (i==1) 
        {
            header_html += '<th' + ' class="sticky-col second-col" style="background-color: #009879;" onclick="sortTable(' + i + ')" ' + '>'
        }
        else{
            header_html += '<th' + ' onclick="sortTable(' + i + ')" ' + '>'
        }
        header_html += header_list[i] + '&nbsp; <i class="fa" style="font-size:12px; color:#16161d;" >&#xf0dc;</i>'
        //if (non_sort_ids.includes(i)){continue}
        //else {header_html += ' <i style="font-size:12px" class="fa">&#xf0dc;</i>'}
        //&#x25B4; up &#x25BC;down  &#9650; up &#9660'; down #'&#xf0dc' up-down
        header_html += '</th>'
    }
    header_html += '</tr>'
    table_html += header_html

    for(var i=0;i<len;i++){
        j_data = data[i]
        //console.log(j_data)
        //console.log(Object.keys(j_data))
        row_html = '<tr>'
        movie_name = j_data.Movie;
        td_html = ''
        for (j=0; j<data_columns.length; j++)
        {
            column_name = data_columns[j]
            dt_r = j_data[column_name]
            if (dt_r == undefined){dt_r='-'}
            else if (gr_cols.includes(j)){dt_r = dt_r + 'cr'}
            else if (ff_cols.includes(j)){dt_r = dt_r + ' L'}
            else if (change_cols.includes(j))
            {
                dt_r = Number(dt_r)
                if (dt_r>0){dt_r = '<text style="color:green;font-weight:bold;">' + dt_r + '%' + '</text>'}
                else if(dt_r<0){dt_r = '<text style="color:red;font-weight:bold;">' + dt_r + '%' + '</text>'}
                else {dt_r = "<text>" + dt_r + '%' + '</text>'}
            }
            if (j==0) 
            {
                td_html += '<td  class="sticky-col first-col" >' + dt_r + '</td>'
            }
            else if (j==1) 
            {
                td_html += '<td  class="sticky-col second-col" >' + dt_r + '</td>'
            }
            else{
                td_html += '<td>' + dt_r + '</td>'
            }
            //break
        }
        //add button to display modal breakdown table
        //style="background-color:green"
        //header_list = ['Day No.', 'Tracked gross <br>(in crore)']
        //data_columns =[ 'Day count' , 'Tracked India Gross']
        param_str = "'" +movie_name+ "', '" +modal_header_list+ "', '" + modal_data_columns+ "', '" + lang_cond +"'" 
        func_str = "movie_data(" + param_str + ")"
        btn_html = `<button type="button" id="data-modal-btn" class="btn btn-info btn-sm" 
        data-toggle="modal" data-target="#myModal" onclick="` + func_str + `" >View Data</button>`
        td_html += '<td>' + btn_html + '</td>'

        row_html += td_html
        row_html += '</tr>'
        table_html += row_html
    }
    table_html += '</table>'
    return table_html
}

//function - sort columns in table
function sortTable(n) //text_sort_ids, gr_cols, ff_cols, change_cols)
{
    text_sort_ids = [1]
    gr_cols = [4,6,8,9,10]
    ff_cols = [7,11]
    change_cols = [6]
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("daily_table");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc"; 
    
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                //if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) 
                //if (Number(x.innerHTML) > Number(y.innerHTML) )
                
                if (text_sort_ids.includes(n))
                {cond = x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()} //text based sort
                
                else
                {
                    xh = x.innerHTML
                    yh = y.innerHTML
                    if(gr_cols.includes(n))
                    {
                        xh = xh.replace('cr','')
                        yh = yh.replace('cr','')
                    }
                    else if(ff_cols.includes(n))
                    {
                        xh = xh.replace(' L','')
                        yh = yh.replace(' L','')
                    }
                    if(change_cols.includes(n))
                    {
                        regex = /\>(.*?)\</
                        xh1 = regex.exec(xh)[1];
                        yh1 = regex.exec(yh)[1];
                        xh = xh1.replace('%','')
                        yh = yh1.replace('%','')
                    }
                        cond = Number(xh) > Number(yh)
                    } //number based sort
                if(cond)
                {
                    shouldSwitch= true;//if so, mark as a switch and break the loop:
                    break;
                }
            } 
            else if (dir == "desc") {
                //if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) 
                //if (Number(x.innerHTML) < Number(y.innerHTML) )

        
                if (text_sort_ids.includes(n))
                {cond = x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()} //text based sort
                else
                {
                    xh = x.innerHTML
                    yh = y.innerHTML
                    if(gr_cols.includes(n))
                    {
                        xh = xh.replace('cr','')
                        yh = yh.replace('cr','')
                    }
                    else if(ff_cols.includes(n))
                    {
                        xh = xh.replace(' L','')
                        yh = yh.replace(' L','')
                    }
                    if(change_cols.includes(n))
                    {
                        regex = /\>(.*?)\</
                        xh1 = regex.exec(xh)[1];
                        yh1 = regex.exec(yh)[1];
                        xh = xh1.replace('%','')
                        yh = yh1.replace('%','')
                    }
                    cond = Number(xh) < Number(yh)
                } //number based sort
                if(cond)
                {
                    shouldSwitch= true;//if so, mark as a switch and break the loop:
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;      
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
                
            }
        }
    }

    /*hd = document.getElementsByClassName("th_arrow")[n].innerHTML;
    if (hd=='&#xf107'){document.getElementsByClassName("th_arrow")[n].innerHTML='&#xf106'} //switch direction arrow
    else if(hd=='&#xf106'){document.getElementsByClassName("th_arrow")[n].innerHTML='&#xf107'} */
    //else{hd='&#9650'} //'▴' '▾'
}

//function - each movie data for -> view button modal #header_list=[], data_columns=[],
async function movie_data(movie_name, header_list='', data_columns='', lang_cond='false', )
{   
    //convert string to list
    data_columns_str = data_columns
    header_list = header_list.split(',')
    data_columns = data_columns.split(',')
    //console.log(header_list, data_columns)
    date_str = document.getElementById('date_select').value //'2023-06-16'

    //change % check
    change_cols=[]
    //if(data_columns.includes('ROI Gross')){change_cols=[]}

    //console.log('Movie', movie_name);
    document.getElementById("modal_heading").innerHTML = movie_name + " - Tracked Collection"
    document.getElementById("modal_body").innerHTML = ''
    lang_table = ''

    // language data & daywise data
    url = base_url + '/' + 'lang-daywise'
    query_url = url + '?movie_name=' + movie_name + '&lang_cond=' + lang_cond + '&data_columns=' + data_columns_str + '&selected_date=' + date_str
    query_url = encodeURI(query_url)
    //console.log(query_url)
    try 
    {
        var response = await fetch(query_url, {
            method: 'GET',
        })
    }
    catch(err){}
    //data
    var data = await response.json();
    //console.log('lang data',data, typeof(data))
    lang_data = data['Lang wise']
    daywise_data = data['Day wise']
    weekend_data = data['Weekend wise']
    weeks_data = data['Week wise']
    data_range = data['data_range']
    note_html = '<p style="font-size:14px;">' + data_range + '</p>'

    //language wise
    if ( (lang_cond==true) || (lang_cond.toLowerCase() =='true') )
	{
        lang_table = '<table class="table table-striped"> <caption> Language wise collection </caption> <tr> <th>Language</th> <th>Tracked Gross (in crore)</th> </tr>'
        for (const key in lang_data){
            r_html = '<tr>'
            lang = key.replace('Gross' , '') 
            gr = lang_data[key] + 'cr'
            r_html += '<td>' + lang + '</td>' + '<td>' + gr + '</td>'
            r_html += '</tr>'
            lang_table += r_html 
        } 
        lang_table += '</table><br>'
    }

    //weekend wise data
    data_columns1 = data['weekend_cols']
    //header_list1 = data['weekend_header']
    header_list1 = header_list.slice()
    header_list1[0] = 'Weekend No.'
    cond1 = header_list1.includes('Change')
    if (cond1 == false){header_list1.push('Change')}
    change_cols1 = [header_list1.length-1]
    //console.log(weekend_data, header_list1 , data_columns1)
    init_table_html = '<table class="table table-striped" id= "modal_table" style="margin:1px; width:100%;">'
    init_table_html += '<caption> Weekend wise tracked collection </caption>'
    weekend_html = create_table(weekend_data, header_list1, data_columns1, [], init_table_html,[],[],change_cols1) //text_sort_ids
    weekend_html += '<br>'
    
    //week wise data
    data_columns1 = data['week_cols']
    //header_list1 = data['weekend_header']
    header_list1 = header_list.slice()
    header_list1[0] = 'Week No.'
    cond1 = header_list1.includes('Change')
    if (cond1== false){header_list1.push('Change')}
    change_cols1 = [header_list1.length-1]
    init_table_html = '<table class="table table-striped" id= "modal_table" style="margin:1px; width:100%;">'
    init_table_html += '<caption> Week wise tracked collection </caption>'
    weeks_html = create_table(weeks_data, header_list1, data_columns1, [] , init_table_html,[],[],change_cols1) //text_sort_ids
    weeks_html += '<br>'
    
    // day wise data
    data = daywise_data
    //header_list = ['Day No.', 'Tracked gross <br>(in crore)'] // , 'Actual India Gross',
    //data_columns =[ 'Day count' , 'Tracked India Gross'] //'Actual India gross',  
    init_table_html = '<table class="table table-striped" id= "modal_table" style="margin:1px; width:100%;">'
    init_table_html += '<caption> Day wise collection </caption>'
    cond1 = header_list.includes('Change')
    if (cond1== true){change_cols = [header_list.length-1]}
    daily_html = create_table(data, header_list, data_columns, text_sort_ids, init_table_html,[],[],change_cols)
    
    //combine all
    modal_div = document.getElementById("modal_body");
    modal_html = note_html + lang_table + weekend_html + weeks_html + daily_html
    modal_div.innerHTML = modal_html
    return
}

//function - create table from data (no sort or others)
function create_table(data, header_list, data_columns, text_sort_ids, init_table_html, gr_cols=[], ff_cols=[],change_cols=[2]) //div_id,
{
    table_html = init_table_html
    len = data.length;
    header_html = '<tr>'
    for (var i=0;i<header_list.length;i++)
    {
        header_html += '<th>' // header_html += '<th' + ' onclick="sortTable(' + i + ')" ' + '>'
        header_html += header_list[i] //+ '&nbsp; <i class="fa" style="font-size:12px; color:#16161d;" >&#xf0dc;</i>'
        header_html += '</th>'
    }
    header_html += '</tr>'
    table_html += header_html

    for(var i=0;i<len;i++){
        j_data = data[i]
        //console.log(j_data)
        //console.log(Object.keys(j_data))
        row_html = '<tr>'
        movie_name = j_data.Movie;
        td_html = ''
        for (j=0; j<data_columns.length; j++)
        {
            column_name = data_columns[j]
            dt_r = j_data[column_name]
            if (dt_r == undefined){dt_r='-'}
            else if (gr_cols.includes(j)){dt_r = dt_r + 'cr'}
            else if (ff_cols.includes(j)){dt_r = dt_r + ' L'}
            else if (change_cols.includes(j)){dt_r = dt_r + '%'}
            td_html += '<td>' + dt_r + '</td>'
            //break
        }
        row_html += td_html
        row_html += '</tr>'
        table_html += row_html
    }
    table_html += '</table>'
    return table_html
}

/// When the user clicks on the button, toggle between hiding and showing the dropdown content
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
    
// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}