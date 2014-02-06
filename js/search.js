// silly way to decode HTML entities
function html_entity_decode(input) {
  var y = document.createElement('textarea');
  y.innerHTML = input;
  return y.value;
}

// add ash or thorn to the input when buttons are clicked
function append_search(cha) {
    $("#search").val($("#search").val() + html_entity_decode(cha))
    $("#search").focus()
    update_search()
}
$("#ash").click(function() { append_search("&aelig;") })
$("#thorn").click(function() { Math.random() > 0.5 ? append_search("&eth;") : append_search("&thorn;")})

// handle search input change
$("#search").keyup(update_search);
$("#oebox").click(function() {
    update_search();
    if(!$("#mebox").prop('checked')) {
        $("#mebox").click()
    }
});

$("#mebox").click(function() {
    update_search();
    if(!$("#oebox").prop('checked')) {
        $("#oebox").click()
    }
});

// clean up input (both search input and dictionary entries)
function clean(input) {
    input = input.toLowerCase()
    // strip macrons so that search matches with/without macrons
    input = input.replace(new RegExp('&#x0304;', 'g'), '');
    
    // replace * with . for wildcard matches
    input = input.replace(new RegExp('\\*', 'g'), '.')
    
    // normalize eth/thorn/ash
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

// turn ash/thorn/macrons into numbers
function normalize(input) {
    input = input.replace(new RegExp('a&#x0304;', 'g'), '1');
    input = input.replace(new RegExp('e&#x0304;', 'g'), '2');
    input = input.replace(new RegExp('i&#x0304;', 'g'), '3');
    input = input.replace(new RegExp('o&#x0304;', 'g'), '4');
    input = input.replace(new RegExp('u&#x0304;', 'g'), '5');
    input = input.replace(new RegExp('y&#x0304;', 'g'), '9');
    input = input.replace(new RegExp('&eth;', 'g'), '6');
    input = input.replace(new RegExp('&thorn;', 'g'), '6');
    input = input.replace(new RegExp('&aelig;&#x0304;', 'g'), '8');
    input = input.replace(new RegExp('&aelig;', 'g'), '7');
    return input;
}

// turn numbers back into ash/thorn/macrons
function unnormalize(input) {
    input = input.replace(new RegExp('1', 'g'), 'a&#x0304;');
    input = input.replace(new RegExp('2', 'g'), 'e&#x0304;');
    // ignore 3's and 4's in macrons
    input = input.replace(new RegExp('3(?!04)', 'g'), 'i&#x0304;');
    input = input.replace(new RegExp('4(?!;)', 'g'), 'o&#x0304;');
    input = input.replace(new RegExp('5', 'g'), 'u&#x0304;');
    input = input.replace(new RegExp('9', 'g'), 'y&#x0304;');
    input = input.replace(new RegExp('6', 'g'), '&eth;');
    input = input.replace(new RegExp('7', 'g'), '&aelig;');
    input = input.replace(new RegExp('8', 'g'), '&aelig;&#x0304;');
    return input;
}

// bold the searched substring
function highlight_search(search, word) {
   idx = find_match(search, clean(word))
   if(idx == -1 || search.length < 1) {
       return word;
   }
   
   // don't highlight extra characters because we found ^ or $
   searchlen = search.length
   if (search.charAt(0) == '^')
       searchlen--
   if(search.charAt(search.length-1) == '$')
       searchlen--
       
   // normalization is a hack that replaces HTML entity characters with single digits
   // to avoid dealing with index math
   normalized = normalize(word);
   return unnormalize(normalized.substr(0, idx)) + "<strong>" +
                unnormalize(normalized.substr(idx, searchlen)) + "</strong>" +
                unnormalize(normalized.substr(idx+searchlen))
}

// Wildcard, ^, and $ are actually supported
// Other regex characters will work, although they probably shouldn't
function find_match(search, word) {
    return word.search(new RegExp(search));
}

// update the table with the search query
function update_search() {
    $("#dict tbody").empty()
    search = clean($("#search").val())
    
    // check if we're searching OE, ME, or both
    oe = $("#oebox").prop('checked')
    me = $("#mebox").prop('checked')
    
    // iterate over the whole dictionary
    for(i = 0; i < oedict.length; i++) {
        oeword = clean(oedict[i][0])
        meword = clean(oedict[i][1])

        // add TR line if match found
        if((oe && find_match(search, oeword) != -1) || (me && find_match(search, meword) != -1)) {
            // mark up words
            oeword = oe ? highlight_search(search, oedict[i][0]) : oedict[i][0];
            meword = me ? highlight_search(search, oedict[i][1]) : oedict[i][1];
            
            trcontent = "<tr><td>" + oeword + "</td><td>" +
                                     meword + "</td></tr>"
            $("#dict tbody").append(trcontent)
        }
    }
}

update_search();