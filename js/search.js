// add ash or thorn to the input
function append_search(cha) {
    $("#search").val($("#search").val() + cha)
    $("#search").focus()
    update_search()
}
$("#ash").click(function() { append_search("æ") })
$("#thorn").click(function() { Math.random() > 0.5 ? append_search("ð") : append_search("þ")})

// handle search input change
$("#search").keyup(function() { update_search() });

// clean up input for better matches
function clean(input) {
    input = input.toLowerCase()
    input = input.replace(new RegExp('&#x0304;', 'g'), '');
    return input.replace(new RegExp('þ', 'g'), 'ð');
}

// bold the searched substring
function highlight_search(search, word) {
   idx = clean(word).indexOf(search)
   if(idx == -1) {
       return word;
   }
   
   // adjust indices if there are macrons
   macronidx = idx;
   numMacrons = 0;
   while(word.indexOf('&#x0304;') > macronidx) {
       macronidx = word.indexOf('&#x0304;');
       numMacrons++;
   }
   
   return word.substr(0, idx) + "<strong>" + word.substr(idx, search.length+(numMacrons*8))
                                + "</strong>" + word.substr(idx+search.length+(numMacrons*8))
}

// update the table with the search query
function update_search() {
    $("#dict tbody").empty()
    search = clean($("#search").val())
    
    for(i = 0; i < oedict.length; i++) {
        oeword = clean(oedict[i][0])
        meword = clean(oedict[i][1])
        match_found = false;
        
        // check match to input and mark it up
        if(oeword.indexOf(search) != -1) {
            match_found = true;
        }
        oeword = highlight_search(search, oedict[i][0])
        
        if(meword.indexOf(search) != -1) {
              match_found = true;
         }
         meword = highlight_search(search, oedict[i][1])
        
        // add TR line if match found
        if(match_found) {
            trcontent = "<tr><td>" + oeword + "</td><td>" +
                                     meword + "</td></tr>"
            $("#dict tbody").append(trcontent)
        }
        
        
        
    }
}

update_search();