// Round Any Corner

// rounds selected corners of PathItems.
// Especially for the corners at the intersection point of curves,
// this script may work better than "Round Corners" filter (but slower).

// ## How To Use

//  1. Select the anchor(s) or whole path(s) to round.
//  2. Run this script. Adjust the values in the dialog.
//     Then click OK.

// ## Rounding Method
// Basically, the rounding method is compatible with the "Round Corners" filter.
// It is to add two anchors instead of the original anchor, at the points of
// specified line length from each selected corner.  So if there're too many
// anchors on original path, this script can not round nicely.

// ## Radius
// Actually, the specified "radius" is not for a radius of arcs which drawn.
// It is for the line length from each selected corner and is for the base
// to compute the length of handles.  The reason calling it "radius" is
// for compatibility with the "Round Corners" filter.

// ## Max TextBox
// You can change the max value of the slider by the the "max" textbox.
// Input the value and click "apply".
// Inputed number of digits after decimal point is reflected to the slider value.
// If the max value is "10.00", you can set the value like 8.23 with the slider.
// If it is "10", you can set the value as integer.

// This script does not round the corners which already rounded.
// (for example, select a circle and run this script does nothing)

// ### notice
// In the rounding process, the script merges anchors which nearly
// overlapped (when the distance between anchors is less than 0.05 points).

// This script does not work for some part of compound paths.
// When this occurs, please select part of the compound path or release the compound path and
// select them, then run script again.
// I still have not figured out how to get properties from grouped paths inside a compound path.

// If you prefer the slider interface of the previous version,
// uncomment the lines which marked as "uncomment to use slider-version".

// test env: Adobe Illustrator CC (Win/Mac)

// Copyright(c) 2005-2015 Hiroyuki Sato
// https://github.com/shspage
// This script is distributed under the MIT License.
// See the LICENSE file for details.

// Tue, 07 Jul 2015 20:09:01 +0900

