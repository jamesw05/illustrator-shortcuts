// fontSizeIncrement
// Increases the font size of each character of the selected textFrameItems by the same value.

// HOW TO USE:
// Select objects and run the script.
// Specify the increment value in the dialog.
// To reduce the size, enter a negative value.
// The objects other than textFrameItem are ignored.

// JavaScript script for Adobe Illustrator

// Copyright(c) 2017 Hiroyuki Sato
// https://github.com/shspage
// This script is distributed under the MIT License.
// See the LICENSE file for details.

// Wed, 08 Nov 2017 06:53:23 +0900

// ----
// set the following values to change default behavior.
var MIN_FONT_SIZE = 4.0;  // minimum font size. in point
var FIX_LEADING = false;  // if true, set the leading of each character to the same value as the font size.
// ----

main();
function main(){
    // do nothing if there's no document
    if (app.documents.length < 1) return;

    // get selected items
    var text_frames = [];
    extractTextFrames(activeDocument.selection, text_frames);
    if(text_frames.length < 1) return;

    // get increment value
    var v = getInputValue();
    if(v == 0) return;

    // apply the value
    for(var i = 0; i < text_frames.length; i++){
        var cs = text_frames[i].characters
        var cs_len = cs.length;
        
        for(var ci = 0; ci < cs_len; ci++){
            var c = cs[ci].contents.charCodeAt(0);
            if(c == 10 || c == 13) continue;  // LF or CR
            
            var f_size = Math.max(MIN_FONT_SIZE,
                                  cs[ci].characterAttributes.size + v);
            
            cs[ci].characterAttributes.size = f_size;
            
            if(FIX_LEADING){
                cs[ci].characterAttributes.autoLeading = false;
                cs[ci].characterAttributes.leading = f_size;
            }
        }
    }
}
// --------------------------------------
// shows an dialog.
// returns received value as a number.
// if input value is not a number, returns 0.
function getInputValue(){
    var input_value = prompt("font size increment (in point)", 0.0);
    var v = input_value - 0;
    
    if(isNaN(v)){
        alert("ERROR: only a number is acceptable.");
    } else if(v != 0){
        return v;
    }
    return 0;
}
// --------------------------------------
// extracts TextFrameItems from "s" (Array of PageItems -- ex. selection),
// and put them into an Array "text_frames".
function extractTextFrames(s, text_frames){
  for(var i = 0; i < s.length; i++){
    if(s[i].typename == "TextFrame"){
        text_frames.push(s[i]);
    } else if(s[i].typename == "GroupItem"){
      // search for TextFrameItem in GroupItem, recursively
      extractTextFrames(s[i].pageItems, text_frames);
    }
  }
}
