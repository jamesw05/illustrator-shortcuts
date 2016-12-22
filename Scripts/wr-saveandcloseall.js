//////////////////////////////////////////////////////////// english //
// --------------------------
// -=> WR-SaveAndCloseAll <=-
// --------------------------
//
// A Javascript for Adobe Illustrator
// by Wolfgang Reszel (ai-js@rumborak.de)
//
// Version 0.2 from 5.8.2003
//
// This script saves and closes all open documents.
//
// To enable the english messages change the "de" into "en" in line 40.
//
// Sorry for my bad english. For any corrections send an email to:
// ai-js@rumborak.de
//
//////////////////////////////////////////////////////////// Deutsch //
// --------------------------
// -=> WR-SaveAndCloseAll <=-
// --------------------------
//
// Ein Javascript fuer Adobe Illustrator
// von Wolfgang Reszel (ai-js@rumborak.de)
//
// Version 0.2 vom 5.8.2003
//
// Dieses Skript speichert und schliesst alle offenen Dokumente.
//
// Um dieses Skript mit deutschen Meldungen zu versehen, muss in Zeile
// 40 das "en" durch ein "de" ersetzt werden.
//
// Verbesserungsvorschlaege an: ai-js@rumborak.de
//

//$.bp();

// -------------------------------------------------------------------

var language="en";   // "de" fuer Deutsch

// -------------------------------------------------------------------

var WR="WR-SaveAndCloseAll v0.2\n\n";

if (language == "de") {

  var MSG_nodocs = WR+"Kein Dokument ge\xF6ffnet.";
  var MSG_ask = WR+"Sollen alle Dokumente gespeichert und geschlossen werden?";

} else {

  var MSG_nodocs = WR+"You have no open document."
  var MSG_ask = WR+"Are you sure to save and close all open documents?";
}

var itemstoprocess=0;
var error=0;
var Docs=documents.length;

if (Docs<1) {
  error++;
  alert(MSG_nodocs);
} else {
  if(confirm(MSG_ask)) {
    for(var i=0;i<Docs;i++) {
      activeDocument.close(SaveOptions.SAVECHANGES);
    }
  }
}
