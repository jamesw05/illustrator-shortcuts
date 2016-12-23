#illustrator-scripts

This is an effort to reduce the time spent mousing through menus in Adobe Illustrator for options that I use frequently as a cartographer. It is a group of .ai scripts useful for cartography and shortcut settings for menu commands setup for Spark (Mac) and Auhohotkey (Win). I use a Mac, so i've tested this with MacOS 10.11.6 and Illustrator CS6 and CC 2017. For Windows I've tested this with Windows 7 and Illustrator CS6.

## Installation

**Mac:**

1. Navigate to your 'en_US' (or another language) folder for your version of Illustrator. Mine was: /Applications/Adobe Illustrator CS6/Presets.localized/en_US
2. Rename the 'Scripts' folder to 'Scripts_default' 
3. Clone (or unzip) this repo into this folder: 
  * `git clone https://github.com/jamesw05/illustrator-shortcuts.git Scripts`
  *The important bit here is to have the Folder structure the same: en_US/Scripts/%all-of-the-scripts%*
4. Download and install Spark: https://www.macupdate.com/app/mac/14352/spark
5. Open system preferences and allow spark app to control your computer. System Preferences>Security and Privacy>Privacy
6. Import the .splx file from this repo (docs/shortcuts/illustrator-shortcuts-mac.splx) into Spark to load the shortcuts: (File>Revert to Spark Library Backup) 
7. Print out the handy cheatsheet (docs/cheatsheet/ai-shortcut-cheatsheet-mac.ai), tape it to your monitor and unleash the productivity! 

**Win:**

1. Clone or unzip this repo to your User/Documents folder. (or whereever, whatever throws your hair back)
2. Install Autohotkey: https://autohotkey.com/
3. Open docs/shortcuts/illustrator-shortcuts-win.ahk and set the `SetWorkingDir` path
3. Ctrl+C on the 'Illustrator-shortcuts-win.ahk' file to copy it.
4. Open Windows Explorer and navigate to: C:\Users\username\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
5. Right click in that folder and 'Paste Shortcut'. Now the script will run every time you login. 
7. Print out the handy cheatsheet (docs/cheatsheet/ai-shortcut-cheatsheet-win.ai), tape it to your monitor and unleash the productivity! 

## Usage

Check out downfallnotes.com/ for some details on how I use these shortcuts and scripts when making maps.

## License/Credits
See docs/License
