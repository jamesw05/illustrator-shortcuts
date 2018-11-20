#target illustrator

// For the contents of the text object within the selection,
// applies the selected style to the part that matches the input regular expression

(function(){
    const SCRIPTNAME = "apply Style With RegExp";

    var _opt = {
        clearing_overrides : true,
        styles : [],
        input_field_width : 16,
        rex : "",
        character_style : "",
        text_frames : []
    }

    function showDialog(){
        getCharacterStyleNames();
    
        _opt.text_frames = [];
        getTextFramesFromSelection(_opt.text_frames);
        if(_opt.text_frames.length < 1){
            showError("no text object selected");
            return;
        }

        if(app.documents.length < 1) return;
        var adoc = app.activeDocument;
        
        var win = new Window("dialog", SCRIPTNAME);
        win.alignChildren = "left";
        
        win.add("statictext", undefined, "regular expression to search");
        win.etext1 = win.add("edittext", undefined, "");
        win.etext1.characters = _opt.input_field_width;

        win.add("statictext", undefined, "character style to apply");
        win.list1 = win.add("dropdownlist", undefined, _opt.styles);
        win.list1.selection = 0;
        
        win.check1 = win.add("checkbox", undefined, "clearing overrides");
        win.check1.value = _opt.clearing_overrides;

        win.buttons = win.add("group");
        win.buttons.alignment = "center";
        win.buttons.ok = win.buttons.add("button", undefined, "OK");
        win.buttons.cancel = win.buttons.add("button", undefined, "Cancel");

        var isValuesOK = function(){
            _opt.rex  = win.etext1.text;
            if(_opt.rex  == ""){
                showError("please input a regular expression to search");
                return false;
            }
            
            var style_name = win.list1.selection == null ? "" : win.list1.selection.text;
            if(style_name == ""){
                showError("please select a character style to apply");
                return false;
            }
            _opt.character_style = app.activeDocument.characterStyles.getByName(style_name);

            _opt.clearing_overrides = win.check1.value;
            return true;
        }
        
        win.buttons.ok.onClick = function(){
            try{
                win.enabled = false;
                if(isValuesOK() == false) return;
                if(main() == false) return;
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
        
        win.show();
    }

    function getCharacterStyleNames(){
        var styles = app.activeDocument.characterStyles;
        _opt.styles = [];
        for(var i = 0; i < styles.length; i++){
            _opt.styles.push(styles[i].name);
        }
    }
    
    function main(){
 
        // regex_changeContentsOfWordOrString_RemainFormatting.jsx
        // regards pixxxel schubser
        
        var result, aCon;
    
        for(var i = _opt.text_frames.length - 1; i >= 0; i--){
            var atf = _opt.text_frames[i];
    
            var s = new RegExp(_opt.rex, "gi");

            while ( result = s.exec(atf.contents)) {
                
                try {
     
                    aCon = atf.characters[result.index];
                    
                    aCon.length = result[0].length;
                    
                    _opt.character_style.applyTo(aCon, _opt.clearing_overrides);
                    
                } catch (e) {};
            }
            
        }
    }
    
    function getTextFramesFromSelection(textFrames, items){
        if(!items) items = app.activeDocument.selection;
        for(var i = 0; i < items.length; i++){
            if(items[i].locked || items[i].hidden){
                continue;
            } else if(items[i].typename == "TextFrame"){
                textFrames.push(items[i]);
            } else if(items[i].typename == "GroupItem"){
                getTextFramesFromSelection(textFrames, items[i].pageItems);
            }
        }
    }

    function showError(msg){
        alert(SCRIPTNAME + "\rERROR :\r"
              + msg);
    }
    
    showDialog();
})();
