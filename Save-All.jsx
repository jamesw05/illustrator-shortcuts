for (i=0; i<app.documents.length; i++)  
    {  
        var idoc = app.documents[i];  
        //alert("+"+idoc.path+"+");  
        if (idoc.path == "")  
            {  
                file = File.saveDialog ("Save file...");  
                idoc.saveAs (file);  
            }  
        else  
            {  
                //alert(idoc.name);  
                if (!idoc.saved)  
                    {   
                        idoc.save();  
                        idoc.saved = true;  
                    }  
            }  
    }  