main();
function main(){
    // setting ----------------------------------------------
    
    // -- rr : rounding radius ( unit : point )
    
    // ------------------------------------------------------
    var conf = {
        rr : 5,
        maxSliderValue : "100",
        unit : "pt",
        errmsg : ""
        }
    
    var paths = [];
    getPathItemsInSelection(1, paths); // extract pathItems which pathpoints length is greater than 1
    if(paths.length < 1) return;

    var selectedSpec = getSelectedSpec(paths);
        
    var previewed = false;
    
    var clearPreview = function(){
        if(previewed){
            undo();
            redraw();
            previewed = false;
            applySelectedSpec( paths, selectedSpec );
        }
    }
    
    var drawPreview = function(){
        if( conf.rr > 0){
            roundAnyCorner( paths, conf );
            previewed = true;
        }
    }
    
    var getRoundDigit = function( s ){
        var n = 0;
        if(s.indexOf(".") >= 0){
            n = s.replace(/^[^\.]+\./, "").length;
        }
        return n;
    }
    
    if( conf.rr > conf.maxSliderValue ) conf.rr = conf.maxSliderValue;
    
    var round_digit = getRoundDigit( conf.maxSliderValue );
    
    // show a dialog
    var win = new Window("dialog", "Round Any Corner" );
    win.alignChildren = "fill";

    win.sliderPanel = win.add("panel", undefined, "radius");
    win.sliderPanel.orientation = "column";
    win.sliderPanel.alignChildren = "fill";
    win.sliderPanel.gp1 = win.sliderPanel.add("group");
    /* // uncomment to use slider-version
    win.sliderPanel.gp1.radiusSlider = win.sliderPanel.gp1.add("slider", undefined, conf.rr, 0, conf.maxSliderValue);
    win.sliderPanel.gp1.radiusSlider.size = [180, 20];
    */
    win.sliderPanel.gp1.txtBox = win.sliderPanel.gp1.add("edittext", undefined, conf.rr);
    win.sliderPanel.gp1.txtBox.justify = "right";
    win.sliderPanel.gp1.txtBox.characters = 8;
    /* // uncomment to use slider-version
    win.sliderPanel.gp1.txtBox.characters = 5;
    */
    win.sliderPanel.gp1.txtBox.helpTip = "hit TAB to set the input value temporarily";

    /* // uncomment to use slider-version
    win.sliderPanel.gp2 = win.sliderPanel.add("group");
    win.sliderPanel.gp2.alignment = "right";
    win.sliderPanel.gp2.maxValueCaptionText = win.sliderPanel.gp2.add("statictext", undefined, "max");
    win.sliderPanel.gp2.maxValueTextBox = win.sliderPanel.gp2.add("edittext", undefined, conf.maxSliderValue);
    win.sliderPanel.gp2.maxValueTextBox.characters = 6;
    win.sliderPanel.gp2.maxValueTextBox.justify = "right";
    win.sliderPanel.gp2.applyMaxValueButton = win.sliderPanel.gp2.add("button", undefined, "apply");
    win.sliderPanel.gp2.applyMaxValueButton.size = [60, 24];
    */
    
    win.unitRadioPanel = win.add("panel", undefined, "unit" );
    win.unitRadioPanel.orientation = "row";
    win.sliderPanel.alignChildren = "fill";
    win.unitRadioPanel.ptRb = win.unitRadioPanel.add("radiobutton", undefined, "pt/px");
    win.unitRadioPanel.mmRb = win.unitRadioPanel.add("radiobutton", undefined, "mm");
    win.unitRadioPanel.inchRb = win.unitRadioPanel.add("radiobutton", undefined, "inch");
    
    win.chkGroup = win.add("group");
    win.chkGroup.alignment = "center";
    win.chkGroup.previewChk = win.chkGroup.add("checkbox", undefined, "preview");
    
    win.btnGroup = win.add("group", undefined );
    win.btnGroup.alignment = "center";
    win.btnGroup.okBtn = win.btnGroup.add("button", undefined, "OK");
    win.btnGroup.cancelBtn = win.btnGroup.add("button", undefined, "Cancel");
    
    if( conf.unit == "mm" ){
        win.unitRadioPanel.mmRb.value = true;
    } else if( conf.unit == "inch"){
        win.unitRadioPanel.inchRb.value = true;
    } else {
        win.unitRadioPanel.ptRb.value = true;
        conf.unit = "pt";
    }
    
    var getValues = function(){
        conf.rr = win.sliderPanel.gp1.txtBox.text;
        
        if(win.unitRadioPanel.mmRb.value){
            conf.rr = convertUnit(win.sliderPanel.gp1.txtBox.text, "mm", "pt");
        } else if(win.unitRadioPanel.inchRb.value){
            conf.rr = convertUnit(win.sliderPanel.gp1.txtBox.text, "inch", "pt");
        }
    }
    
    var processPreview = function( is_preview ){
        if( ! is_preview || win.chkGroup.previewChk.value){
            win.enabled = false;
            getValues();
            clearPreview();
            drawPreview();
            if( is_preview ) redraw();
            win.enabled = true;
        }
    }

    /* // uncomment to use slider-version
    win.sliderPanel.gp2.applyMaxValueButton.onClick = function(){
        win.enabled = false;
        var mv = win.sliderPanel.gp2.maxValueTextBox.text.replace(/[^0-9\.]/g ,"");
        
        with(win.sliderPanel.gp1.radiusSlider){
            if( mv == "" || isNaN(mv) ){
                alert("please input a number for the max value");
                mv = maxvalue;
            } else {
                round_digit = getRoundDigit( mv );
            }
            
            if(value > mv) value = mv;
            var v = value;
            maxvalue = mv;
            value = v;
        }
        with(win.sliderPanel.gp1){
            txtBox.text = radiusSlider.value.toFixed( round_digit );
        }
        processPreview( true );
        win.enabled = true;
    }
    */
  
    win.unitRadioPanel.ptRb.onClick = function(){
        processPreview( true );
    }
    win.unitRadioPanel.mmRb.onClick = function(){
        processPreview( true );
    }
    win.unitRadioPanel.inchRb.onClick = function(){
        processPreview( true );
    }
    win.chkGroup.previewChk.onClick = function(){
        if( win.chkGroup.previewChk.value ){
            processPreview( true );
        } else {
            if(previewed){
                clearPreview();
                redraw();
            }
        }
    }
    
    win.sliderPanel.gp1.txtBox.onChange = function(){
      var v = parseFloat(this.text);
      
      if(isNaN(v)){
        v = conf.rr;
      } else if(v < 0){
        v = 0;
      /* // uncomment to use slider-version
      } else if(v > win.sliderPanel.gp1.radiusSlider.maxvalue){
        v = win.sliderPanel.gp1.radiusSlider.maxvalue;
      */
      }
       this.text = v;
      /* // uncomment to use slider-version
      win.sliderPanel.gp1.radiusSlider.value = v;
      */
      processPreview( true );
    }

    /* // uncomment to use slider-version
    win.sliderPanel.gp1.radiusSlider.onChanging = function(){
        win.sliderPanel.gp1.txtBox.text = this.value.toFixed( round_digit );
    }
    win.sliderPanel.gp1.radiusSlider.onChange = function(){
        win.sliderPanel.gp1.txtBox.text = this.value.toFixed( round_digit );
        processPreview( true );
    }
    */
  
    win.btnGroup.okBtn.onClick = function(){
        processPreview( false );
        win.close();
    }
    
    win.btnGroup.cancelBtn.onClick = function(){
        win.enabled = false;
        clearPreview();
        win.enabled = true;
        win.close();
    }
    win.show();
    
    // error messasges aren't implemented for now
    if( conf.errmsg != "") alert( conf.errmsg );
}

