This is an effort to reduce the time spent mousing through menus in Adobe Illustrator for options that I use frequently as a cartographer. It is a group of .ai scripts useful for cartography and shortcut settings for menu commands setup for Spark (Mac) and Auhohotkey (Win). I use a Mac, so i've tested this with MacOS 10.11.6 and Illustrator CS6 and CC 2018. For Windows I've tested this with Windows 7 with Illustrator CS6 and Illustrator CC 2018. NOTE: Until 8/2018, the method to use the shortcuts on Mac was the deprecated SPark app. Spark doesn't work with newer versions of MacOS and was pretty buggy, so the BetterTouchTool app is now used to fire the keyboard shortcuts.

## Installation

**Mac:**

1. Navigate to your 'en_US' (or another language) folder for your version of Illustrator. Mine was: /Applications/Adobe Illustrator CS6/Presets.localized/en_US
2. Rename the 'Scripts' folder to 'Scripts_default' 
3. Clone (or unzip) this repo into this folder: 
  * `git clone https://github.com/jamesw05/illustrator-shortcuts.git Scripts`
  *The important bit here is to have the Folder structure the same: en_US/Scripts/%all-of-the-scripts%*
4. Download and install BetterTouchTool: https://folivora.ai/ . You might need to "allow installation from an unidentified developer" in system prefs. There is a 45 day trial, but this app is so incredibly useful, it is worth every penny.
5. Open system preferences and allow BetterTouchTool to control your computer. System Preferences>Security and Privacy>Privacy
6. Import the Ai-CS6-CC2018-shortcuts.json file from this repo (docs/shortcuts/Ai-CS6-CC2018-shortcuts.json) into BetterTouchTool to load the shortcuts: (File>Revert to Spark Library Backup)
![import bettertouchtool presets](https://user-images.githubusercontent.com/799232/44233242-8976d980-a160-11e8-8ad2-d949f68de555.png "import bettertouchtool presets")
7. Restart illustrator to load the new scripts as 'File>Scripts' menu items
8. Print out the handy cheatsheet (docs/cheatsheet/ai-shortcut-cheatsheet-mac.ai), tape it to your monitor and unleash the productivity! 


**Win:**

1. Clone or unzip this repo to your /Users/Documents folder. (or whatever location is best for you)
2. Install Autohotkey: https://autohotkey.com/
3. Open docs/shortcuts/illustrator-shortcuts-win.ahk and set the `ScriptDir` path to the location of this git repo/all of the scripts.
4. Double-click the illustrator-shortcuts-win.ahk file to load it into AutoHotkey. You can manage/stop/reload if from the AHK icon in the System Tray.
5. Print out the handy cheatsheet (docs/cheatsheet/ai-shortcut-cheatsheet-win.ai), tape it to your monitor and unleash the productivity! 

Optional: make the .ahk file load on windows startup:
1. Ctrl+C on the 'Illustrator-shortcuts-win.ahk' file to copy it.
2. Open Windows Explorer and navigate to: C:\Users\username\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
3. Right click in that folder and 'Paste Shortcut'. Now the script will run every time you login. 

## Usage

**Selection**

**M**
Select Clipping Masks. -Clipping masks are defintiely useful for cartography. They work great when you want to retain layers and mask some of the features extending beyond a frame, like in an inset map. http://www.cartotalk.com/index.php?showtopic=9202

But often an imported .svg from qgis or arcmap will contain clipping masks which are generally annoying. Select them all, then delete. 

**I**
Select>Inverse - Just a menu command, but o-so useful. used with other 'select same... functions' and layer locks can really speed up sorting, organizing, and deleting objects.

**F**
Select>Same>Fill Color - Select objects with the same fill color. Use in conjunction with Find/Replace Objects to replace glyphs with normal Illustrator symbols. (Even in groups and different layers!).

**S**
Select>Same>Stroke Color

**K**
Select>Same>Graphic Style

**A**
Select>Same>Appearance

**H**
Select>Same>Symbol

**T**
Text Selection Wizard - This script allows you select and/or replace by size, a range os sizes, font family, font style, and combinations of all of these options

**Misc.**

**R**
Find/Replace Graphics - Used in conjunction with select>same>fill color can be used to select glyphs (text objects from Arcmap or MAPublisher LabelPro shields) which can then be replced with normal Ai symbols

**E**
File>Export - Indesign has it, why not add it to Ai?

**D**
File>Place - Indesign has it, why not add it to Ai?

**Z**
Zoom and center selection - Extrememly useful to select and object from the layer list that you can't seem to find and go right to it.

**5**
Save all open docs - A common task for me is: open 10 .ai documents>Do a single trask to each one>Run this script>stretch my legs and get a coffee while they all save.

**Q**
Save all open docs and close Ai - same as above but close illustrator

**Paths**

**^**
Arc Correction - useful for drawing a line you want to put a label on, which never is *quite* even. Run this script to straighten it out. Works on path(s) and path text objects.

**&**
Arc Correction Flip - Flip the orientation of a path(s) or text path(s). useful if you want to place a label on the opposite site of a feature that it was auto-placed on. 

**-**
Stroke weight -0.1pt - the arrows to adjust stroke weight by a whole postscript point are way to coarse. run this to quickly adjust a stroke weight in 0.1pt increments. Note: this script can make large, complex docs become unresponsive.

**+**
Stroke weight +0.1pt - the arrows to adjust stroke weight by a whole postscript point are way to coarse. run this to quickly adjust a stroke weight in 0.1pt increments. Note: this script can make large, complex docs become unresponsive.

**P**
Object>Path>Simplify - Used all the time. Never mouse through this menu again!

**W**
Reverse Path Direction - Very useful for a path that you want to apply type to which is oriented in the wrong direction. 

**C**
Close points - Close an open path. based on the two closest open ends

**o**
Object>Path>Offset Path - Just a menu shortcut

**V**
Object>Path>Round Any Corner - great for smoothing out really complex lines (like complicated/switchback-y roads from a GIS)

**x**
Cut at selected anchor - So useful

**Text**

**[**
Align text to left without moving the text.

**]**
Align text to right without moving the text.

**\\**
Align text to center without moving the text.

**/**
Set leading of selected text object(s) to the font size value.

**>**
Batch increase text size of text object(s) by x points.

## License/Credits
See docs/License
