// Cut At Selected Anchors

// cuts selected puthes at each selected anchor


// test env: Adobe Illustrator CS3, CS6 (Windows)

// Copyright(c) 2005-2013 Hiroyuki Sato
// https://github.com/shspage
// This script is distributed under the MIT License.
// See the LICENSE file for details.

// Wed, 30 Jan 2013 07:04:30 +0900

main();
function main(){
  var sp = [];
  getPathItemsInSelection(2, sp);
  if(sp.length<1) return;

  var j, k, p;
  var first_anchor_selected, idxs, ary, ancs;

  for(var i=0; i<sp.length; i++){
    p = sp[i].pathPoints;
    idxs = [[0]];
    first_anchor_selected = isSelected(p[0]);
    
    for(j = 1; j < p.length; j++){
      idxs[idxs.length - 1].push(j);
      if(isSelected(p[j])) idxs.push([j]);
    }
    if(idxs.length < 2 && !(first_anchor_selected && sp[i].closed)) continue;
    
    // adjust the array (closed path)
    if(sp[i].closed){
      if(first_anchor_selected){
        idxs[idxs.length - 1].push(0);
      } else {
        ary = idxs.shift();
        idxs[idxs.length - 1] = idxs[idxs.length - 1].concat( ary );
      }
    }

    // duplicate the path and apply the data of the array
    for(j = 0; j < idxs.length; j++){
      ary = idxs[j];
      ancs = [];
      
      for(k=ary.length - 1; k >= 0; k--) ancs.unshift(p[ary[k]].anchor);
      
      with(sp[i].duplicate()){
        closed = false;
        setEntirePath(ancs);
        
        for(k = pathPoints.length - 1; k >= 0; k--){
          with(pathPoints[k]){
            rightDirection = p[ary[k]].rightDirection;
            leftDirection  = p[ary[k]].leftDirection;
            pointType      = p[ary[k]].pointType;
          }
        }
      }
    }
    sp[i].remove(); // remove the original path
  }
}

// ------------------------------------------------
// extract PathItems from the selection which length of PathPoints
// is greater than "n"
function getPathItemsInSelection(n, paths){
  if(documents.length < 1) return;
  
  var s = activeDocument.selection;
  
  if (!(s instanceof Array) || s.length < 1) return;

  extractPaths(s, n, paths);
}

// --------------------------------------
// extract PathItems from "s" (Array of PageItems -- ex. selection),
// and put them into an Array "paths".  If "pp_length_limit" is specified,
// this function extracts PathItems which PathPoints length is greater
// than this number.
function extractPaths(s, pp_length_limit, paths){
  for(var i = 0; i < s.length; i++){
    if(s[i].typename == "PathItem"
       && !s[i].guides && !s[i].clipping){
      if(pp_length_limit
         && s[i].pathPoints.length <= pp_length_limit){
        continue;
      }
      paths.push(s[i]);
      
    } else if(s[i].typename == "GroupItem"){
      // search for PathItems in GroupItem, recursively
      extractPaths(s[i].pageItems, pp_length_limit, paths);
      
    } else if(s[i].typename == "CompoundPathItem"){
      // searches for pathitems in CompoundPathItem, recursively
      // ( ### Grouped PathItems in CompoundPathItem are ignored ### )
      extractPaths(s[i].pathItems, pp_length_limit , paths);
    }
  }
}

// --------------------------------------
function isSelected(p){
  return p.selected == PathPointSelection.ANCHORPOINT;
}