function convertUnit(n, fromUnit, toUnit){
    if( fromUnit == "pt" ){
        if( toUnit == "mm"){
            n *= 0.352777778;
        } else if( toUnit == "inch"){
            n /= 72;
        }
    } else if( fromUnit == "mm"){
        if( toUnit == "pt"){
            n *= 2.83464567;
        } else if( toUnit == "inch"){
            n /= 25.4;
        }
    } else if( unit == "inch"){
        if( toUnit == "pt"){
            n *= 72;
        } else if( toUnit == "mm"){
            n *= 25.4;
        }
    }
    return n;
}

function roundAnyCorner( s, conf ){
    var rr = conf.rr;
    
 // var tim = new Date();
  var p, op, pnts;
  var skipList, adjRdirAtEnd, redrawFlg;
  var i, nxi, pvi, q, d,ds, r, g, t, qb;
  var anc1, ldir1, rdir1, anc2, ldir2, rdir2;
  
  var hanLen = 4 * (Math.sqrt(2) - 1) / 3;
  var ptyp = PointType.SMOOTH;

  for(var j = 0; j < s.length; j++){
    p = s[j].pathPoints;
   if(readjustAnchors(p) < 2) continue; // reduce anchors
    op = !s[j].closed;
    pnts = op ? [getDat(p[0])] : [];
    redrawFlg = false;
    adjRdirAtEnd = 0;

    skipList = [(op || !isSelected(p[0]) || ! isCorner(p, 0))];
    for(i = 1; i < p.length; i++){
      skipList.push((! isSelected(p[i])
                     || ! isCorner(p,i)
                     || (op && i == p.length - 1)));
    }
    
    for(i = 0; i < p.length; i++){
      nxi = parseIdx(p, i + 1);
      if(nxi < 0) break;
      
      pvi = parseIdx(p, i - 1);

      q = [p[i].anchor,          p[i].rightDirection,
           p[nxi].leftDirection, p[nxi].anchor];

      ds = dist(q[0], q[3]) / 2;
      if(arrEq(q[0], q[1]) && arrEq(q[2], q[3])){  // straight side
        r = Math.min(ds, rr);
        g = getRad(q[0], q[3]);
        anc1 = getPnt(q[0], g, r);
        ldir1 = getPnt(anc1, g + Math.PI, r * hanLen);
        
        if(skipList[nxi]){
          if(!skipList[i]){
            pnts.push([anc1, anc1, ldir1, ptyp]);
            redrawFlg = true;
          }
          pnts.push(getDat(p[nxi]));
        } else {
          if(r<rr){  // when the length of the side is less than rr * 2
            pnts.push([anc1,
                       getPnt(anc1, getRad(ldir1, anc1), r * hanLen),
                       ldir1,
                       ptyp]);
          } else {
            if(!skipList[i]) pnts.push([anc1, anc1, ldir1, ptyp]);
            anc2 = getPnt(q[3], g+Math.PI, r);
            pnts.push([anc2,
                       getPnt(anc2, g, r * hanLen),
                       anc2,
                       ptyp]);
          }
          redrawFlg = true;
        }
      } else {  // not straight side
        d = getT4Len(q, 0) / 2;
        r = Math.min(d,rr);
        t = getT4Len(q, r);
        anc1 = bezier(q, t);
        rdir1 = defHan(t, q, 1);
        ldir1 = getPnt(anc1, getRad(rdir1, anc1), r * hanLen);

        if(skipList[nxi]){
          if(skipList[i]){
            pnts.push(getDat(p[nxi]));
          } else {
            pnts.push([anc1, rdir1, ldir1, ptyp]);
            with(p[nxi]) pnts.push([anchor,
                                    rightDirection,
                                    adjHan(anchor, leftDirection, 1 - t),
                                    ptyp]);
            redrawFlg = true;
          }
        } else { // skipList[nxi] = false
          if(r < rr){  // the length of the side is less than rr * 2
            if(skipList[i]){
              if(!op && i == 0){
                adjRdirAtEnd = t;
              } else {
                pnts[pnts.length-1][1] = adjHan(q[0], q[1], t);
              }
              pnts.push([anc1,
                         getPnt(anc1, getRad(ldir1, anc1), r * hanLen),
                         defHan(t, q, 0),
                         ptyp]);
            } else {
              pnts.push([anc1,
                         getPnt(anc1, getRad(ldir1, anc1), r * hanLen),
                         ldir1,
                         ptyp]);
            }
          } else {  // round the corner with the radius rr
            if(skipList[i]){
              t = getT4Len(q, -r);
              anc2 = bezier(q, t);
              
              if(!op && i==0) {
                adjRdirAtEnd = t;
              } else {
                pnts[pnts.length - 1][1] = adjHan(q[0], q[1], t);
              }

              ldir2 = defHan(t, q, 0);
              rdir2 = getPnt(anc2, getRad(ldir2, anc2), r * hanLen);

              pnts.push([anc2, rdir2, ldir2 , ptyp]);
            } else {
              qb = [anc1, rdir1, adjHan(q[3], q[2], 1 - t), q[3]];
              t = getT4Len(qb, -r);
              anc2 = bezier(qb, t);
              ldir2 = defHan(t,qb,0);
              rdir2 = getPnt(anc2, getRad(ldir2, anc2), r*hanLen);
              rdir1 = adjHan(anc1, rdir1, t);

              pnts.push([anc1, rdir1, ldir1, ptyp],
                        [anc2, rdir2, ldir2, ptyp]);
            }
          }
          redrawFlg = true;
        }
      }
    }
    if(adjRdirAtEnd > 0){
      pnts[pnts.length - 1][1] = adjHan(p[0].anchor, p[0].rightDirection, adjRdirAtEnd);
    }
    
    if(redrawFlg){
      // redraw
      for(i = p.length-1; i > 0; i--) p[i].remove();
      
      for(i = 0; i < pnts.length; i++){
        pt = i > 0 ? p.add() : p[0];
        with(pt){
          anchor         = pnts[i][0];
          rightDirection = pnts[i][1];
          leftDirection  = pnts[i][2];
          pointType      = pnts[i][3];
        }
      }
    }
  }
  activeDocument.selection = s;
  // alert(new Date() - tim);
}

