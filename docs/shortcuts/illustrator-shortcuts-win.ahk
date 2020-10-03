#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %ScriptDir%  ; Ensures a consistent starting directory.
 

 ; Set the location of the scripts here. no trailing slash. 
ScriptDir := "C:\Users\username\Documents\illustrator-shortcuts"

#IfWinActive ahk_class illustrator

 ; script definitions:

 ; SELECTION

^+m::Send !soc Return ; Select>Object>Clipping Masks
^+i::Send !si Return ; Select>Inverse
^+f::Send !smf Return ; Select>Same>Fill Color
^+s::Send !sms Return ; Select>Same>Stroke Color
^+k::Send !smt Return ; Select>Same>Graphic Style
^+a::Send !sma Return ; Select>Same>Appearance
^+h::Send !smi Return ; Select>Same>Symbol Instance
^+t::Run, Illustrator.exe %ScriptDir%\findTextBySizeOrFontname.jsx ; File>Scripts>findTextBySizeOrFontname.jsx

 ; MISC.

^+r::Run, Illustrator.exe %ScriptDir%\Find_Replace_Graphics.js ; File>Scripts>Find_Replace_Graphics.js
^+e::Send !fe Return ; File>Export...
^+d::Send !fl Return ; File>Place
^+z::Run, Illustrator.exe %ScriptDir%\ZoomAndCenterSelection.js ; File>Scripts>ZoomAndCenterSelection.js
^+5::Run, Illustrator.exe %ScriptDir%\Save-All.jsx ; File>Scripts>Save-All.jsx
^+Q::Run, Illustrator.exe %ScriptDir%\wr-saveandcloseall.js ; File>Scripts>wr-saveandcloseall.js


 ; PATHS

^+6::Run, Illustrator.exe %ScriptDir%\ArcCorrection.jsx ; File>Scripts>ArcCorrection.jsx 
^+7::Run, Illustrator.exe %ScriptDir%\ArcCorrectionFlip.jsx ; File>Scripts>ArcCorrectionFlip.jsx
^+v::Run, Illustrator.exe %ScriptDir%\RoundAnyCorner.jsx ; File>Scripts>RoundAnyCorner.jsx 
^+-::Run, Illustrator.exe %ScriptDir%\stroke_minus.js ; File>Scripts>strokeminus.js
^+=::Run, Illustrator.exe %ScriptDir%\stroke_plus.js ; File>Scripts>stroke_plus.js
^+p::Send !{o}{p}{Right}{m}Return ; Object>Path>Simplify...
^+y::Send !{o}{p}{Right}{u}Return ; Object>Path>Outine Path
^+w::Run, Illustrator.exe %ScriptDir%\wr-reversepathdirection.js ; File>Scripts>wr-reversepathdirection.js
^+c::Run, Illustrator.exe %ScriptDir%\ClosePts.js ; File>Scripts>ClosePts.js  
^+x::Run, Illustrator.exe %ScriptDir%\CutAtSelectedAnchors.jsx ; File>Scripts>CutAtSelectedAnchors.jsx
^+o::Send !{o}{p}{Right}{o}Return ; Object>Path>Offset Path  

 ; TEXT
^+u::Send !fr{Raw}alignTextFieldLeft Return ; align left
^+[::Run, Illustrator.exe %ScriptDir%\alignTextFieldLeft.jsx ; File>Scripts>alignTextFieldLeft.jsx
^+]::Run, Illustrator.exe %ScriptDir%\alignTextFieldRight.jsx ; File>Scripts>alignTextFieldRight.jsx
^+\::Run, Illustrator.exe %ScriptDir%\alignTextFieldCenter.jsx ; File>Scripts>alignTextFieldCenter.jsx
^+/::Run, Illustrator.exe %ScriptDir%\fixTextLeading.jsx ; File>Scripts>fixTextLeading.jsx
^+.::Run, Illustrator.exe %ScriptDir%\fontSizeIncrement.jsx ; File>Scripts>fontSizeIncrement.jsx
^+B::Run, Illustrator.exe %ScriptDir%\batchTextEdit.jsx ; File>Scripts>batchTextEdit.jsx