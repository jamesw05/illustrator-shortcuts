// findTextBySizeOrFontname

// * Find text objects of specified condition (font size / family - style)
//   in the active document, and select them.
// * You can also change the size of those characters to the specified size.

// * When searching, it examines only the first character of each text object.
//   When replacing, it applies the specified size to the entire text object.
// * Select "--" as font style to ignore font styles when searching.
// * If one of the input fields of the font size range is blank,
//   the search condition is that the font size is equal to the value of
//   the another input field.
// * If the input value for replacement is blank, the script
//   only searches and selects and does not change font size of them.
// * Text objects with some effects applied (blend, envelope etc.) are not
//   recognized as text objects in scripts.

// test env: Adobe Illustrator CC (Windows)

// ver.1.1.2

// Copyright(c) 2018 Hiroyuki Sato
// https://github.com/shspage
// This script is distributed under the MIT License.
// See the LICENSE file for details.

(function(){
    const SCRIPTNAME = "findTextBySizeOrFontname";
    const STYLE_IGNORE = "--";

    // In Illustrator script, there is a problem that if a text object uses
    // a font which used in a character style, it is not possible to change
    // its font size to the character style's default font size.
    // To work around this problem, the following fonts are used for processing.
    // If it is not installed, or if the following font itself is used for
    // any of character styles in current document, change it to a different font name.
    const ESCAPE_FONT = "Verdana";

    // list box dimension (used when _opt.use_listbox_interface set to true)
    const LISTBOX_WIDTH = 200;
    const LISTBOX_HEIGHT = 350;
    
    var _opt = {
        default_check_find_by_size : true,
        default_check_find_by_family : false,
        
        size_specified : false,
        size_from_start : 0,
        size_from_end : 0,
        
        replace_size_specified : false,
        size_to : 0,
        
        family_specified : false,
        family : "",
        style_specified : false,
        style : "",

        use_listbox_interface : false,

        search_from_the_selected_objects : false,
        do_not_select_found_objects_when_replacing_size : true,
        max_number_of_objects_to_restore_selection : 50,
        min_seconds_to_show_alert_at_end : 0,  // set -1 to never show it

        is_test : false,
        escape_font : undefined,
        keydown_reset_seconds : 1
    };

    // ------------------------------------------
    function checkPrerequisite(){
        try{
            _opt.escape_font = textFonts.getByName(ESCAPE_FONT);
        } catch(e){
            //alert("ABORT:\rYou need the following font to run this script.\r"
            //      + ESCAPE_FONT);
            _opt.escape_font = undefined;
            //return false;
        }
        return true;
    }
    // ------------------------------------------
    function showDialog(){
        if(checkPrerequisite() == false) return;
        if(app.documents.length < 1) return;
        
        var fontFamilies = [];
        var fontStyles = {};
        var longest_style_name = getFonts(fontFamilies, fontStyles);
    
        var win = new Window("dialog", SCRIPTNAME);
        win.alignChildren = "left";
        
        win.check1 = win.add("checkbox", undefined, "Select text objects by font size");
        win.check1.value = _opt.default_check_find_by_size;
        
        win.group1 = win.add("group");
        win.stext1 = win.group1.add("statictext", undefined, "Find size between (pt):");
        win.etext1 = win.group1.add("edittext", undefined, "");
        win.etext1.characters = 8;
        win.stext2 = win.group1.add("statictext", undefined, "and");
        win.etext2 = win.group1.add("edittext", undefined, "");
        win.etext2.characters = 8;

        win.group2 = win.add("group");
        win.stext3 = win.group2.add("statictext", undefined, "Replace size to (pt):");
        win.etext3 = win.group2.add("edittext", undefined, "");
        win.etext3.characters = 8;

        win.check4 = win.add("checkbox", undefined, "Do not select found objects when replacing size");
        win.check4.value = _opt.do_not_select_found_objects_when_replacing_size;
        
        win.check2 = win.add("checkbox", undefined, "Find text object by font family-style");
        win.check2.value = _opt.default_check_find_by_family;
        
        if(_opt.use_listbox_interface){
            win.group3h = win.add("group");
            var dimH=[0,0,LISTBOX_WIDTH,20];
            win.group3h.add("statictext",dimH,"Family");
            win.group3h.add("statictext",dimH,"Style");
            
            win.group3 = win.add("group");
            var dimC=[0,0,LISTBOX_WIDTH,LISTBOX_HEIGHT];
            var col1 = win.group3.add("listbox",dimC,fontFamilies);
            var col2 = win.group3.add("listbox",dimC,fontStyles[fontFamilies[0]]);
        } else {
            win.group3 = win.add("group");
            fontFamilies.shift();
            var col1 = win.group3.add("dropdownlist",undefined,fontFamilies);
            // set dummy items to set width of the list
            var col2 = win.group3.add("dropdownlist",undefined,["--", longest_style_name]);
        }
        
        win.check3 = win.add("checkbox", undefined, "Limit search to currently selected objects");
        win.check3.value = _opt.search_from_the_selected_objects;
        
        win.buttons = win.add("group");
        win.buttons.alignment = "center";
        win.buttons.ok = win.buttons.add("button", undefined, "OK");
        win.buttons.cancel = win.buttons.add("button", undefined, "Cancel");

        win.check1.onClick = function(){
            win.group1.enabled = win.check1.value;
            win.group2.enabled = win.check1.value;
        }
        
        win.check2.onClick = function(){
            win.group3.enabled = win.check2.value;
        }
        win.check2.onClick();  // set enabled
        
        col1.selection = 0;
        col2.selection = 0;
        col1.active = true;
        
        col1.onChange = function(){
            onChangeDropdownList(col1, col2);
        }

        var onChangeDropdownList = function(list1, list2){
            for(var i=list2.items.length - 1; i >= 0; i--){
                list2.remove(list2.items[i]);
            }
            if(list1.selection != null){
                var items = fontStyles[list1.selection.text];
                for(var i=0; i<items.length; i++){
                    list2.add("item", items[i]);
                }
                list2.selection = 0;
            }
        }

        // keydown event listender for dropdownlist.
        // ScriptUI for Dummies  Revision 2.13  p.97
        var dd_key_buffer = "";
        var last_keydown = 0;
        col1.onActivate = function(){ dd_key_buffer = ""; }
        col2.onActivate = function(){ dd_key_buffer = ""; }
        col1.onDeactivate = col2.onDeactivate = function(){ dd_key_buffer = ""; }
        // --------------------------------------
        var keydownHandler = function(k){
            if(new Date().getSeconds() - last_keydown > _opt.keydown_reset_seconds){
                dd_key_buffer = "";
            } 

            if (k.keyName == "Backspace"){
                dd_key_buffer = dd_key_buffer.replace (/.$/, "");
            } else {
                if (k.keyName.length > 0){
                    dd_key_buffer += k.keyName.toLowerCase();
                }
            }
            var i = 0;
            while (i < col1.items.length - 1
                   && col1.items[i].toString().toLowerCase().indexOf(dd_key_buffer) != 0){
                ++i;
            }
            if (col1.items[i].toString().toLowerCase().indexOf(dd_key_buffer) == 0) col1.selection = i;

            last_keydown = new Date().getSeconds();
        }
        //col1.addEventListener("keydown", keydownHandler);
        win.addEventListener("keydown", keydownHandler);  // Mac?
        /* (ScriptUI for Dummies  Revision 2.13  p.99)
        On Macs there appear to be some problems with
        adding the event handler to the dropdown list. These
        problems can be avoided by adding the handler to
        the window, though that in itself is not unproblematic.
        See https://forums.adobe.com/thread/1705713 for
        the discussion. */

        var isValuesOK = function(){
            _opt.size_specified = win.check1.value;

            _opt.search_from_the_selected_objects = win.check3.value;
            _opt.do_not_select_found_objects_when_replacing_size = win.check4.value;
            
            var txt1 = win.etext1.text.replace(/\s+/,"");
            var txt2 = win.etext2.text.replace(/\s+/,"");
            
            // * If one of the input fields of the font size range is blank,
            //   the search condition is that the font size matches the value of
            //   the another input field.
            if(txt1 == "" && txt2 != ""){
                txt1 = txt2;
            } else if(txt1 != "" && txt2 == ""){
                txt2 = txt1;
            }
            
            var txt3 = win.etext3.text.replace(/\s+/,"");
            _opt.replace_size_specified = win.check1.value && txt3 != "";
            
            _opt.size_from_start = parseFloat(txt1);
            _opt.size_from_end   = parseFloat(txt2);
            _opt.size_to         = parseFloat(txt3);

            _opt.family_specified = win.check2.value;
            _opt.family = col1.selection == null
              ? null : col1.selection.text;

            _opt.style = col2.selection == null
              ? null : col2.selection.text;
            _opt.style_specified = (_opt.family_specified && _opt.style != null
                                    && _opt.style != STYLE_IGNORE);
            
            if(_opt.size_specified){
                if(isNaN(_opt.size_from_start) || _opt.size_from_start < 0
                   || isNaN(_opt.size_from_end) || _opt.size_from_end < 0){
                    alert("font size: Please enter positive numbers");
                    return false;
                }
                if(_opt.size_from_start > _opt.size_from_end){
                    _opt.size_from_start = _opt.size_from_end;
                    _opt.size_from_end   = parseFloat(txt1);
                }
                _opt.size_from_start = parseFloat(_opt.size_from_start.toFixed(2));
                _opt.size_from_end = parseFloat(_opt.size_from_end.toFixed(2));
            }
            
            if(_opt.replace_size_specified){
                if(isNaN(_opt.size_to) || _opt.size_to <= 0){
                    alert("font size: Size after conversion is inappropriate.");
                    return false;
                }
            }

            if(_opt.size_specified || _opt.family_specified){
                return true;
            } else {
                alert("No search condition specified.");
                return false;
            }
        }

        win.buttons.ok.onClick = function(){
            try{
                win.enabled = false;
                if(isValuesOK() == false) return;
                main();
            } catch(e) {
                alert(e);
            } finally {
                win.enabled = true;
            }
            win.close();
        }

        win.buttons.cancel.onClick = function(){
            win.close();
        }

        win.onShow = function(){
            col1.onChange();
        }
        win.show();
    }

    // ------------------------------------------
    // pitem : PageItem
    // returns: bool
    function isLockedOrHidden(item){
        if(item.typename == "Document"){
            return false;
        } else if(item.typename == "Layer"){
            if(item.locked || (! item.visible)){
                return true;
            }
        } else {  // GroupItem and other PageItems
            if(item.locked || item.hidden){
                return true;
            }
        }
        return isLockedOrHidden(item.parent);
    }
    
    function isUnderLockedOrHiddenParent(pitem){
    }

    // ------------------------------------------
    // text_object : TextFrameItem
    // size_from, size_to : float
    // returns: bool
    function hasFontSizeBetween(text_object, size_from, size_to){
        if(text_object.characters.length > 0){
            var cattr = text_object.characters[0].characterAttributes;
            var size = parseFloat(cattr.size.toFixed(2));
            if(size >= size_from && size <= size_to){
                return true;
            }
        }
        return false;
    }

    // ------------------------------------------
    // text_object : TextFrameItem
    // family : string
    // is_style_specified : bool
    // style : string
    // returns: bool
    function hasFontFamilyAndStyle(text_object, family, is_style_specified, style){
        if(text_object.characters.length > 0){
            var cattr = text_object.characters[0].characterAttributes;
            var font = cattr.textFont;
            if(font.family == family){
                if(is_style_specified && font.style != style){
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    // ------------------------------------------
    function main(){
        var err = false;
        var timer = new TimeChecker();

        var select_count = 0;
        var replace_count = 0;
        
        if(_opt.is_test){
            select_count = -1;
            replace_count = -1;
        }
            
        if(_opt.search_from_the_selected_objects){
            var texts = extractTextFrames(activeDocument.selection);
        } else {
            var texts = app.activeDocument.textFrames;
        }
        
        app.activeDocument.selection = [];  // reset selection

        for(var i = 0, iEnd = texts.length; i < iEnd; i++){
            //if(i % 50 == 0) $.writeln(i + "/" + texts.length);
            
            if(!_opt.search_from_the_selected_objects){
                if(isLockedOrHidden(texts[i])){
                    continue;
                }
            }
            
            if(_opt.size_specified
               && (! hasFontSizeBetween(texts[i], _opt.size_from_start, _opt.size_from_end))){
                continue;
            } else if(_opt.family_specified
                      && (! hasFontFamilyAndStyle(texts[i], _opt.family, _opt.style_specified, _opt.style))){
                continue;
            } else {
                if(_opt.replace_size_specified){
                    err = changeFontSize(texts[i]);
                    if(err) break;
                    
                    if(_opt.do_not_select_found_objects_when_replacing_size){
                        replace_count++;
                        continue;
                    }
                }
                texts[i].selected = true;
                select_count++;
            }
        }
        
        if(err) return;

        showResult(texts, select_count, replace_count, timer);
    }

    // ------------------------------------------
    // text : TextFrameItem
    function changeFontSize(text){
        err = false;
        var orig_size = text.textRange.characterAttributes.size;
        text.textRange.characterAttributes.size = _opt.size_to;

        // In here, only the first character is checked
        if(text.textRange.characterAttributes.size == orig_size){
            if(_opt.escape_font){
                var orig_font = text.textRange.characterAttributes.textFont;
                text.textRange.characterAttributes.textFont = _opt.escape_font;
                text.textRange.characterAttributes.size = _opt.size_to;
                text.textRange.characterAttributes.textFont = orig_font;
            }
            
            if(text.textRange.characterAttributes.size == orig_size){
                var err_msg = "ERROR:\rfailed to change font size from " + orig_size
                  + " to " + _opt.size_to + ".";
                if(!_opt.escape_font){
                    err_msg += "\r(ESCAPE_FONT(" + ESCAPE_FONT + ") is not recognized.)";
                }
                alert(err_msg);
                err = true;
            }
        }
        return err;
    }
    // ------------------------------------------
    // texts : PageItem[]
    // select_count, replace_count : int
    // timer : TimeChecker
    function showResult(texts, select_count, replace_count, timer){
        // show result
        if(replace_count > 0){
            // replace && found (_opt.do_not_select_found_objects_when_replacing_size == true)
            alert("DONE\r"
                  + "changed size of " + replace_count + " text objects.\r"
                  + timer.getResult());
        } else if(app.activeDocument.selection.length < 1){
            // no replace && not found
            // replace && not found
            restoreSelection(texts);  // _opt.search_from_the_selected_objects == true
            alert("DONE\r"
                  + "There is no editable text object which has specified condition.\r"
                  + timer.getResult());
        } else {
            // no replace && found
            // replace && found (_opt.do_not_select_found_objects_when_replacing_size == false)
            if(_opt.min_seconds_to_show_alert_at_end >= 0
               && timer.elapsedSeconds() >= _opt.min_seconds_to_show_alert_at_end){
                alert("DONE\r"
                      + app.activeDocument.selection.length + " text objects selected.\r"
                      + timer.getResult());
            }
            
            if(select_count != app.activeDocument.selection.length){
                if(_opt.is_test) alert("next message is a test")
                alert("DONE (WARNING)\r"
                      + "selected:" + app.activeDocument.selection.length + "\r"
                      + "should be selected:" + select_count + "\r"
                      + "Some of the found objects are not selected.\r"
                      + "It may have exceeded the selectable number limit with script.");
            }
        }
    }

    // ------------------------------------------
    // texts : PageItem[]
    function restoreSelection(texts){
        if(_opt.search_from_the_selected_objects
           && texts.length <= _opt.max_number_of_objects_to_restore_selection){
            for(var i = 0, iEnd = texts.length; i < iEnd; i++){
                texts[i].selected = true;
            }
        }
    }
    // ------------------------------------------
    // fontFamilies : array
    // fontStyles : associative array (key: TextFont.family, value: TextFont.style[])
    function getFonts(fontFamilies, fontStyles){
        var longest_style_name = "";
        var longest_style_name_size = 0;

        for(var i = 0, iEnd = textFonts.length; i < iEnd; i++){
            var font = textFonts[i];
            if(font.family in fontStyles){
                if(font.style == "Default"){
                    fontStyles[font.family].unshift(font.style);
                } else {
                    fontStyles[font.family].push(font.style);
                }
            } else {
                fontFamilies.push(font.family);
                fontStyles[font.family] = [font.style];
            }

            if(font.style.length > longest_style_name_size){
                longest_style_name = font.style;
                longest_style_name_size = font.style.length;
            }
        }
        
        fontFamilies.sort();
        
        for(var i = 0, iEnd = fontFamilies.length; i < iEnd; i++){
            if(fontStyles[fontFamilies[i]].length > 1){
                fontStyles[fontFamilies[i]].unshift(STYLE_IGNORE);
            }
        }

        return longest_style_name;
    }
    // --------------------------------------
    function extractTextFrames(sels, texts){
        if(!texts) texts = [];
        for(var i = 0, iEnd = sels.length; i < iEnd; i++){
            if(sels[i].locked || sels[i].hidden){
                continue;
            } else if(sels[i].typename == "TextFrame"){
                texts.push(sels[i]);
            } else if (sels[i].typename == "GroupItem") {
                texts = extractTextFrames(sels[i].pageItems, texts);
            }
        }
        return texts;
    }
    // --------------------------------------
    // function to display elapsed time at the end
    var TimeChecker = function(){
        this.start_time = new Date();

        this.elapsedSeconds = function(){
            var now = new Date();
            return now.getSeconds() - this.start_time.getSeconds();
        }
        
        this.getResult = function(){
            var stop_time = new Date();
            var ms = stop_time.getTime() - this.start_time.getTime();
            var hours = Math.floor(ms / (60 * 60 * 1000));
            ms -= (hours * 60 * 60 * 1000);
            var minutes = Math.floor(ms / (60 * 1000));
            ms -= (minutes * 60 * 1000);
            var seconds = Math.floor(ms / 1000);
            ms -= seconds * 1000;
            return ("(" + hours + "h " + minutes + "m " + seconds + "s " + ms + ")");
        }
    }
    
    // ------------------------------------------
    // Test
    // ------------------------------------------
    function Test1(){
        var items = Test_prepare();

        _opt = {
            size_specified : true,
            size_from_start : 14,
            size_from_end : 18,
            
            replace_size_specified : true,
            size_to : 5,
            
            family_specified : false,
            family : "",
            style_specified : false,
            style : "",
              
            search_from_the_selected_objects : false,
            do_not_select_found_objects_when_replacing_size : false,
            max_number_of_objects_to_restore_selection : 50,
            min_seconds_to_show_alert_at_end : -1,  // set -1 to never show it
            
            is_test : true
        };
        main();

        // selected state of each item in items.
        // 1:selected, 0:not selected
        var desired_status
            = [0,0,0,0,1,1,1,1,1,0,
               0,0,0,0,1,1,1,1,1,0,
               0,0,0,0,1,1,1,1,1,0,
               0,0,0,0,1,1,1,1,1,0,
               0,0,0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,0,0];
        Test_verify(items, desired_status, "Test1");
    }
    // ----
    function Test2(){
        var items = Test_prepare();

        _opt = {
            size_specified : false,
            size_from_start : 0,
            size_from_end : 0,
            
            replace_size_specified : false,
            size_to : 0,
            
            family_specified : true,
            family : "Verdana",
            style_specified : true,
            style : "Bold",
              
            search_from_the_selected_objects : false,
            do_not_select_found_objects_when_replacing_size : true,
            max_number_of_objects_to_restore_selection : 50,
            min_seconds_to_show_alert_at_end : -1,  // set -1 to never show it

            is_test : true
        };
        main();

        // selected state of each item in items.
        // 1:selected, 0:not selected
        var desired_status
            = [0,0,0,0,1,1,1,0,0,0,
               0,0,0,0,1,1,1,0,0,0,
               0,0,0,0,1,1,1,0,0,0,
               0,0,0,0,1,1,1,0,0,0,
               0,0,0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,0,0,
               0,0,0,0,0,0,0,0,0,0];
        Test_verify(items, desired_status, "Test2");
    }
    // ----
    function Test_all(){
        if(Test_checkPrerequisite() == false) return;
        try{
            Test1();
            Test2();
        } catch(e){
            alert(e);
        }
    }
    // ----
    // ----
    function Test_prepare(){
        var doc = app.documents.add();
        doc.activate();
        
        var items = [];
        var alay = activeDocument.activeLayer;
        
        // pointText
        var ptTxt = alay.textFrames.pointText([10, 700]);
        Test_duplicateItem(ptTxt, items);

        // areaText
        var path1 = alay.pathItems.rectangle(700, 100, 100, 100);
        var aTxt = alay.textFrames.areaText(path1);
        Test_duplicateItem(aTxt, items);

        // pathText
        var path2 = alay.pathItems.ellipse(700, 240, 100, 100);
        var pathTxt = alay.textFrames.pathText(path2);
        Test_duplicateItem(pathTxt, items);
        
        // group
        ptTxt = alay.textFrames.pointText([200, 400]);
        Test_duplicateItem(ptTxt, items, false, true);
        // group (locked)
        ptTxt = alay.textFrames.pointText([300, 400]);
        Test_duplicateItem(ptTxt, items, false, true, false, false, true);
        // group (hidden)
        ptTxt = alay.textFrames.pointText([400, 400]);
        Test_duplicateItem(ptTxt, items, false, true, false, false, false, true);
        // locked
        ptTxt = alay.textFrames.pointText([500, 400]);
        Test_duplicateItem(ptTxt, items, false, false, false, false, false, false, true);
        // hidden
        ptTxt = alay.textFrames.pointText([500, 400]);
        Test_duplicateItem(ptTxt, items, false, false, false, false, false, false, false, true);
        
        // new layer (locked)
        ptTxt = alay.textFrames.pointText([10, 400]);
        Test_duplicateItem(ptTxt, items, true, false, true);
        // new layer (hidden)
        ptTxt = alay.textFrames.pointText([100, 400]);
        Test_duplicateItem(ptTxt, items, true, false, false, true);
        
        return items;
    }
    // ----
    function Test_checkPrerequisite(){
        var required_fonts = ["Verdana","Verdana-Bold"];
        try{
            for(var i = 0; i < required_fonts.length; i++){
                textFonts.getByName(required_fonts[i]);
            }
        } catch(e){
            alert("ABORT:\rYou need the following fonts to run the test.\r"
                  + required_fonts.join("\r"));
            return false;
        }
        return true;
    }
    // ----
    function Test_duplicateItem(item, items,
                                make_new_layer, make_group,
                                lock_layer, hide_layer,
                                lock_group, hide_group,
                                lock_item, hide_item){
        if(make_new_layer){
            var lay = activeDocument.layers.add();
            item.move(lay, ElementPlacement.PLACEATBEGINNING);
        }
        if(make_group){
            var grp = activeDocument.activeLayer.groupItems.add();
            item.move(grp, ElementPlacement.PLACEATBEGINNING);
        }
        if(lock_item){  item.locked = true; }
        if(hide_item){ item.hidden = true; }
        
        item.textRange.characterAttributes.size = 10;
        item.contents = "123456";
        items.push(item);
        var fontRegular = textFonts.getByName("Verdana");
        var fontBold = textFonts.getByName("Verdana-Bold");

        for(var i = 1; i < 10; i++){
            item = item.duplicate();
            item.top -= 20;
            item.textRange.characterAttributes.size = 10 + i;
            if(i > 6){
                item.textRange.characterAttributes.textFont = fontRegular;
            } else if(i > 3){
                item.textRange.characterAttributes.textFont = fontBold;
            }
            items.push(item);
        }

        if(lock_group){ grp.locked = true; }
        if(hide_group){ grp.hidden = true; }
        if(lock_layer){ lay.locked = true; }
        if(hide_layer){ lay.visible = false; }
    }
    // ----
    function Test_verify(items, oks, testName){
        var err = false;
        for(var i = items.length - 1; i >= 0; i--){
            if((oks[i] == 1) != (items[i].selected)){
                err = true;
            }
            // items[i].remove();
        }
        alert(testName + (err ? " ERROR" : " PASS"));
        activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    }
    // --------
    function test_fontsize(){
        var t = activeDocument.selection[0];
        for(var i = 1; i < 72; i++){
            var td = t.duplicate();
            td.translate(0, -10 * i);
            td.textRange.characterAttributes.size = i;
        }
    }
    // ------------------------------------------
    showDialog();
    
    //Test_all();
})();