// ------------------------------------------------
// return [x,y] of the distance "len" and the angle "rad"(in radian)
// from "pt"=[x,y]
function getPnt(pt, rad, len){
  return [pt[0] + Math.cos(rad) * len,
          pt[1] + Math.sin(rad) * len];
}

// ------------------------------------------------
// return the [x, y] coordinate of the handle of the point on the bezier curve
// that corresponds to the parameter "t"
// n=0:leftDir, n=1:rightDir
function defHan(t, q, n){
  return [t * (t * (q[n][0] - 2 * q[n+1][0] + q[n+2][0]) + 2 * (q[n+1][0] - q[n][0])) + q[n][0],
          t * (t * (q[n][1] - 2 * q[n+1][1] + q[n+2][1]) + 2 * (q[n+1][1] - q[n][1])) + q[n][1]];
}

// -----------------------------------------------
// return the [x, y] coordinate on the bezier curve
// that corresponds to the paramter "t"
function bezier(q, t) {
  var u = 1 - t;
  return [u*u*u * q[0][0] + 3*u*t*(u* q[1][0] + t* q[2][0]) + t*t*t * q[3][0],
          u*u*u * q[0][1] + 3*u*t*(u* q[1][1] + t* q[2][1]) + t*t*t * q[3][1]];
}

