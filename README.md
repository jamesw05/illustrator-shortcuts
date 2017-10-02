#illustrator-scripts

This is an effort to reduce the time spent mousing through menus in Adobe Illustrator for options that I use frequently as a cartographer. It is a group of .ai scripts useful for cartography and shortcut settings for menu commands setup for Spark (Mac) and Auhohotkey (Win). I use a Mac, so i've tested this with MacOS 10.11.6 and Illustrator CS6 and CC 2017. For Windows I've tested this with Windows 7 and Illustrator CC 2017.

## Installation

**Mac:**

1. Navigate to your 'en_US' (or another language) folder for your version of Illustrator. Mine was: /Applications/Adobe Illustrator CS6/Presets.localized/en_US
2. Rename the 'Scripts' folder to 'Scripts_default' 
3. Clone (or unzip) this repo into this folder: 
  * `git clone https://github.com/jamesw05/illustrator-shortcuts.git Scripts`
  *The important bit here is to have the Folder structure the same: en_US/Scripts/%all-of-the-scripts%*
4. Download and install Spark: https://www.shadowlab.org/softwares/spark.php . You might need to "allow installation from an unidentified developer" in system prefs.
5. Open system preferences and allow spark app to control your computer. System Preferences>Security and Privacy>Privacy
6. Import the .splx file from this repo (docs/shortcuts/illustrator-shortcuts-mac.splx) into Spark to load the shortcuts: (File>Revert to Spark Library Backup) 
7. Restart illustrator to load the new scripts as 'File>Scripts' menu items
7. Print out the handy cheatsheet (docs/cheatsheet/ai-shortcut-cheatsheet-mac.ai), tape it to your monitor and unleash the productivity! 

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

Check out downfallnotes.com/ for some details on how I use these shortcuts and scripts when making maps.

###Selection

####M
Select Clipping Masks. -Clipping masks are defintiely useful for cartography. They work great when you want to retain layers and mask some of the features extending beyond a frame, like in an inset map. http://www.cartotalk.com/index.php?showtopic=9202

But often an imported .svg from qgis or arcmap will contain clipping masks which are generally annoying. Select them all, then delete. 

####I
Select>Inverse - Just a menu command, but o-so useful. used with other 'select same... functions' and layer locks can really speed up sorting, organizing, and deleting objects.

####F
Select>Same>Fill Color - Select objects with the same fill color. Use in conjunction with Find/Replace Objects to replace glyphs with normal Illustrator symbols. (Even in groups and different layers!).

####S
Select>Same>Stroke Color

####K
Select>Same>Graphic Style

####A
Select>Same>Appearance

####H
Select>Same>Symbol

####T
Select Text By Size - This script allows you to enter a type size or a range of type sizes to select.

###Misc.

####R
Find/Replace Graphics - Used in conjunction with select>same>fill color can be used to select glyphs (text objects from Arcmap or MAPublisher LabelPro shields) which can then be replced with normal Ai symbols

####E
File>Export - Indesign has it, why not add it to Ai?

####D
File>Place - Indesign has it, why not add it to Ai?

####Z
Zoom and center selection - Extrememly useful to select and object from the layer list that you can't seem to find and go right to it.

####5
Save all open docs - A common task for me is: open 10 .ai documents>Do a single trask to each one>Run this script>stretch my legs and get a coffee while they all save.

####Q
Save all open docs and close Ai - same as above but close illustrator

###Paths

####^
Arc Correction - useful for drawing a line you want to put a label on, which never is *quite* even. Run this script to straighten it out

####-
Stroke weight -0.1pt - the arrows to adjust stroke weight by a whole postscript point are way to coarse. run this to quickly adjust a stroke weight in 0.1pt increments

####+
Stroke weight +0.1pt - the arrows to adjust stroke weight by a whole postscript point are way to coarse. run this to quickly adjust a stroke weight in 0.1pt increments

####P
Object>Path>Simplify - Used all the time. Never mouse through this menu again!

####W
Reverse Path Direction - Very useful for a path that you want to apply type to which is oriented in the wrong direction. 

####C
Close points - Close an open path. based on the two closest open ends

####J
Join Nearest Path - Join a bunch of open paths together. This script omitted from this repository: https://github.com/nvkelso/illustrator-scripts/tree/master/other-authors/james_talmage

####o
Object>Path>Offset Path - Just a menu shortcut

####x
Cut at selected anchor - So useful

####[
Align text to left without moving the text.

####]
Align text to right without moving the text.

####\
Align text to center without moving the text.

## License/Credits
See docs/License
