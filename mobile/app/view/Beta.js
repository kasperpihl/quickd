Ext.define('QuickD.view.Beta', {
    extend: 'Ext.Panel',
    requires:[
    ],
    xtype: 'betaview',
    config: {
        layout:'vbox',
        // We give it a left and top property to make it floating by default    
        centered:true,
        width: "80%",
        height: "60%",
        showAnimation: {
            type: 'fadeIn',
            duration: 500
        },
        hideAnimation: {
            type: 'fadeOut',
            duration: 500
        },
        // Make it modal so you can click the mask to hide the overlay
        hideOnMaskTap: false,
        hidden: true,
        styleHtmlContent: true,
        scrollable: true,
        id:'quickd-beta-screen',
        items: [{
            xtype:'panel',
            html:'Dette er en lukket beta i Aarhus, indtast den betakode du har modtaget'
        },{
            xtype:'textfield',
            id:'betakeyField'
        },{
            xtype:'button',
            width:150,
            ui:'confirm',
            id:'usebeta',
            text:'Brug nøgle'
        }]
    }
}); 