// ------------------------------------------------
// adjust the length of the handle "dir"
// by the magnification ratio "m",
// returns the modified [x, y] coordinate of the handle
// "anc" is the anchor [x, y]
function adjHan(anc, dir, m){
  return [anc[0] + (dir[0] - anc[0]) * m,
          anc[1] + (dir[1] - anc[1]) * m];
}

// ------------------------------------------------
// return true if the pathPoints "p[idx]" is a corner
function isCorner(p, idx){
  var pnt0 = getAnglePnt(p, idx, -1);
  var pnt1 = getAnglePnt(p, idx,  1);
  if(! pnt0 || ! pnt1) return false;                    // at the end of a open-path
  if(pnt0.length < 1 || pnt1.length<1) return false;   // anchor is overlapping, so cannot determine the angle
  var rad = getRad2(pnt0, p[idx].anchor, pnt1, true);
  if(rad > Math.PI - 0.1) return false;   // set the angle tolerance here
  return true;
}
// ------------------------------------------------
// "p"=pathPoints, "idx1"=index of pathpoint
// "dir" = -1, returns previous point [x,y] to get the angle of tangent at pathpoints[idx1]
// "dir" =  1, returns next ...
function getAnglePnt(p, idx1, dir){
  if(!dir) dir = -1;
  var idx2 = parseIdx(p, idx1 + dir);
  if(idx2 < 0) return null;  // at the end of a open-path
  var p2 = p[idx2];
  with(p[idx1]){
    if(dir<0){
      if(arrEq(leftDirection, anchor)){
        if(arrEq(p2.anchor, anchor)) return [];
        if(arrEq(p2.anchor, p2.rightDirection)
           || arrEq(p2.rightDirection, anchor)) return p2.anchor;
        else return p2.rightDirection;
      } else {
        return leftDirection;
      }
    } else {
      if(arrEq(anchor, rightDirection)){
        if(arrEq(anchor, p2.anchor)) return [];
        if(arrEq(p2.anchor, p2.leftDirection)
           || arrEq(anchor, p2.leftDirection)) return p2.anchor;
        else return p2.leftDirection;
      } else {
        return rightDirection;
      }
    }
  }
}
// --------------------------------------
// if the contents of both arrays are equal, return true (lengthes must be same)
function arrEq(arr1, arr2) {
  for(var i = 0; i < arr1.length; i++){
    if (arr1[i] != arr2[i]) return false;
  }
  return true;
}

// ------------------------------------------------
// return the distance between p1=[x,y] and p2=[x,y]
function dist(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2)
                   + Math.pow(p1[1] - p2[1], 2));
}
// ------------------------------------------------
// return the squared distance between p1=[x,y] and p2=[x,y]
function dist2(p1, p2) {
  return Math.pow(p1[0] - p2[0],2)
       + Math.pow(p1[1] - p2[1],2);
}
// --------------------------------------
// return the angle in radian
// of the line drawn from p1=[x,y] from p2
function getRad(p1,p2) {
  return Math.atan2(p2[1] - p1[1],
                    p2[0] - p1[0]);
}

// --------------------------------------
// return the angle between two line segments
// o-p1 and o-p2 ( 0 - Math.PI)
function getRad2(p1, o, p2){
  var v1 = normalize(p1, o);
  var v2 = normalize(p2, o);
  return Math.acos(v1[0] * v2[0] + v1[1] * v2[1]);
}
// ------------------------------------------------
function normalize(p, o){
  var d = dist(p, o);
  return d == 0 ? [0, 0] : [(p[0] - o[0]) / d,
                            (p[1] - o[1]) / d];
}

