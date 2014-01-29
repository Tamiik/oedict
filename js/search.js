function html_entity_decode(input) {
  var y = document.createElement('textarea');
  y.innerHTML = input;
  return y.value;
}

// add ash or thorn to the input
function append_search(cha) {
    $("#search").val($("#search").val() + html_entity_decode(cha))
    $("#search").focus()
    update_search()
}
$("#ash").click(function() { append_search("&aelig;") })
$("#thorn").click(function() { Math.random() > 0.5 ? append_search("&eth;") : append_search("&thorn;")})

// handle search input change
$("#search").keyup(function() { update_search() });

// clean input to deal with thorn, macrons for matches
function clean(input) {
    input = input.toLowerCase()
    input = input.replace(new RegExp('&#x0304;', 'g'), '');
    
    input = input.replace(new RegExp('&eth;', 'g'), '6');
    input = input.replace(new RegExp('&thorn;', 'g'), '6');
    input = input.replace(new RegExp('&aelig;', 'g'), '7');
    
    input = input.replace(new RegExp('þ', 'g'), '6');
    input = input.replace(new RegExp('ð', 'g'), '6');
    input = input.replace(new RegExp('æ', 'g'), '7');
    
    input = input.replace(new RegExp('\u00F0', 'g'), '6');
    input = input.replace(new RegExp('\u00FE', 'g'), '6');
    input = input.replace(new RegExp('\u00E6', 'g'), '7');
    
    return input;
}

// turn macrons and thorn into single characters
function normalize(input) {
    input = input.replace(new RegExp('a&#x0304;', 'g'), '1');
    input = input.replace(new RegExp('e&#x0304;', 'g'), '2');
    input = input.replace(new RegExp('i&#x0304;', 'g'), '3');
    input = input.replace(new RegExp('o&#x0304;', 'g'), '4');
    input = input.replace(new RegExp('u&#x0304;', 'g'), '5');
    input = input.replace(new RegExp('&eth;', 'g'), '6');
    input = input.replace(new RegExp('&thorn;', 'g'), '6');
    input = input.replace(new RegExp('&aelig;&#x0304;', 'g'), '8');
    input = input.replace(new RegExp('&aelig;', 'g'), '7');
    return input;
}

// turn letters back into alpha/thorn
function unnormalize(input) {
    input = input.replace(new RegExp('1', 'g'), 'a&#x0304;');
    input = input.replace(new RegExp('2', 'g'), 'e&#x0304;');
    input = input.replace(new RegExp('3(?!04)', 'g'), 'i&#x0304;');
    input = input.replace(new RegExp('4(?!;)', 'g'), 'o&#x0304;');
    input = input.replace(new RegExp('5', 'g'), 'u&#x0304;');
    input = input.replace(new RegExp('6', 'g'), '&thorn;');
    input = input.replace(new RegExp('7', 'g'), '&aelig;');
    input = input.replace(new RegExp('8', 'g'), '&aelig;&#x0304;');
    return input;
}

// bold the searched substring
function highlight_search(search, word) {
   idx = clean(word).indexOf(search)
   if(idx == -1 || search.length < 1) {
       return word;
   }
   
   normalized = normalize(word);
   return unnormalize(normalized.substr(0, idx)) + "<strong>" + unnormalize(normalized.substr(idx, search.length))
                                + "</strong>" + unnormalize(normalized.substr(idx+search.length))
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