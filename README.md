
<snippet>
  <content><![CDATA[
# ${1:Project Name}
This is an effort to reduce the time spent mousing through menus in Adobe Illustrator for options that I use frequently as a cartographer. It is a group of .ai scripts useful for cartography and shortcut settings for menu commands setup for Spark (Mac) and Auhohotkey (Win). I use a Mac, so i've tested this with MacOS 10.11.6 and Illustrator CS6 and CC 2017. For Windows I've tested this with Windows 7 and Illustrator CS6.

## Installation

Mac:
Install Spark: 
1. Navigate to your 'en_US' (or another language) folder for your version of Illustrator. Mine was: 
/Applications/Adobe Illustrator CS6/Presets.localized/en_US
2. Rename the 'Scripts' folder to 'Scripts_default' 
3. Clone (or unzip) this repo into this folder: 
`git clone https://github.com/jamesw05/illustrator-shortcuts.git Scripts`
The important bit here is to have the Folder structre the same: en_US/Scripts/%all-of-the-scripts%
4. Download and install Spark: https://www.macupdate.com/app/mac/14352/spark
5. Open system preferences and allow spark app to control your computer. System Preferences>Security and Privacy>Privacy
6. Import the .splx file from this repo (docs/schortcuts/illustrator-shortcuts-mac.splx) into Spark to load the shortcuts: (File>Revert to Spark Library Backup) 
7. Print out the handy cheatsheet (docs/cheatsheet/ai-shortcut-cheatsheet-mac.ai), tape it to your monitor and unleash the productivity! 

## Usage

Check out downfallnotes.com/ for some details on how I use these shortcuts and scripts.

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
## History
TODO: Write history
## Credits
TODO: Write credits
## License
TODO: Write license
]]></content>
  <tabTrigger>readme</tabTrigger>
</snippet>