// ------------------------------------------------
// return the bezier curve parameter "t"
// at the point which the length of the bezier curve segment
// (from the point start drawing) is "len"
// when "len" is 0, return the length of whole this segment.
function getT4Len(q, len){
  var m = [ q[3][0] - q[0][0] + 3 * (q[1][0] - q[2][0]),
            q[0][0] - 2 * q[1][0] + q[2][0],
            q[1][0] - q[0][0] ];
  var n = [ q[3][1] - q[0][1] + 3 * (q[1][1] - q[2][1]),
            q[0][1] - 2 * q[1][1] + q[2][1],
            q[1][1] - q[0][1] ];
  var k = [ m[0] * m[0] + n[0] * n[0],
            4 * (m[0] * m[1] + n[0] * n[1]),
            2 * ((m[0] * m[2] + n[0] * n[2]) + 2 * (m[1] * m[1] + n[1] * n[1])),
            4 * (m[1] * m[2] + n[1] * n[2]),
            m[2] * m[2] + n[2] * n[2] ];
  
   var fullLen = getLength(k, 1);

  if(len == 0){
    return fullLen;
    
  } else if(len < 0){
    len += fullLen;
    if(len < 0) return 0;

  } else if(len > fullLen){
    return 1;
  }
  
  var t, d;
  var t0 = 0;
  var t1 = 1;
  var torelance = 0.001;
  
  for(var h = 1; h < 30; h++){
    t = t0 + (t1 - t0) / 2;
    d = len - getLength(k, t);
    if(Math.abs(d) < torelance) break;
    else if(d < 0) t1 = t;
    else t0 = t;
  }
  return t;
}

// ------------------------------------------------
// return the length of bezier curve segment
// in range of parameter from 0 to "t"
function getLength(k, t){
  var h = t / 128;
  var hh = h * 2;
  var fc = function(t, k){
    return Math.sqrt(t * (t * (t * (t * k[0] + k[1]) + k[2]) + k[3]) + k[4]) || 0 };
  var total = (fc(0, k) - fc(t, k)) / 2;
  for(var i = h; i < t; i += hh) total += 2 * fc(i, k) + fc(i + h, k);
  return total * hh;
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
    if(s[i].typename == "PathItem"){
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
// merge nearly overlapped anchor points 
// return the length of pathpoints after merging
function readjustAnchors(p){
  // Settings ==========================

  // merge the anchor points when the distance between
  // 2 points is within ### square root ### of this value (in point)
  var minDist = 0.0025; 
  
  // ===================================
  if(p.length < 2) return 1;
  var i;

  if(p.parent.closed){
    for(i = p.length - 1; i >= 1; i--){
      if(dist2(p[0].anchor, p[i].anchor) < minDist){
        p[0].leftDirection = p[i].leftDirection;
        p[i].remove();
      } else {
        break;
      }
    }
  }
  
  for(i = p.length - 1; i >= 1; i--){
    if(dist2(p[i].anchor, p[i - 1].anchor) < minDist){
      p[i - 1].rightDirection = p[i].rightDirection;
      p[i].remove();
    }
  }
  
  return p.length;
}
// -----------------------------------------------
// return pathpoint's index. when the argument is out of bounds,
// fixes it if the path is closed (ex. next of last index is 0),
// or return -1 if the path is not closed.
function parseIdx(p, n){ // PathPoints, number for index
  var len = p.length;
  if(p.parent.closed){
    return n >= 0 ? n % len : len - Math.abs(n % len);
  } else {
    return (n < 0 || n > len - 1) ? -1 : n;
  }
}
// -----------------------------------------------
function getDat(p){ // pathPoint
  with(p) return [anchor, rightDirection, leftDirection, pointType];
}
// -----------------------------------------------
function isSelected(p){ // PathPoint
  return p.selected == PathPointSelection.ANCHORPOINT;
}
// -----------------------------------------------
function getSelectedSpec( paths ){
    var specs = [];
    var j, pp, spec;
    for( var i = 0; i < paths.length; i++ ){
        pp = paths[i].pathPoints;
        spec = [];
        for( j = 0; j < pp.length; j++ ){
            spec.push( pp[j].selected );
        }
        specs.push( spec );
    }
    return specs;
}
// -----------------------------------------------
function applySelectedSpec( paths, specs ){
    var j, pp;
    for( var i = 0; i < paths.length; i++ ){
        pp = paths[i].pathPoints;
        for( j = 0; j < pp.length; j++ ){
            pp[j].selected = specs[i][j];
        }
    }
}
