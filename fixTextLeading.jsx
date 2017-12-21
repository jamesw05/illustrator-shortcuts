// fixTextLeading
// Sets the leading of each character of the selected
// textFrameItems to the same value as the font size.

// HOW TO USE:
// Select objects and run the script.
// The objects other than textFrameItem are ignored.

// JavaScript script for Adobe Illustrator

// Copyright(c) 2017 Hiroyuki Sato
// https://github.com/shspage
// This script is distributed under the MIT License.
// See the LICENSE file for details.

// Wed, 08 Nov 2017 06:57:12 +0900

main();
function main(){
    // do nothing if there's no document
    if (app.documents.length < 1) return;

    // get selected items
    var text_frames = [];
    extractTextFrames(activeDocument.selection, text_frames);
    if(text_frames.length < 1) return;

    // apply the value
    for(var i = 0; i < text_frames.length; i++){
        var cs = text_frames[i].characters
        var cs_len = cs.length;
        
        for(var ci = 0; ci < cs_len; ci++){
            var c = cs[ci].contents.charCodeAt(0);
            if(c == 10 || c == 13) continue;  // LF or CR

            cs[ci].characterAttributes.autoLeading = false;
            cs[ci].characterAttributes.leading = cs[ci].characterAttributes.size;
        }
    }
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
